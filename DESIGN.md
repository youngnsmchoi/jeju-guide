# DESIGN.md

jeju-guide(Korea Convenience Store Guide)의 디자인 시스템 기준 문서입니다. 새 페이지·컴포넌트를 만들 때 이 문서의 규칙을 따릅니다. 실제 코드에서 이미 쓰이고 있는 패턴을 정리한 것이라, 지금 화면에서 보이는 것과 이 문서는 일치합니다.

## 디자인 아이덴티티

한국을 찾는 외국인 여행자를 위한 모바일 퍼스트 실용 편의점 가이드 앱입니다. "준비 없이 왔다가 편의점에서 막히는 순간, 그 자리에서 바로 찾아보는" 실전 매뉴얼을 지향합니다(제주 한정이 아닌 한국 전역 대상). 흰 카드와 옅은 회색 배경 위에 에메랄드 그린 하나를 브랜드·CTA·활성 상태·긍정 신호 색으로 일관되게 사용하는 절제되고 신뢰감 있는 톤입니다. 화려함보다 "언어 장벽 없이 빠르게 읽히는 실용성"을 최우선 가치로 둡니다.

## 색상

### 브랜드 / CTA
- `emerald-600` — 기본 CTA 버튼 배경, 강조 텍스트
- `emerald-700` — hover, 진한 강조
- `emerald-50` — CTA 배경의 옅은 버전(hover 배경, 성공/팁 박스)

### 배경 계층
| 계층 | 클래스 | 용도 |
|---|---|---|
| 페이지 최상위 | `bg-gray-50` | `<body>`, 전체 배경 |
| 카드 / 시트 / 헤더 | `bg-white` | 카드, NavBar, BottomNav |
| 비활성 요소 | `bg-gray-100` | 비활성 버튼, 뱃지, 원형 아이콘 배경 |

### 상태색
| 상태 | 배경 | 테두리 | 텍스트/아이콘 |
|---|---|---|---|
| 경고/에러 | `bg-red-50` | `border-red-200` | `text-red-700` / `text-red-500` |
| 주의(tip warning) | `bg-amber-50` | `border-amber-300` | ⚠️ |
| 정보(tip info) | `bg-blue-50` | `border-blue-300` | ℹ️ |
| 성공/팁(tip) | `bg-emerald-50` | `border-emerald-200` | 💡 |

### 텍스트 명도 (5단계)
| 역할 | 클래스 |
|---|---|
| 제목 | `text-gray-900` |
| 본문 | `text-gray-700` |
| 부연 설명 | `text-gray-600` |
| 보조 캡션 | `text-gray-500` |
| 최하위 캡션 / 빈 상태 | `text-gray-400` |

### 예외 허용
서드파티 서비스 링크(카카오맵=노랑, 네이버맵=초록, 구글맵=파랑 등)는 각 서비스의 고유 브랜드색을 그대로 사용합니다. emerald 규칙의 예외로 취급하지 않습니다.

## 타이포그래피

| 크기 | 용도 |
|---|---|
| `text-xl` | 페이지/섹션 제목 |
| `text-2xl` | 강조 숫자(가격, 환산값 등) |
| `text-sm` | 본문 (가장 많이 쓰임) |
| `text-xs` | 캡션, 라벨, 보조 텍스트 (가장 많이 쓰임) |

폰트 굵기 규칙.
- 제목: `font-bold`
- 버튼: `font-semibold`
- 라벨 / 뱃지 / 토글: `font-medium`

## 레이아웃

- 컨테이너 폭: `max-w-lg mx-auto` (사용자 페이지 전역 표준). admin 페이지만 예외로 `max-w-4xl` 사용.
- 카드 표준: `bg-white rounded-2xl border border-gray-100 (또는 border-gray-200) shadow-sm p-4`
  - 강조가 필요한 카드만 `border-2` 사용 (예: 결제 팝업 옵션 카드)
  - `shadow-sm`이 기본. `shadow-md` 이상은 쓰지 않음.
