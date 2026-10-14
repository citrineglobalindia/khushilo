-- Emails listed here become admin as soon as their account is created (private table: RLS on, no policies).
create table if not exists bootstrap_admins (email text primary key);
alter table bootstrap_admins enable row level security;
insert into bootstrap_admins(email) values ('khushiloindiatech@gmail.com') on conflict do nothing;

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles(id, full_name, role) values (new.id, new.raw_user_meta_data->>'full_name',
    case when exists (select 1 from bootstrap_admins b where b.email = lower(new.email)) then 'admin'::app_role else 'customer'::app_role end)
  on conflict do nothing;
  return new;
end $$;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
