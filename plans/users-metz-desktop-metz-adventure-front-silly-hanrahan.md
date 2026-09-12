# HeroSection 타이머 컴포넌트 분리

## Context

`HeroSection`에서 `useTripTimer`가 매초 `setTimer`를 호출해 컴포넌트 전체를 리렌더시킨다.  
같은 컴포넌트에 있는 `useSession`, 여행 데이터 파생 계산 등이 불필요하게 매초 재실행된다.  
타이머 표시 부분만 별도 컴포넌트로 분리해 리렌더 범위를 최소화한다.

## 접근 방식

### 새 파일: `app/_components/Components/TripTimerCard.tsx`

타이머와 관련된 모든 로직을 이 컴포넌트로 이동한다.

**이 컴포넌트가 props로 받는 것:**
```ts
type Props = {
  currentTrip: Trip | null;      // useTrip()에서 옴
  destShortLabel: string;        // "방콕, TH" 또는 "온세상"
  timeDiffLabel: string;         // "+1시간" 또는 "시차 없음"
};
```

**이 컴포넌트가 내부에서 처리하는 것:**
- `useTripTimer(startDate, endDate)` → 매초 리렌더는 여기서만 발생
- `startDate`, `endDate` (useMemo)
- `timer`, `timerLabel`, `badgeText`, `footerLabel`, `timerValues` 파생 계산
- 타이머 카드 + 출발지/시차 카드 JSX (현재 HeroSection 우측 컬럼 전체)

### 변경 파일: `app/_components/Components/HeroSection.tsx`

**남기는 것:**
- `useSession()` → `isLoggedIn`, `tripTitle`
- `useTrip()` → `currentTrip`
- `countryInfo`, `destTimezone`, `timeDiff`, `destShortLabel`, `timeDiffLabel` 계산
- 좌측 컬럼(제목, 설명, CTA) JSX
- 미사용 변수 `userId` 제거

**제거하는 것:**
- `useTripTimer`, `startDate`, `endDate`, `timer`, `timerLabel`, `badgeText`, `footerLabel`, `timerValues`
- 우측 컬럼 JSX → `<TripTimerCard>` 단일 태그로 교체

## 파일 구조 (변경 후)

```
app/_components/Components/
  HeroSection.tsx       ← useSession, useTrip (데이터 변경 시만 리렌더)
  TripTimerCard.tsx     ← useTripTimer (매초 리렌더, 격리됨)
```

## 검증 방법

1. 브라우저에서 메인 페이지 접속 후 타이머가 정상적으로 카운트되는지 확인
2. React DevTools Profiler로 리렌더 범위 확인 — HeroSection은 정지, TripTimerCard만 매초 렌더
3. 로그인/비로그인 전환 시 tripTitle이 올바르게 변경되는지 확인
