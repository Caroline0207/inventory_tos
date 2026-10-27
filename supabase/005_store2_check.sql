-- Run this once in Supabase (SQL Editor -> New query -> Run)
-- to add the Store #2 inventory check. Safe to run again. Keeps all data.
-- New installs don't need it: schema.sql already includes it.

-- ---------------------------------------------------------------------
-- Store #2 regular inventory check. Every submission is its own row
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
  if p_store not in ('store2') then raise exception 'invalid_store'; end if;
  if p_date is null or p_date < current_date - 7 or p_date > current_date + 1 then raise exception 'invalid_date'; end if;
  if p_name is null or length(trim(p_name)) = 0 then raise exception 'name_required'; end if;
  if jsonb_typeof(p_answers) <> 'array' then raise exception 'invalid_items'; end if;
  select count(*) filter (where x->>'level' = 'urgent'),
         count(*) filter (where x->>'level' = 'order'),
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

revoke execute on function public.save_store_check(text, text, date, text, jsonb, text), public.list_store_checks(text, text, integer), public.get_store_check(text, bigint), public.delete_store_check(text, bigint) from public;
grant execute on function public.save_store_check(text, text, date, text, jsonb, text), public.list_store_checks(text, text, integer), public.get_store_check(text, bigint), public.delete_store_check(text, bigint) to anon, authenticated;
