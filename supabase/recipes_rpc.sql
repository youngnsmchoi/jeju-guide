-- 레시피 좋아요 카운터 원자적 증가 함수
create or replace function increment_recipe_likes(recipe_id bigint)
returns void
language sql
as $$
  update recipes set likes = likes + 1 where id = recipe_id;
$$;
