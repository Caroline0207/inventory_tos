-- Run this once in Supabase (SQL Editor -> New query -> Run)
-- if you set up the database before the "Delete this day" feature existed.
-- New installs don't need it: schema.sql already includes it.

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

revoke execute on function public.delete_day(text, date) from public;
grant execute on function public.delete_day(text, date) to anon, authenticated;
