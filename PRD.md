# PRD: 여행 플래너 앱

## 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 프로젝트명 | 떠나세연 |
| 목적 | 여행 계획·실행·기록 통합 플랫폼 |
| 대상 사용자 | 개인 여행자 - 본인 및 초대코드를 공유받은 참여자 |
| 여행 기간 | 2026년 5월 |
| 패키지 매니저 | yarn |

---

## 기술 스택

### Frontend

| 항목 | 기술 |
|------|------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS + MUI (Material UI) |
| UI 컴포넌트 | MUI (버튼, 인풋, 테이블, 탭, 모달 등) |
| 그래프 | Recharts |
| 인증 | NextAuth.js v5 (이메일 + Google OAuth) |
| 폼 검증 | React Hook Form + Zod |
| 상태관리 | React Context |

> **TailwindCSS + MUI 혼용 전략**
> - MUI: 폼, 테이블, 탭, 다이얼로그 등 복잡한 인터랙션 컴포넌트
> - Tailwind: 레이아웃, 여백, 색상 커스터마이징
> - Recharts: 걸음 수 및 지출 데이터 시각화

### Backend (입문 서버)

| 항목 | 기술 | 목적 |
|------|------|------|
| Runtime | Node.js | 서버 실행 환경 |
| Framework | Express.js | API 라우터 |
| DB | SQLite (better-sqlite3) | 파일 기반 DB, 별도 서버 불필요 |
| 파일 업로드 | multer | 이미지 업로드 미들웨어 |

> **왜 이 구조인가?**
> - **SQLite**: 별도 DB 서버 없이 `.db` 파일 하나로 동작. 로컬 입문에 완벽
> - **Express**: 코드 몇 줄로 API 서버 실행 가능, 개념 이해에 최적
> - **multer**: 파일 업로드 실무 패턴 입문 학습

### 프로젝트 폴더 구조

```
metz_chiangmai/
├── frontend/               ← Next.js 앱
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── wishlist/
│   │   ├── todo/
│   │   ├── diary/
│   │   │   ├── new/
│   │   │   └── [id]/
│   │   ├── places/
│   │   │   ├── new/
│   │   │   └── [id]/
│   │   ├── budget/
│   │   ├── mypage/
│   │   ├── layout.tsx
│   │   └── page.tsx        ← 랜딩
│   ├── components/
│   │   ├── layout/
│   │   │   └── Header.tsx
│   │   ├── widgets/
│   │   │   ├── TimeWidget.tsx
│   │   │   ├── WeatherWidget.tsx
│   │   │   └── ExchangeWidget.tsx
│   │   └── ui/
│   │       ├── StarRating.tsx
│   │       ├── Modal.tsx
│   │       └── EmptyState.tsx
│   └── package.json
│
└── backend/                ← Express 서버
    ├── routes/
    │   ├── wishlist.js
    │   ├── todos.js
    │   ├── diary.js
    │   ├── places.js
    │   ├── budget.js
    │   └── mypage.js
    ├── db/
    │   ├── init.js         ← 테이블 생성 스크립트
    │   └── travel.db       ← SQLite 파일 (자동 생성)
    ├── uploads/            ← multer 업로드 폴더
    ├── server.js           ← 진입점
    └── package.json
```

---

## 헤더 글로벌 위젯 (공통)

모든 페이지 상단에 항상 표시.

| 위젯 | 내용 | API |
|------|------|-----|
| 한국 시간 | KST (UTC+9) 실시간 | 클라이언트 JS |
| 해당 지역 시간 | ICT (UTC+7) 실시간 | 클라이언트 JS |
| 해당 지역 날씨 | 기온 + 날씨 아이콘 | OpenWeatherMap |
| 바트 환율 | 1 THB = ₩XXX | ExchangeRate-API |

> 날씨·환율은 1시간 캐싱 (Next.js Route Handler `revalidate: 3600`)

---

## 인증

- 이메일/패스워드 로그인 및 회원가입
- Google OAuth 소셜 로그인
- 미로그인 시 랜딩 페이지만 접근 가능
- 세션 기반 (NextAuth.js)

---

## 페이지 상세 명세

### 1. 랜딩 페이지 `/`

**목적**: 앱 소개 + 로그인 유도 + 여행 카운트다운

