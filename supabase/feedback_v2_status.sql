-- 피드백 상태를 반영여부(불리언)에서 접수/진행/완료 3단계로 변경
alter table feedback add column status text not null default 'open';
update feedback set status = 'done' where implemented = true;
alter table feedback drop column implemented;
