-- Run this once in Supabase (SQL Editor -> New query -> Run)
-- to turn on "Done history" on Store #1 Orders by Supplier. Safe to run again. Keeps all data.
-- New installs don't need it: schema.sql already includes it. Needs 008_order_done.sql first.

-- Store #1 "Done history": what the manager marked as ordered in the last p_days days (default 60).
create or replace function public.get_store1_done_history(p_pin text, p_days integer default 60)
returns table (done_id bigint, done_at timestamptz, done_by text, item_key text, store text,
               name text, ko text, choice text, level text, check_date date)
language plpgsql stable security definer set search_path = '' as $$
begin
  perform private.require_pin(p_pin, 'staff');
  return query
    select o.id, o.done_at, o.done_by, o.item_key,
           coalesce(f.store, e.store), coalesce(f.nm, e.extra_request), f.kk,
           coalesce(f.ch, e.extra_request), coalesce(f.lv, case when e.store is not null then 'request' end),
           coalesce(f.cd, e.check_date)
    from public.order_done o
    left join lateral (
      select s.store, x->>'name' as nm, x->>'ko' as kk, x->>'choice' as ch, x->>'level' as lv, s.check_date as cd
      from public.store_checks s, jsonb_array_elements(s.answers) x
      where o.item_key not like 'extra:%' and s.store like 's1%' and x->>'id' = o.item_key and s.created_at <= o.done_at
      order by s.created_at desc limit 1
    ) f on true
    left join lateral (
      select s.store, s.extra_request, s.check_date from public.store_checks s
      where o.item_key like 'extra:%' and 'extra:' || s.id = o.item_key
    ) e on true
    where o.done_at > now() - make_interval(days => greatest(1, least(coalesce(p_days, 60), 365)))
    order by o.done_at desc
    limit 2000;
end $$;

revoke execute on function public.get_store1_done_history(text, integer) from public;
grant execute on function public.get_store1_done_history(text, integer) to anon, authenticated;
