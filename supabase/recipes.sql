-- 이용자 레시피 공유 테이블
create table if not exists recipes (
  id bigint generated always as identity primary key,
  ramen_id bigint references ramen_items(id) on delete set null,
  ingredients text not null,
  description text not null,
  nickname text,
  country text,
  gender text,
  age_group text,
  likes integer not null default 0,
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);

-- 좋아요 순 조회 최적화
create index if not exists recipes_likes_idx on recipes (likes desc);
create index if not exists recipes_hidden_idx on recipes (hidden);
