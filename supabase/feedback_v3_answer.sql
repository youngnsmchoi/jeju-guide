-- 피드백에 운영자 답변 컬럼 추가 (완료 처리 시 이용자에게 보여줄 답변)
alter table feedback add column answer text;
