-- Run this once in Supabase (SQL Editor -> New query -> Run)
-- to allow the Store #2 weekly (Saturday) check. Safe to run again. Keeps all data.
-- New installs don't need it: schema.sql already includes it.
-- Needs 005_store2_check.sql to have been run first.

create or replace function public.save_store_check(p_pin text, p_store text, p_date date, p_name text, p_answers jsonb, p_extra text)
returns bigint language plpgsql security definer set search_path = '' as $$
declare new_id bigint; u integer; o integer; l integer;
begin
  perform private.require_pin(p_pin, 'staff');
  if p_store not in ('store2', 'store2w') then raise exception 'invalid_store'; end if;
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

revoke execute on function public.save_store_check(text, text, date, text, jsonb, text) from public;
grant execute on function public.save_store_check(text, text, date, text, jsonb, text) to anon, authenticated;
