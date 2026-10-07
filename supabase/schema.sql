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
create or replace function public.save_day(p_pin text, p_date date, p_items jsonb)
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
  return n;
end $$;

-- List of saved days, newest first.
create or replace function public.list_days(p_pin text, p_limit integer default 120)
returns table (inventory_date date, short_count bigint, item_count bigint, updated_at timestamptz)
language plpgsql stable security definer set search_path = '' as $$
begin
  perform private.require_pin(p_pin, 'staff');
  return query
    select r.inventory_date,
           count(*) filter (where r.shortage_quantity > 0),
           count(*),
           max(r.updated_at)
    from public.inventory_records r
    group by r.inventory_date
    order by r.inventory_date desc
    limit greatest(1, least(coalesce(p_limit, 120), 1000));
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
  return n;
end $$;

-- Only these functions are callable from the browser.
revoke execute on all functions in schema public  from public, anon, authenticated;
revoke execute on all functions in schema private from public, anon, authenticated;
grant execute on function
  public.check_pin(text),
  public.get_products(text),
  public.get_day(text, date),
  public.save_day(text, date, jsonb),
  public.list_days(text, integer),
  public.get_product_history(text, uuid, integer),
  public.upsert_product(text, uuid, text, text, numeric, text, boolean),
  public.delete_day(text, date)
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