- 간격: 페이지 레벨은 `space-y-4`~`space-y-6`, 카드 내부는 `space-y-2`~`space-y-3` — 바깥 여백이 안쪽보다 넓게.

## 컴포넌트 패턴

### 버튼
- 풀폭 CTA: `bg-emerald-600 text-white py-3 rounded-2xl font-semibold hover:bg-emerald-700 transition-colors`
- 보조 버튼: `text-sm px-4 py-2 rounded-xl`
- 비활성 버튼(항상 회색): `bg-gray-100 text-gray-600 hover:bg-gray-200`
- 제출/CTA 버튼의 `disabled` 상태: `disabled:opacity-40 disabled:cursor-not-allowed` (사용자 페이지 기준. admin 페이지는 `disabled:opacity-50`로 별도 컨벤션)

### 팝업 / 모달
하단 시트형이 표준입니다.
```
fixed inset-0 z-50 bg-black/40 flex items-end justify-center
  └─ bg-white rounded-t-3xl w-full max-w-lg px-6 pt-6 pb-10 max-h-[90vh] overflow-y-auto
```
닫기 버튼은 CTA 색(`bg-emerald-600`)으로 명확히 눈에 띄게 — 배경과 명도 차이가 없는 회색 버튼은 지양.

### 카드형 리스트 아이템
`bg-white rounded-2xl border shadow-sm p-4` 안에 `flex items-center justify-between` (좌측 뱃지+제목 / 우측 점수 or 값) 구조.

### 탭 버튼 (페이지 내 섹션 전환)
`NavBar` 바로 아래, 페이지 상단에서 콘텐츠를 전환하는 탭입니다 (예: cooking의 컵라면/봉지라면/비벼먹기, ramen-log의 기록하기/발자취).
```
bg-white border-b border-gray-100 px-4 py-2
  └─ max-w-lg mx-auto flex gap-2
       └─ 각 버튼: flex-1 py-1.5 rounded-xl text-sm font-medium transition-colors
            선택됨: bg-emerald-600 text-white
            미선택: bg-gray-100 text-gray-500 hover:bg-gray-200
```
언어 전환 버튼(텍스트 색으로 구분)과 달리, 탭 버튼은 배경색 채움으로 선택 상태를 표시합니다.

### 즐겨찾기 별 아이콘 (콘텐츠 On/Off)
홈 화면 메뉴 카드처럼 이용자가 특정 항목을 골라서 모아보게 할 때 씁니다. 채워진 별(⭐)/빈 별(☆)로 On/Off를 표시하고, 클릭 시 localStorage에 저장해 재방문 시에도 유지합니다.
```
카드 우상단에 절대 위치: absolute top-2 right-2 text-sm
On: ⭐   Off: ☆
```
카드 전체가 클릭 영역(페이지 이동)이므로, 별 버튼은 `onClick`에서 `e.stopPropagation()`으로 카드 클릭과 분리합니다. 아무것도 선택하지 않은 첫 방문 상태에서는 운영자가 정한 기본값을 보여주고, 한 번이라도 조작하면 그 순간부터 이용자의 선택이 저장됩니다. 즐겨찾기로 켠 항목은 원래 있던 그룹 그리드에서는 사라지고 즐겨찾기 섹션에만 나타납니다 — 같은 카드가 화면에 두 번 보이지 않게 하기 위함입니다.

**즐겨찾기 모음 섹션은 일반 목록과 형태·색을 모두 다르게 해서 한눈에 구분되게 합니다** (텍스트 라벨만으로는 스크롤 중 구분이 잘 안 됨).
```
바깥 컨테이너: bg-emerald-50 border border-emerald-200 (일반 그룹은 bg-white border-gray-100)
내부 레이아웃: flex flex-col gap-2 — 1열 리스트 (일반 그룹은 grid grid-cols-2 — 2열 그리드)
카드 자체: bg-white border-emerald-200 hover:bg-emerald-50 (일반 카드는 bg-gray-50 border-gray-100)
```
1열 리스트에서는 제목과 설명을 `제목 · 설명` 한 줄로 압축(`truncate`)하고, 별 버튼은 `text-gray-300`으로 옅게 낮춰 카드를 짧고 조용하게 유지합니다. 이미 즐겨찾기된 항목만 모아둔 구역이라 별 색을 강조할 필요가 없기 때문입니다.

