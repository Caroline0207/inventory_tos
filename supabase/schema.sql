-- =====================================================================
-- Daily Inventory — Supabase schema
-- Run this whole file once in Supabase: Dashboard → SQL Editor → New query → Run.
-- Safe to run again: it only adds what is missing and never deletes data.
--
-- Security model
--   * The browser only holds the public "publishable" key.
--   * Tables have Row Level Security ON and NO policies, so the public key
--     cannot read or write them directly.
--   * The browser can only call the functions below, and every one of them
--     checks the shop PIN (staff) or the manager PIN (admin) first.
--   * PINs are stored as bcrypt hashes, never as plain text.
-- =====================================================================

create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;
create schema if not exists private;

-- ---------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------
create table if not exists public.products (
  id            uuid primary key default gen_random_uuid(),
  name          text not null check (length(trim(name)) > 0),
  note          text not null default '',          -- e.g. Korean name 맛살
  target_stock  numeric(10,2) check (target_stock is null or target_stock >= 0),
  unit          text not null default '',
  active        boolean not null default true,
  sort_order    integer not null default 0,
  needs_review  text,                              -- set when the handwritten sheet was unclear
  created_at    timestamptz not null default now()
);

create table if not exists public.inventory_records (
  id                 bigint generated always as identity primary key,
  inventory_date     date not null,
  product_id         uuid not null references public.products(id) on delete restrict,
  shortage_quantity  numeric(10,2) not null default 0 check (shortage_quantity >= 0),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  constraint inventory_records_date_product_key unique (inventory_date, product_id)
);
create index if not exists inventory_records_product_date_idx
  on public.inventory_records (product_id, inventory_date desc);

-- Who saved each day (one row per save, so morning + afternoon edits both show)
create table if not exists public.inventory_saves (
  id              bigint generated always as identity primary key,
  inventory_date  date not null,
  saved_by        text not null,
  saved_at        timestamptz not null default now()
);
create index if not exists inventory_saves_date_idx on public.inventory_saves (inventory_date, saved_at);
alter table public.inventory_saves enable row level security;
revoke all on table public.inventory_saves from anon, authenticated;

create table if not exists private.settings (
  key   text primary key,
  value text not null
);

alter table public.products          enable row level security;
alter table public.inventory_records enable row level security;
revoke all on table public.products, public.inventory_records from anon, authenticated;
revoke all on schema private from public;

