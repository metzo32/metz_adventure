# Metz Adventure

여행 계획 및 기록 서비스.  
**Frontend** (Next.js) + **Backend** (Express.js + PostgreSQL) 구조로 이루어져 있습니다.

---

## 프로젝트 구조

```
metz_adventure/
├── frontend/   # Next.js 앱 (포트 3000)
└── backend/    # Express.js API 서버 (포트 4000)
```

---

## 시작하기

### 1. Backend

```bash
cd backend
npm install
```

`.env` 파일을 생성하고 아래 환경변수를 설정합니다.

```env
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<dbname>
```

서버 실행:

```bash
npm run dev
```

> `http://localhost:4000` 에서 실행됩니다.

---

### 2. Frontend

```bash
cd frontend
npm install
```

`.env.local` 파일을 생성하고 아래 환경변수를 설정합니다.

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXTAUTH_SECRET=<임의의 랜덤 문자열>
NEXTAUTH_URL=http://localhost:3000
```

개발 서버 실행:

```bash
npm run dev
```

> `http://localhost:3000` 에서 실행됩니다.

---

## API 헬스 체크

백엔드 정상 동작 여부는 아래 엔드포인트로 확인할 수 있습니다.

```
GET http://localhost:4000/api/health
```
