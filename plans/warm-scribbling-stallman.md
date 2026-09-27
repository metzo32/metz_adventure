# FeatureGrid 제거 & 모든 뷰에서 Sidebar 노출

## Context
현재 랜딩 페이지(`/`)는 `AppShell`의 `EXCLUDED_PATHS`에 포함되어 있어 Sidebar가 숨겨진다. `FeatureGrid`는 랜딩 페이지에서만 사용되며, 이를 제거하고 모든 일반 뷰에서 Sidebar가 보이도록 변경한다.

## 변경 파일

### 1. `app/_components/Layouts/AppShell.tsx`
`EXCLUDED_PATHS`에서 `"/"` 제거. auth 경로는 로그인 전 상태이므로 Sidebar가 의미 없어 유지.

```ts
// Before
const EXCLUDED_PATHS = ["/", "/auth/login", "/auth/register"];

// After
const EXCLUDED_PATHS = ["/auth/login", "/auth/register"];
```

### 2. `app/page.tsx`
FeatureGrid import 및 컴포넌트 사용 제거.

```tsx
// Before
import FeatureGrid from "./_components/Components/FeatureGrid";
// ...
<FeatureGrid />

// After: FeatureGrid import 및 <FeatureGrid /> 제거
```

### 3. `app/_components/Components/FeatureGrid.tsx`
파일 삭제.

## 검증
- `localhost:3000/` 접속 시 Sidebar가 보임
- 로그인/회원가입 페이지(`/auth/login`, `/auth/register`)에서는 Sidebar 미노출 유지
- FeatureGrid 관련 import 오류 없음