| 섹션 | 내용 |
|------|------|
| 히어로 | 감성 배경 이미지 + 앱 타이틀 카피 |
| 기능 소개 | 카드 형태로 6개 페이지 기능 요약 |
| D-Day 카운터 | 여행까지 남은 날짜 실시간 표시 |
| CTA | 로그인 / 회원가입 버튼 |

---

### 2. 위시리스트 페이지 `/wishlist`

**목적**: 가고 싶은 곳, 먹고 싶은 것, 하고 싶은 것 사전 정리

**UI**:
- 카테고리 탭: 장소 / 음식 / 액티비티 / 쇼핑 / 기타 (MUI Tabs)
- 아이템 카드: 이름, 참고 링크, 우선순위(★1~3), 완료 토글
- **메모 인풋**: 각 아이템 카드 하단에 메모 입력란 표시 (MUI TextField, 인라인 편집)
- 추가 모달: 이름, 카테고리, 메모, 링크, 우선순위 (MUI Dialog)
- 완료 항목 취소선 + 필터 (전체 / 미완료 / 완료)

**Express API**:
```
GET    /api/wishlist        목록 조회
POST   /api/wishlist        항목 추가
PATCH  /api/wishlist/:id    수정 (완료 토글 포함)
DELETE /api/wishlist/:id    삭제
```

