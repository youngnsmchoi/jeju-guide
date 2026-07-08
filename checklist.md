# 레시피 공유 기능 체크리스트

## 1. DB
- [ ] `recipes` 테이블 생성 SQL 작성
- [ ] Supabase에 적용

## 2. 타입
- [ ] `Recipe` 타입 `src/lib/types.ts`에 추가

## 3. API
- [ ] `POST /api/recipes` — 레시피 제출
- [ ] `GET /api/recipes` — 목록 조회 (hidden=false, 좋아요 순)
- [ ] `POST /api/recipes/[id]/like` — 좋아요 +1

## 4. 이용자 페이지
- [ ] `/recipes` 목록 페이지 + RecipesView
- [ ] `/recipes/new` 제출 폼 페이지 + RecipeNewView

## 5. Admin
- [ ] AdminView에 'recipes' 탭 추가
- [ ] RecipeAdminView — 목록 + 숨김/공개 토글
- [ ] `PATCH /api/admin/recipes/[id]` — hidden 토글 API

## 6. NavBar
- [ ] NavBar에 레시피 탭 추가 (4개 언어)
