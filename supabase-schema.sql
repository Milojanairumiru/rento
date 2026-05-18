-- Rento Database Schema for Supabase
-- Run this in the SQL Editor in your Supabase dashboard

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Custom types
create type user_role as enum ('owner', 'renter');
create type vehicle_type as enum ('sedan', 'suv', 'hatchback', 'van', 'truck', 'luxury', 'electric');
create type transmission_type as enum ('automatic', 'manual');
create type fuel_type as enum ('petrol', 'diesel', 'electric', 'hybrid');
create type booking_status as enum ('pending', 'confirmed', 'active', 'completed', 'cancelled');

-- Profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  email text not null,
  avatar_url text,
  phone text,
  role user_role not null default 'renter',
  rating numeric(2,1) not null default 0,
  total_trips integer not null default 0,
  created_at timestamptz not null default now()
);

-- Vehicles table
create table public.vehicles (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  brand text not null,
  model text not null,
  year integer not null,
  type vehicle_type not null,
  transmission transmission_type not null default 'automatic',
  fuel_type fuel_type not null default 'petrol',
  seats integer not null default 5,
  price_per_day numeric(10,2) not null,
  location text not null,
  images text[] not null default '{}',
  description text not null default '',
  features text[] not null default '{}',
  rating numeric(2,1) not null default 0,
  total_trips integer not null default 0,
  available boolean not null default true,
  created_at timestamptz not null default now()
);

-- Bookings table
create table public.bookings (
  id uuid primary key default uuid_generate_v4(),
  vehicle_id uuid references public.vehicles(id) on delete cascade not null,
  renter_id uuid references public.profiles(id) on delete cascade not null,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  start_date date not null,
  end_date date not null,
  total_price numeric(10,2) not null,
  status booking_status not null default 'pending',
  created_at timestamptz not null default now()
);

-- Reviews table
create table public.reviews (
  id uuid primary key default uuid_generate_v4(),
  vehicle_id uuid references public.vehicles(id) on delete cascade not null,
  renter_id uuid references public.profiles(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text not null default '',
  created_at timestamptz not null default now()
);

-- Row Level Security (RLS) Policies

-- Profiles: everyone can read, users can update their own
alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- Vehicles: everyone can read, owners can manage their own
alter table public.vehicles enable row level security;

create policy "Vehicles are viewable by everyone"
  on public.vehicles for select using (true);

create policy "Owners can insert their own vehicles"
  on public.vehicles for insert with check (auth.uid() = owner_id);

create policy "Owners can update their own vehicles"
  on public.vehicles for update using (auth.uid() = owner_id);

create policy "Owners can delete their own vehicles"
  on public.vehicles for delete using (auth.uid() = owner_id);

-- Bookings: participants can view, renters can create, owners can update status
alter table public.bookings enable row level security;

create policy "Users can view their own bookings"
  on public.bookings for select
  using (auth.uid() = renter_id or auth.uid() = owner_id);

create policy "Renters can create bookings"
  on public.bookings for insert with check (auth.uid() = renter_id);

create policy "Booking participants can update"
  on public.bookings for update
  using (auth.uid() = renter_id or auth.uid() = owner_id);

-- Reviews: everyone can read, renters who completed a trip can create
alter table public.reviews enable row level security;

create policy "Reviews are viewable by everyone"
  on public.reviews for select using (true);

create policy "Renters can create reviews"
  on public.reviews for insert with check (auth.uid() = renter_id);

-- Storage bucket for vehicle images
insert into storage.buckets (id, name, public)
values ('vehicle-images', 'vehicle-images', true)
on conflict do nothing;

create policy "Anyone can view vehicle images"
  on storage.objects for select
  using (bucket_id = 'vehicle-images');

create policy "Authenticated users can upload vehicle images"
  on storage.objects for insert
  with check (bucket_id = 'vehicle-images' and auth.role() = 'authenticated');

create policy "Users can delete their own vehicle images"
  on storage.objects for delete
  using (bucket_id = 'vehicle-images' and auth.uid()::text = (storage.foldername(name))[1]);

-- Function to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'User'),
    new.email,
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'renter')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger: create profile after auth signup
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