**SQLite 테이블**:
```sql
CREATE TABLE wishlist (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  title      TEXT    NOT NULL,
  category   TEXT,
  memo       TEXT,
  link       TEXT,
  priority   INTEGER DEFAULT 1,
  is_done    INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

### 3. 투두 리스트 페이지 `/todo`

**목적**: 출발 전 준비 체크리스트 + 여행 중 할 일

**UI**:
- 카테고리 탭: 출발 준비 / 현지 할 일 / 귀국 준비 (MUI Tabs)
- 진행률 프로그레스 바 (MUI LinearProgress)
- 빠른 추가 인풋 (Enter로 즉시 추가, MUI TextField)
- **메모 인풋**: 각 투두 아이템에 메모 입력란 표시 (MUI TextField, 인라인 편집)
- 마감일 선택 (MUI DatePicker)

**Express API**:
```
GET    /api/todos
POST   /api/todos
PATCH  /api/todos/:id
DELETE /api/todos/:id
```

**SQLite 테이블**:
```sql
CREATE TABLE todos (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  title        TEXT    NOT NULL,
  category     TEXT,
  due_date     TEXT,
  memo         TEXT,
  is_completed INTEGER DEFAULT 0,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

### 4. 일기 페이지 `/diary`

**목적**: 여행 중 매일의 경험과 감정 기록

**UI**:
- 목록: 날짜별 카드 (날짜, 제목, 기분 이모지, 내용 미리보기)
- 작성/편집: 날짜, 제목, 기분(5단계 이모지), 본문, 태그
- 상세 페이지: 전체 내용 표시

> 이미지 업로드는 Phase 3에서 multer 연동 예정

**Express API**:
```
GET    /api/diary
POST   /api/diary
PUT    /api/diary/:id
DELETE /api/diary/:id
```

**SQLite 테이블**:
```sql
CREATE TABLE diary (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  date       TEXT    NOT NULL,
  title      TEXT,
  content    TEXT,
  mood       INTEGER,           -- 1~5
  tags       TEXT,              -- JSON 배열 문자열
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**기분 이모지 기준**:
| 값 | 이모지 | 의미 |
|----|--------|------|
| 1 | 😢 | 힘들었다 |
| 2 | 😕 | 그저 그랬다 |
| 3 | 😊 | 괜찮았다 |
| 4 | 😄 | 좋았다 |
| 5 | 🤩 | 최고였다 |

---

### 5. 방문 장소 페이지 `/places`

**목적**: 실제 방문한 장소 등록 + 별점 + 리뷰

**UI**:
- 지도 뷰: 방문 장소 핀 마커 표시 (Google Maps Embed 또는 Kakao Map)
- 리스트 뷰 전환 버튼
- 장소 카드: 이름, 카테고리 아이콘, 별점(★ 0.5단위), 방문일, 리뷰 미리보기
- 등록 폼: 장소명, 카테고리, 별점, 리뷰 텍스트, 방문일, 주소, 위·경도

**카테고리**: 맛집 / 카페 / 관광지 / 숙소 / 마사지 / 쇼핑 / 기타

**Express API**:
```
GET    /api/places
POST   /api/places
PUT    /api/places/:id
DELETE /api/places/:id
```

**SQLite 테이블**:
```sql
CREATE TABLE places (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT    NOT NULL,
  category   TEXT,
  rating     REAL,              -- 0.5 ~ 5.0
  review     TEXT,
  visited_at TEXT,
  address    TEXT,
  lat        REAL,
  lng        REAL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

### 6. 마이 페이지 `/mypage`

**목적**: 여행 중 건강(걸음 수) + 일별 지출 데이터를 시각화하여 한눈에 파악

**UI — 걸음 수 섹션**:
- 날짜별 걸음 수 입력 폼 (MUI TextField + DatePicker)
- **Recharts BarChart**: X축 날짜, Y축 걸음 수, 바 색상으로 활동량 시각화
- 일별 걸음 수 기록 리스트 (MUI Table)
- 총 누적 걸음 수 + 일평균 걸음 수 요약 카드

**UI — 일별 지출 섹션**:
- 날짜별 지출 합계 자동 집계 (예산 페이지 `expenses` 테이블 기반)
- **Recharts LineChart**: X축 날짜, Y축 지출 금액(바트), 일별 지출 추이
- 예산 한도선 표시 (ReferenceLine으로 1일 평균 예산 기준선)
- 지출 과다 날짜 강조 표시

**Recharts 컴포넌트 사용**:
| 차트 | 종류 | 용도 |
|------|------|------|
| `<BarChart>` | 막대 그래프 | 걸음 수 |
| `<LineChart>` | 꺾은선 그래프 | 일별 지출 추이 |
| `<Tooltip>` | 툴팁 | 날짜별 상세값 |
| `<Legend>` | 범례 | 그래프 설명 |
| `<ReferenceLine>` | 기준선 | 일 평균 예산 한도 |

**Express API**:
```
GET    /api/mypage/steps         걸음 수 목록 조회
POST   /api/mypage/steps         걸음 수 등록
PUT    /api/mypage/steps/:id     걸음 수 수정
DELETE /api/mypage/steps/:id     삭제
GET    /api/mypage/daily-expenses  날짜별 지출 집계 (expenses 테이블 집계)
```

**SQLite 테이블**:
```sql
CREATE TABLE steps (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  date       TEXT    NOT NULL UNIQUE,  -- YYYY-MM-DD
  count      INTEGER NOT NULL,         -- 걸음 수
  memo       TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

> 일별 지출은 별도 테이블 없이 기존 `expenses` 테이블을 날짜별로 `GROUP BY` 집계하여 사용

---

### 7. 예산 페이지 `/budget`

**목적**: 여행 예산 설정 + 지출 기록 + 실시간 환율 계산기

**UI**:
- **환율 계산기**: 원화 ↔ 바트 실시간 변환 인풋 (양방향)
- **예산 개요**: 총 예산 vs 지출 합계, 잔여 예산 프로그레스 바
- **카테고리별 예산 설정**: 항공 / 숙소 / 식비 / 교통 / 액티비티 / 쇼핑 / 기타
- **지출 내역 테이블**: 날짜, 카테고리, 금액(바트), 원화 환산, 메모
- **카테고리별 합계 요약**

**Express API**:
```
GET    /api/budget/config        예산 설정 조회
POST   /api/budget/config        예산 설정 저장/업데이트
GET    /api/budget/expenses      지출 내역 조회
POST   /api/budget/expenses      지출 추가
PUT    /api/budget/expenses/:id  지출 수정
DELETE /api/budget/expenses/:id  지출 삭제
```

**SQLite 테이블**:
```sql
CREATE TABLE budget_config (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT    NOT NULL,
  amount   INTEGER DEFAULT 0,
  currency TEXT    DEFAULT 'KRW'
);

CREATE TABLE expenses (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  date       TEXT,
  category   TEXT,
  amount_thb REAL,              -- 바트 금액
  memo       TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 라우팅 구조

```
/                     랜딩 (공개)
/auth/login           로그인
/auth/register        회원가입
/wishlist             위시리스트            (인증 필요)
/todo                 투두 리스트           (인증 필요)
/diary                일기 목록             (인증 필요)
/diary/new            일기 작성             (인증 필요)
/diary/[id]           일기 상세             (인증 필요)
/places               방문 장소 (지도)      (인증 필요)
/places/new           장소 등록             (인증 필요)
/places/[id]          장소 상세             (인증 필요)
/budget               예산 & 환율 계산기    (인증 필요)
/mypage               마이 페이지           (인증 필요)
```

---

## 외부 API

| API | 용도 | 키 발급 |
|-----|------|---------|
| OpenWeatherMap | 해당 지역 날씨 (lat:18.79, lon:98.98) | openweathermap.org 무료 플랜 |
| ExchangeRate-API | KRW/THB 실시간 환율 | exchangerate-api.com 무료 플랜 |
| Google OAuth | 소셜 로그인 | Google Cloud Console |
| Google Maps Embed | 방문 장소 지도 핀 | Google Cloud Console (선택) |

---

## 공통 컴포넌트

| 컴포넌트 | 역할 |
|---------|------|
| `<Header>` | 네비게이션 + 시간×2 + 날씨 + 환율 위젯 |
| `<TimeWidget>` | KST/{해당 지역} 실시간 시계 (1초 interval) |
| `<WeatherWidget>` | 해당 지역 기온 + 날씨 아이콘 |
| `<ExchangeWidget>` | 1 THB = ₩XXX 미리보기 |
| `<StarRating>` | 0.5점 단위 별점 입력 및 표시 |
| `<EmptyState>` | 데이터 없을 때 빈 상태 UI |
| `<StepsChart>` | Recharts BarChart — 걸음 수 시각화 |
| `<ExpensesChart>` | Recharts LineChart — 일별 지출 추이 |

> MUI 기본 컴포넌트(Button, TextField, Dialog, Tabs, Table, LinearProgress, DatePicker 등)는 직접 import하여 사용

---

## 디자인 가이드

| 항목 | 내용 |
|------|------|
| 컬러 | 골든 옐로우, 웜 오렌지, 딥 그린 |
| 폰트 | Pretendard (한국어) + Inter (영문) |
| 무드 | 여행 일지 + 모던 미니멀 |
| 반응형 | 모바일 우선 (여행 중 스마트폰 사용 고려) |
| UI 라이브러리 | MUI v5  |
| 그래프 라이브러리 | Recharts — 걸음 수(BarChart), 지출 추이(LineChart) |

---

## 개발 단계 (Phase)

### Phase 1 — 기반 + 핵심 기능
- [ ] `yarn create next-app frontend` + TailwindCSS + MUI 세팅
- [ ] `backend/` Express 서버 초기화 + SQLite 연결 + 테이블 생성
- [ ] 인증: 이메일 + Google OAuth (NextAuth.js)
- [ ] 랜딩 페이지 + 헤더 위젯 (시간, 날씨, 환율)
- [ ] 투두 리스트 CRUD (메모 인풋 포함)
- [ ] 위시리스트 CRUD (메모 인풋 포함)

### Phase 2 — 기록 기능
- [ ] 예산 페이지 + 환율 계산기
- [ ] 일기 CRUD
- [ ] 마이 페이지 (걸음 수 + 지출 그래프, Recharts)

### Phase 3 — 고도화
- [ ] 방문 장소 + 지도 핀
- [ ] multer 이미지 업로드 (일기, 장소)
- [ ] 디자인 폴리싱

---

## 실행 방법

```bash
# 프론트엔드
cd frontend
yarn dev          # http://localhost:3000

# 백엔드
cd backend
node server.js    # http://localhost:4000
```

## 검증 체크리스트

- [ ] `yarn dev` + `node server.js` 동시 실행 확인
- [ ] Express API 각 엔드포인트 응답 확인 (Thunder Client 또는 Postman)
- [ ] `travel.db` 파일 자동 생성 및 CRUD 확인
- [ ] Google 로그인 플로우 E2E 확인
- [ ] 날씨 API: 해당 국가 및 도시 기온 응답 확인
- [ ] 환율 API: KRW/THB 응답 확인
- [ ] 시간 위젯: KST/ICT 2시간 차이 확인
- [ ] 모바일 뷰포트 반응형 확인