별 버튼의 클릭 가능 영역은 카드 높이 전체(`self-stretch`)와 좌우 여백(`px-3`)까지 넉넉히 잡습니다. 별 아이콘 자체가 작아도(`text-xs`) 클릭 영역만 크면 오클릭이 나지 않습니다.

### 상단 네비게이션
- `NavBar`: `bg-white border-b border-gray-200 sticky top-0 z-20`, 내부 컨텐츠는 `max-w-lg mx-auto`로 감싸 데스크톱 넓은 화면에서도 모바일과 동일한 폭 유지 (없으면 언어 버튼이 화면 오른쪽 끝까지 밀려나 보임)
- 홈 이동은 텍스트 로고("Korea Convenience Store Guide", 브랜드명이라 4개 언어 공통)를 클릭하는 방식. "홈"/"Home" 같은 텍스트 라벨이나 화살표 단독 버튼은 쓰지 않음. 로고 텍스트가 길어서 `truncate` + `text-xs`로 좁은 화면에서도 잘리거나 언어 버튼과 겹치지 않게 함.
- 하단 고정 탭바(`BottomNav`)는 즐겨찾기 기능 도입 이후 제거됨. 다른 카테고리로 이동은 로고 클릭 → 홈 → 즐겨찾기/그룹 목록을 통해서만 함.

### 언어 전환 버튼 (`LangSelector`)
`KO / EN / ZH / JA` 형태 — 약어 텍스트 + 얇은 회색 슬래시(`/`) 구분자. 배경색 대신 텍스트 색으로 선택 상태를 표시합니다.
```
선택됨: text-emerald-700 font-bold
미선택: text-gray-400 hover:text-gray-600
구분자: text-xs text-gray-300 (버튼 사이, 클릭 불가)
```
전 페이지에서 `NavBar` 또는 `LangSelector` 컴포넌트를 통해서만 렌더링하고, 별도로 새로 구현하지 않습니다.

## 아이콘

이모지를 1급 아이콘 시스템으로 사용합니다 (🛒, 💵, 🍜 등). `lucide-react`는 설치되어 있지만 `RamenList.tsx`의 `Clock` 아이콘 한 곳만 예외적으로 사용— 새 아이콘이 필요하면 먼저 어울리는 이모지를 검토하고, 이모지로 표현하기 어려운 경우에만 lucide-react를 씁니다.

## 다국어 (ko / en / zh / ja)

모든 View 컴포넌트는 다음 패턴을 따릅니다.
```ts
const LABEL: Record<Lang, { ... }> = {
  ko: { ... },
  en: { ... },
  zh: { ... },
  ja: { ... },
}
const L = LABEL[lang]
```
언어 전환 UI는 위 "언어 전환 버튼" 절의 `LangSelector` 컴포넌트를 재사용합니다.

## 알려진 예외 / 참고 사항

- admin 페이지는 관리자 전용 도구 화면이라 사용자 페이지와 다른 컨테이너 폭(`max-w-4xl`)과 리스트 행 스타일(`rounded-xl`)을 씁니다. 이는 의도된 별도 컨벤션입니다.
- `PaymentView.tsx`와 `CvsTipsView.tsx`에 있는 "문구를 화면 가득 확대해서 보여주는" 화면(`fixed inset-0 bg-white flex items-center justify-center`)은 팝업/모달이 아니라 "점원에게 보여주는 문구 확대 표시" 기능입니다. 하단 시트형 팝업 규칙과는 별개입니다.
