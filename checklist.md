# 레시피 공유 기능 체크리스트

## 1. DB
- [x] `recipes` 테이블 생성 SQL 작성
- [x] Supabase에 적용

## 2. 타입
- [x] `Recipe` 타입 `src/lib/types.ts`에 추가

## 3. API
- [x] `POST /api/recipes` — 레시피 제출
- [x] `GET /api/recipes` — 목록 조회 (hidden=false, 좋아요 순)
- [x] `POST /api/recipes/[id]/like` — 좋아요 +1

## 4. 이용자 페이지
- [x] `/recipes` 목록 페이지 + RecipesView
- [x] `/recipes/new` 제출 폼 페이지 + RecipeNewView

## 5. Admin
- [x] AdminView에 'recipes' 탭 추가
- [x] RecipeAdmin — 목록 + 숨김/공개 토글
- [x] `PATCH /api/admin/recipes` — hidden 토글 API

## 6. NavBar
- [x] NavBar에 레시피 탭 추가 (4개 언어)
