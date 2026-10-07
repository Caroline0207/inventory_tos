-- Run this once in Supabase (SQL Editor -> New query -> Run)
-- to add "Checked by" (who saved each day). Safe to run again. Keeps all data.
-- New installs don't need it: schema.sql already includes it.

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

revoke execute on function public.save_day(text, date, jsonb, text), public.list_days(text, integer),
  public.get_day_saves(text, date), public.delete_day(text, date) from public;
grant execute on function public.save_day(text, date, jsonb, text), public.list_days(text, integer),
  public.get_day_saves(text, date), public.delete_day(text, date) to anon, authenticated;