-- ---------------------------------------------------------------------
-- PIN helpers (private schema: not reachable from the browser)
-- ---------------------------------------------------------------------
create or replace function private.set_pin(p_role text, p_pin text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if p_role not in ('staff','admin') then raise exception 'role must be staff or admin'; end if;
  if p_pin is null or length(p_pin) < 4 then raise exception 'PIN must be at least 4 characters'; end if;
  insert into private.settings(key, value)
  values (p_role || '_pin_hash', extensions.crypt(p_pin, extensions.gen_salt('bf', 8)))
  on conflict (key) do update set value = excluded.value;
end $$;

create or replace function private.pin_role(p_pin text)
returns text language sql stable security definer set search_path = '' as $$
  select case
    when p_pin is null or p_pin = '' then null
    when exists (select 1 from private.settings s
                 where s.key = 'admin_pin_hash' and s.value = extensions.crypt(p_pin, s.value)) then 'admin'
    when exists (select 1 from private.settings s
                 where s.key = 'staff_pin_hash' and s.value = extensions.crypt(p_pin, s.value)) then 'staff'
    else null end
$$;

create or replace function private.require_pin(p_pin text, p_need text)
returns void language plpgsql stable security definer set search_path = '' as $$
declare r text := private.pin_role(p_pin);
begin
  if r is null or (p_need = 'admin' and r <> 'admin') then
    raise exception 'invalid_pin' using errcode = '28P01';
  end if;
end $$;

-- ---------------------------------------------------------------------
-- Functions the web app calls (POST /rest/v1/rpc/<name>)
-- ---------------------------------------------------------------------

-- Which role does this PIN unlock? Returns 'staff' or 'admin'.
create or replace function public.check_pin(p_pin text)
returns text language plpgsql stable security definer set search_path = '' as $$
declare r text := private.pin_role(p_pin);
begin
  if r is null then raise exception 'invalid_pin' using errcode = '28P01'; end if;
  return r;
end $$;

-- All products, active and inactive, in display order.
create or replace function public.get_products(p_pin text)
returns setof public.products language plpgsql stable security definer set search_path = '' as $$
begin
  perform private.require_pin(p_pin, 'staff');
  return query select * from public.products p order by p.sort_order, p.name;
end $$;

-- One day's saved shortages.
create or replace function public.get_day(p_pin text, p_date date)
returns table (product_id uuid, shortage_quantity numeric, updated_at timestamptz)
language plpgsql stable security definer set search_path = '' as $$
begin
  perform private.require_pin(p_pin, 'staff');
  return query
    select r.product_id, r.shortage_quantity, r.updated_at
    from public.inventory_records r where r.inventory_date = p_date;
end $$;

-- Save (or overwrite) one day. p_items = [{"product_id": "...", "qty": 2}, ...]
-- One row per product per day thanks to the unique constraint.
-- p_name = who checked the stock; every save is logged in inventory_saves.
drop function if exists public.save_day(text, date, jsonb);
create or replace function public.save_day(p_pin text, p_date date, p_items jsonb, p_name text default null)
returns integer language plpgsql security definer set search_path = '' as $$
declare n integer;
begin
  perform private.require_pin(p_pin, 'staff');
  if p_date is null or p_date < current_date - 7 or p_date > current_date + 1 then
    raise exception 'invalid_date';
  end if;
  if jsonb_typeof(p_items) <> 'array' then raise exception 'invalid_items'; end if;

  insert into public.inventory_records as r (inventory_date, product_id, shortage_quantity)
  select distinct on (p.id) p_date, p.id, greatest(0, round(coalesce((x->>'qty')::numeric, 0), 2))
  from jsonb_array_elements(p_items) x
  join public.products p on p.id = (x->>'product_id')::uuid
  order by p.id
  on conflict (inventory_date, product_id)
  do update set shortage_quantity = excluded.shortage_quantity, updated_at = now();
  get diagnostics n = row_count;

  insert into public.inventory_saves (inventory_date, saved_by)
  values (p_date, left(coalesce(nullif(trim(p_name), ''), '(no name)'), 40));
  return n;
end $$;

-- List of saved days, newest first, with who checked.
drop function if exists public.list_days(text, integer);
create or replace function public.list_days(p_pin text, p_limit integer default 120)
returns table (inventory_date date, short_count bigint, item_count bigint, updated_at timestamptz, checked_by text)
language plpgsql stable security definer set search_path = '' as $$
begin
  perform private.require_pin(p_pin, 'staff');
  return query
    select r.inventory_date,
           count(*) filter (where r.shortage_quantity > 0),
           count(*),
           max(r.updated_at),
           (select string_agg(x.saved_by, ', ' order by x.first_at)
              from (select s.saved_by, min(s.saved_at) as first_at
                      from public.inventory_saves s
                     where s.inventory_date = r.inventory_date
                     group by s.saved_by) x)
    from public.inventory_records r
    group by r.inventory_date
    order by r.inventory_date desc
    limit greatest(1, least(coalesce(p_limit, 120), 1000));
end $$;

-- Every save for one day, oldest first.
create or replace function public.get_day_saves(p_pin text, p_date date)
returns table (saved_by text, saved_at timestamptz)
language plpgsql stable security definer set search_path = '' as $$
begin
  perform private.require_pin(p_pin, 'staff');
  return query
    select s.saved_by, s.saved_at from public.inventory_saves s
    where s.inventory_date = p_date order by s.saved_at;
end $$;

-- One product's history, newest first.
create or replace function public.get_product_history(p_pin text, p_product_id uuid, p_limit integer default 90)
returns table (inventory_date date, shortage_quantity numeric)
language plpgsql stable security definer set search_path = '' as $$
begin
  perform private.require_pin(p_pin, 'staff');
  return query
    select r.inventory_date, r.shortage_quantity
    from public.inventory_records r
    where r.product_id = p_product_id
    order by r.inventory_date desc
    limit greatest(1, least(coalesce(p_limit, 90), 1000));
end $$;

-- Add (p_id null) or edit a product. Manager PIN only. Products are never deleted:
-- set p_active = false to hide one from Daily Inventory and keep its history.
create or replace function public.upsert_product(
  p_pin text, p_id uuid, p_name text, p_note text, p_target numeric, p_unit text, p_active boolean)
returns public.products language plpgsql security definer set search_path = '' as $$
declare out_row public.products;
begin
  perform private.require_pin(p_pin, 'admin');
  if p_name is null or length(trim(p_name)) = 0 then raise exception 'name_required'; end if;
  if p_target is not null and p_target < 0 then raise exception 'invalid_target'; end if;

  if p_id is null then
    insert into public.products (name, note, target_stock, unit, active, sort_order)
    values (trim(p_name), coalesce(trim(p_note), ''), round(p_target, 2), coalesce(trim(p_unit), ''),
            coalesce(p_active, true),
            (select coalesce(max(sort_order), 0) + 10 from public.products))
    returning * into out_row;
  else
    update public.products set
      name = trim(p_name), note = coalesce(trim(p_note), ''), target_stock = round(p_target, 2),
      unit = coalesce(trim(p_unit), ''), active = coalesce(p_active, true), needs_review = null
    where id = p_id
    returning * into out_row;
    if out_row.id is null then raise exception 'not_found'; end if;
  end if;
  return out_row;
end $$;

-- Delete every record for one day. Manager PIN only. Products are not touched.
create or replace function public.delete_day(p_pin text, p_date date)
returns integer language plpgsql security definer set search_path = '' as $$
declare n integer;
begin
  perform private.require_pin(p_pin, 'admin');
  if p_date is null then raise exception 'invalid_date'; end if;
  delete from public.inventory_records r where r.inventory_date = p_date;
  get diagnostics n = row_count;
  delete from public.inventory_saves s where s.inventory_date = p_date;
  return n;
end $$;

-- ---------------------------------------------------------------------
-- Closing checklist: one row per day per role (server, cook, rice, sushi, leader).
-- items = [{"id":"s1","label":"Sweep the floor","done":true}, ...] (labels kept so
-- old records still read correctly if the checklist changes later).
-- ---------------------------------------------------------------------
create table if not exists public.closing_checks (
  id           bigint generated always as identity primary key,
  check_date   date not null,
  role         text not null check (role in ('server','cook','rice','sushi','leader')),
  checked_by   text not null,
  items        jsonb not null default '[]'::jsonb,
  done_count   integer not null default 0,
  total_count  integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint closing_checks_date_role_key unique (check_date, role)
);
alter table public.closing_checks enable row level security;
revoke all on table public.closing_checks from anon, authenticated;

-- Submit (or re-submit) one role's closing for a day.
create or replace function public.save_closing(p_pin text, p_date date, p_role text, p_name text, p_items jsonb)
returns integer language plpgsql security definer set search_path = '' as $$
declare d integer; t integer;
begin
  perform private.require_pin(p_pin, 'staff');
  if p_date is null or p_date < current_date - 7 or p_date > current_date + 1 then raise exception 'invalid_date'; end if;
  if p_role not in ('server','cook','rice','sushi','leader') then raise exception 'invalid_role'; end if;
  if p_name is null or length(trim(p_name)) = 0 then raise exception 'name_required'; end if;
  if jsonb_typeof(p_items) <> 'array' then raise exception 'invalid_items'; end if;
  select count(*) filter (where (x->>'done')::boolean), count(*) into d, t from jsonb_array_elements(p_items) x;
  insert into public.closing_checks (check_date, role, checked_by, items, done_count, total_count)
  values (p_date, p_role, left(trim(p_name), 40), p_items, d, t)
  on conflict (check_date, role) do update
    set checked_by = excluded.checked_by, items = excluded.items,
        done_count = excluded.done_count, total_count = excluded.total_count, updated_at = now();
  return d;
end $$;

-- All roles submitted for one day.
create or replace function public.get_closing_day(p_pin text, p_date date)
returns table (role text, checked_by text, items jsonb, done_count integer, total_count integer, updated_at timestamptz)
language plpgsql stable security definer set search_path = '' as $$
begin
  perform private.require_pin(p_pin, 'staff');
  return query
    select c.role, c.checked_by, c.items, c.done_count, c.total_count, c.updated_at
    from public.closing_checks c where c.check_date = p_date;
end $$;

-- Closing days, newest first.
create or replace function public.list_closing_days(p_pin text, p_limit integer default 120)
returns table (check_date date, roles_submitted bigint, roles_complete bigint, leader text, updated_at timestamptz)
language plpgsql stable security definer set search_path = '' as $$
begin
  perform private.require_pin(p_pin, 'staff');
  return query
    select c.check_date,
           count(*) filter (where c.role <> 'leader'),
           count(*) filter (where c.role <> 'leader' and c.done_count = c.total_count),
           max(c.checked_by) filter (where c.role = 'leader'),
           max(c.updated_at)
    from public.closing_checks c
    group by c.check_date
    order by c.check_date desc
    limit greatest(1, least(coalesce(p_limit, 120), 1000));
end $$;

-- Delete one day's closing records. Manager PIN only.
create or replace function public.delete_closing_day(p_pin text, p_date date)
returns integer language plpgsql security definer set search_path = '' as $$
declare n integer;
begin
  perform private.require_pin(p_pin, 'admin');
  delete from public.closing_checks c where c.check_date = p_date;
  get diagnostics n = row_count;
  return n;
end $$;

-- ---------------------------------------------------------------------
-- Store #2 inventory checks: 'store2' = regular check, 'store2w' = weekly (Saturday) check.
-- Every submission is its own row
-- (checks can happen more than once a day).
-- answers = [{"id":"i01","name":"Unagi Sauce","ko":"…","choice":"1통 이상 / 1+ Container","status":"SAFE","level":"ok"}, ...]
-- ---------------------------------------------------------------------
create table if not exists public.store_checks (
  id            bigint generated always as identity primary key,
  store         text not null default 'store2',
  check_date    date not null,
  checked_by    text not null,
  answers       jsonb not null default '[]'::jsonb,
  extra_request text,
  urgent_count  integer not null default 0,
  order_count   integer not null default 0,
  low_count     integer not null default 0,
  created_at    timestamptz not null default now()
);
create index if not exists store_checks_store_created_idx on public.store_checks (store, created_at desc);
alter table public.store_checks enable row level security;
revoke all on table public.store_checks from anon, authenticated;

create or replace function public.save_store_check(p_pin text, p_store text, p_date date, p_name text, p_answers jsonb, p_extra text)
returns bigint language plpgsql security definer set search_path = '' as $$
declare new_id bigint; u integer; o integer; l integer;
begin
  perform private.require_pin(p_pin, 'staff');
  if p_store not in ('store2', 'store2w', 's1server', 's1sushi', 's1middle', 's1cook') then raise exception 'invalid_store'; end if;
  if p_date is null or p_date < current_date - 7 or p_date > current_date + 1 then raise exception 'invalid_date'; end if;
  if p_name is null or length(trim(p_name)) = 0 then raise exception 'name_required'; end if;
  if jsonb_typeof(p_answers) <> 'array' then raise exception 'invalid_items'; end if;
  select count(*) filter (where x->>'level' = 'urgent'),
         count(*) filter (where x->>'level' in ('order', 'request')),
         count(*) filter (where x->>'level' = 'low')
    into u, o, l from jsonb_array_elements(p_answers) x;
  insert into public.store_checks (store, check_date, checked_by, answers, extra_request, urgent_count, order_count, low_count)
  values (p_store, p_date, left(trim(p_name), 40), p_answers, nullif(left(trim(coalesce(p_extra, '')), 1000), ''), u, o, l)
  returning id into new_id;
  return new_id;
end $$;

create or replace function public.list_store_checks(p_pin text, p_store text, p_limit integer default 100)
returns table (id bigint, check_date date, checked_by text, urgent_count integer, order_count integer, low_count integer, has_request boolean, created_at timestamptz)
language plpgsql stable security definer set search_path = '' as $$
begin
  perform private.require_pin(p_pin, 'staff');
  return query
    select s.id, s.check_date, s.checked_by, s.urgent_count, s.order_count, s.low_count, s.extra_request is not null, s.created_at
    from public.store_checks s where s.store = p_store
    order by s.created_at desc
    limit greatest(1, least(coalesce(p_limit, 100), 1000));
end $$;

create or replace function public.get_store_check(p_pin text, p_id bigint)
returns table (id bigint, check_date date, checked_by text, answers jsonb, extra_request text, created_at timestamptz)
language plpgsql stable security definer set search_path = '' as $$
begin
  perform private.require_pin(p_pin, 'staff');
  return query
    select s.id, s.check_date, s.checked_by, s.answers, s.extra_request, s.created_at
    from public.store_checks s where s.id = p_id;
end $$;

create or replace function public.delete_store_check(p_pin text, p_id bigint)
returns integer language plpgsql security definer set search_path = '' as $$
declare n integer;
begin
  perform private.require_pin(p_pin, 'admin');
  delete from public.store_checks s where s.id = p_id;
  get diagnostics n = row_count;
  return n;
end $$;

-- Store #1 "Orders by Supplier": items stay on the list until a manager marks them done.
create table if not exists public.order_done (
  id        bigint generated always as identity primary key,
  item_key  text not null,                 -- item id (e.g. s1001) or 'extra:<check id>'
  done_at   timestamptz not null default now(),
  done_by   text
);
create index if not exists order_done_key_idx on public.order_done (item_key, done_at desc);
alter table public.order_done enable row level security;

-- Items flagged order/out in any Store #1 check after they were last marked done (newest flag wins).
create or replace function public.get_store1_orders(p_pin text, p_days integer default 60)
returns table (item_key text, store text, name text, ko text, choice text, level text,
               check_date date, checked_by text, flagged_at timestamptz, last_done timestamptz)
language plpgsql stable security definer set search_path = '' as $$
begin
  perform private.require_pin(p_pin, 'staff');
  return query
    with flags as (
      select x->>'id' as k, s.store, x->>'name' as nm, x->>'ko' as kk, x->>'choice' as ch, x->>'level' as lv,
             s.check_date as cd, s.checked_by as cb, s.created_at as at
      from public.store_checks s, jsonb_array_elements(s.answers) x
      where s.store like 's1%' and s.created_at > now() - make_interval(days => greatest(1, least(coalesce(p_days, 60), 365)))
        and x->>'level' in ('order', 'urgent') and coalesce(x->>'id', '') <> ''
      union all
      select 'extra:' || s.id, s.store, s.extra_request, null, s.extra_request, 'request', s.check_date, s.checked_by, s.created_at
      from public.store_checks s
      where s.store like 's1%' and s.extra_request is not null
        and s.created_at > now() - make_interval(days => greatest(1, least(coalesce(p_days, 60), 365)))
    ), d as (
      select o.item_key as k, max(o.done_at) as last_done from public.order_done o group by o.item_key
    )
    select distinct on (f.k) f.k, f.store, f.nm, f.kk, f.ch, f.lv, f.cd, f.cb, f.at, d.last_done
    from flags f left join d on d.k = f.k
    where d.last_done is null or f.at > d.last_done
    order by f.k, f.at desc;
end $$;

-- Mark items as ordered (manager PIN). Returns how many were marked.
create or replace function public.mark_orders_done(p_pin text, p_keys text[], p_name text)
returns integer language plpgsql security definer set search_path = '' as $$
declare n integer;
begin
  perform private.require_pin(p_pin, 'admin');
  if p_keys is null or cardinality(p_keys) = 0 or cardinality(p_keys) > 500 then raise exception 'invalid_items'; end if;
  insert into public.order_done (item_key, done_by)
  select distinct left(k, 60), nullif(left(trim(coalesce(p_name, '')), 40), '') from unnest(p_keys) k where k is not null and length(k) > 0;
  get diagnostics n = row_count;
  return n;
end $$;

-- Undo the most recent "done" for these items (manager PIN).
create or replace function public.undo_orders_done(p_pin text, p_keys text[])
returns integer language plpgsql security definer set search_path = '' as $$
declare n integer;
begin
  perform private.require_pin(p_pin, 'admin');
  delete from public.order_done o
  where o.id in (select distinct on (x.item_key) x.id from public.order_done x where x.item_key = any(p_keys) order by x.item_key, x.done_at desc);
  get diagnostics n = row_count;
  return n;
end $$;

-- Only these functions are callable from the browser.
revoke execute on all functions in schema public  from public, anon, authenticated;
revoke execute on all functions in schema private from public, anon, authenticated;
grant execute on function
  public.check_pin(text),
  public.get_products(text),
  public.get_day(text, date),
  public.save_day(text, date, jsonb, text),
  public.list_days(text, integer),
  public.get_day_saves(text, date),
  public.get_product_history(text, uuid, integer),
  public.upsert_product(text, uuid, text, text, numeric, text, boolean),
  public.delete_day(text, date),
  public.save_closing(text, date, text, text, jsonb),
  public.get_closing_day(text, date),
  public.list_closing_days(text, integer),
  public.delete_closing_day(text, date),
  public.save_store_check(text, text, date, text, jsonb, text),
  public.list_store_checks(text, text, integer),
  public.get_store_check(text, bigint),
  public.delete_store_check(text, bigint),
  public.get_store1_orders(text, integer),
  public.mark_orders_done(text, text[], text),
  public.undo_orders_done(text, text[])
to anon, authenticated;

-- ---------------------------------------------------------------------
-- Starting product list, read from the two handwritten sheets.
-- Inserted only when the products table is empty.
-- Rows with needs_review were unclear on the photo: fix them on the Products page.
-- ---------------------------------------------------------------------
insert into public.products (name, note, target_stock, unit, sort_order, needs_review)
select v.name, v.note, v.target_stock, v.unit, v.sort_order, v.needs_review
from (values
  -- Sheet 2 (Rice → Avocado) comes first
  ('Rice',                   '',               10::numeric, 'EA',  10, 'Size column is slanted on the sheet; confirm Rice = 10 EA'),
  ('Salt',                   '',                1,          'EA',  20, 'Size column is slanted on the sheet; confirm Salt = 1 EA'),
  ('Tempura Batter',         '',                0.5,        'Bag', 30, 'Size column is slanted on the sheet; confirm Tempura Batter = 1/2 Bag'),
  ('Soy Sauce (Bulk)',       '',                2,          'CON', 40, null),
  ('Shoga',                  '생강',            1,          'CON', 50, null),
  ('Rice Vinegar',           '',                2,          'Box', 60, null),
  ('Soy Sauce (To-go)',      'To-go용',         4,          'Box', 70, null),
  ('Wasabi',                 '',                3,          'Bag', 80, null),
  ('Roasted Seaweed (Full)', '',               10,          'Bag', 90, null),
  ('Roasted Seaweed (Half)', '',               10,          'Bag', 100, null),
  ('Sesame Seed (W)',        'White',           4,          'Bag', 110, null),
  ('Sesame Seed (B)',        'Black',           1,          'Bag', 120, null),
  ('Unagi Sauce',            '',               10,          'EA',  130, null),
  ('Teriyaki Sauce',         '',               10,          'EA',  140, null),
  ('Okonomi Sauce',          '',               10,          'EA',  150, null),
  ('Sushi Tenkasu 6kg',      '판코',            1,          'EA',  160, null),
  ('Udon Tenkasu 1kg',       '',                5,          'EA',  170, null),
  ('Instant Miso Soup',      '6 EA × 1 box',    4,          'Bag', 180, null),
  ('Onion Flake',            '',               10,          'Bag', 190, null),
  ('Avocado',                '',               null,        'Box', 200, 'Number before "Box" is cut off in the photo; the sheet may also continue below this row'),
  -- Sheet 1 (Bamboo Chopstick → Massago)
  ('Bamboo Chopstick',       '',                0.5,        'Box', 210, null),
  ('Hondashi',               '',               null,        '',    220, 'Target and unit are blank on the sheet'),
  ('Udon Noodle',            '',                1,          'Box', 230, null),
  ('Shrimp Tempura',         '',                5,          'Box', 240, null),
  ('Kani Stick',             '맛살',            1,          'Box', 250, null),
  ('Shredded Crab',          '1 Box × 12 EA',   1,          'Box', 260, null),
  ('Tobbiko (Red)',          '날치알 · 빨강',   5,          'EA',  270, null),
  ('Sushi Shrimp',           '초새우',          6,          'Bag', 280, null),
  ('Unagi',                  '',                0.5,        'Box', 290, null),
  ('Seaweed Salad',          '',                4,          'Bag', 300, null),
  ('Takoyaki',               '',                2,          'Bag', 310, null),
  ('Sushi Egg',              '',                5,          'EA',  320, null),
  ('Inari',                  '',                4,          'Bag', 330, null),
  ('Massago (Orange)',       '오렌지',          4,          'EA',  340, null)
) as v(name, note, target_stock, unit, sort_order, needs_review)
where not exists (select 1 from public.products);

-- ---------------------------------------------------------------------
-- LAST STEP — set your PINs (change the numbers before running!)
-- Staff PIN: for everyone who enters inventory.
-- Manager PIN: also allows editing products and target stock.
-- Run these two lines again any time you want to change a PIN.
-- ---------------------------------------------------------------------
-- select private.set_pin('staff', '000000');
-- select private.set_pin('admin', '999999');
