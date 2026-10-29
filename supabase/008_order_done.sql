-- Run this once in Supabase (SQL Editor -> New query -> Run)
-- to turn on the "Done" button on Store #1 Orders by Supplier. Safe to run again. Keeps all data.
-- New installs don't need it: schema.sql already includes it.
-- Needs 005_store2_check.sql to have been run first.

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

revoke execute on function public.get_store1_orders(text, integer), public.mark_orders_done(text, text[], text), public.undo_orders_done(text, text[]) from public;
grant execute on function public.get_store1_orders(text, integer), public.mark_orders_done(text, text[], text), public.undo_orders_done(text, text[]) to anon, authenticated;
