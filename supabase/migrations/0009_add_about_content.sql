create table if not exists public.about_content (
  id serial primary key,
  heading text not null,
  body_mdx text not null,
  updated_at timestamptz not null default now()
);

insert into public.about_content (heading, body_mdx)
  values ('About NoStress AI default', '# About NoStress AI\n\nCurate your story here.');
