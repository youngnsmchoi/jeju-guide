-- best5_picks에 ramen_id 추가 — ramen_items의 상세 정보(제조사 링크)와 연결
-- Supabase SQL Editor에서 직접 실행

alter table best5_picks add column ramen_id bigint references ramen_items(id);

update best5_picks set ramen_id = 15 where rank_num = 1; -- 신라면
update best5_picks set ramen_id = 25 where rank_num = 2; -- 불닭볶음면
update best5_picks set ramen_id = 23 where rank_num = 3; -- 참깨라면
update best5_picks set ramen_id = 16 where rank_num = 4; -- 짜파게티 → 올리브짜파게티
update best5_picks set ramen_id = 3  where rank_num = 5; -- 너구리큰사발면
