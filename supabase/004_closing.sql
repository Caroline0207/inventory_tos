-- Run this once in Supabase (SQL Editor -> New query -> Run)
-- to add the Closing checklist. Safe to run again. Keeps all data.
-- New installs don't need it: schema.sql already includes it.

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

revoke execute on function public.save_closing(text, date, text, text, jsonb), public.get_closing_day(text, date), public.list_closing_days(text, integer), public.delete_closing_day(text, date) from public;
grant execute on function public.save_closing(text, date, text, text, jsonb), public.get_closing_day(text, date), public.list_closing_days(text, integer), public.delete_closing_day(text, date) to anon, authenticated;
