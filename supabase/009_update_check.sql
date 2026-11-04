-- Run this once in Supabase (SQL Editor -> New query -> Run)
-- so staff can fix a check they submitted today (Update check). Safe to run again. Keeps all data.
-- New installs don't need it: schema.sql already includes it.

-- Fix a check that was submitted by mistake: staff can update a check within 36 hours of submitting it.
alter table public.store_checks add column if not exists updated_at timestamptz;

create or replace function public.update_store_check(p_pin text, p_id bigint, p_name text, p_answers jsonb, p_extra text)
returns bigint language plpgsql security definer set search_path = '' as $$
declare u integer; o integer; l integer; c timestamptz;
begin
  perform private.require_pin(p_pin, 'staff');
  select s.created_at into c from public.store_checks s where s.id = p_id;
  if c is null then raise exception 'not_found'; end if;
  if c < now() - interval '36 hours' then raise exception 'too_old'; end if;
  if p_name is null or length(trim(p_name)) = 0 then raise exception 'name_required'; end if;
  if jsonb_typeof(p_answers) <> 'array' then raise exception 'invalid_items'; end if;
  select count(*) filter (where x->>'level' = 'urgent'),
         count(*) filter (where x->>'level' in ('order', 'request')),
         count(*) filter (where x->>'level' = 'low')
    into u, o, l from jsonb_array_elements(p_answers) x;
  update public.store_checks s
     set checked_by = left(trim(p_name), 40), answers = p_answers,
         extra_request = nullif(left(trim(coalesce(p_extra, '')), 1000), ''),
         urgent_count = u, order_count = o, low_count = l, updated_at = now()
   where s.id = p_id;
  return p_id;
end $$;

revoke execute on function public.update_store_check(text, bigint, text, jsonb, text) from public;
grant execute on function public.update_store_check(text, bigint, text, jsonb, text) to anon, authenticated;
