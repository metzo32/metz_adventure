<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 파일 구조 컨벤션

- `page.tsx`에 작성되는 컴포넌트는 해당 page 단일 파일에만 작성한다.
- 추가 데이터(상수, mock 등)는 `page.tsx`의 형제 경로인 `data/` 폴더에 저장한다.
- TypeScript 타입은 `page.tsx`의 형제 경로인 `types/` 폴더에 저장한다.
- API CRUD 함수(fetch helper)는 `app/api/` 폴더에 도메인별로 분리하여 저장한다.
  - 예: `app/api/wishlist.ts`, `app/api/todo.ts`

# 임포트 순서 컨벤션

임포트문은 아래 순서로 작성한다.

1. `react` 관련 (`useState`, `useEffect` 등)
2. `react-hook-form` 관련
3. 그 외 라이브러리 훅 및 커스텀 훅
4. 큰 단위 컴포넌트 (페이지 구성 컴포넌트 등)
5. 디자인 프리셋 및 개별 디자인 관련 컴포넌트
6. `dayjs` 등 유틸 관련 함수
7. 타입 (`type`, `interface`)
8. 초기값 / 상수
9. 기타

# 데이터 페칭 컨벤션

- 서버 데이터 페칭에 `useEffect`를 절대 사용하지 않는다. 반드시 `react-query` (`useQuery`, `useMutation` 등)를 활용한다.

# 코드 작성 컨벤션

- 반복되는 내용(텍스트, 옵션, 탭 등) 및 반복 태그는 별도의 배열로 선언하고 `map`으로 렌더링한다.
- `onChange`, `onBlur`, `onClick` 등 이벤트 핸들러에 인라인 함수(`() => ...`)를 직접 작성하지 않는다. 반드시 별도의 named function으로 분리하여 작성한다.
- 모든 함수는 화살표 함수(`const fn = () => {}`)로 작성한다. `function` 키워드 선언 방식을 사용하지 않는다.
- SVG를 직접 인라인으로 작성하지 않는다. 모든 아이콘은 개발자가 직접 import하여 사용한다.
- 모든 색상은 `global.css`에 선언된 Tailwind 프리셋을 사용한다. Tailwind 클래스 작성 시 `[#...]` 표기법 대신 프리셋명을 사용한다 (예: `text-primary`, `bg-background`, `border-border`). `global.css`에 없는 색상만 개발자가 직접 제어한다.
- 모든 `<button>`은 `components/` 폴더 내 `Button` 프리셋 컴포넌트를 사용한다. 별도 지시가 없으면 스타일은 디폴트(`"full"`)로 적용한다.
- input 관련 필드의 label은 직접 `<label>` 태그로 작성하지 않는다. 반드시 `*Rhf` 컴포넌트의 `label` prop을 통해 전달한다.
- React Hook Form의 `Controller`를 컴포넌트 내부에 직접 작성하지 않는다. `components/RHF/` 폴더에 있는 `*Rhf` 프리셋 컴포넌트를 최우선으로 사용한다. 적합한 프리셋이 없는 경우, 임의로 Controller를 작성하지 말고 반드시 개발자에게 다시 질문하여 새 프리셋 생성 여부를 확인한다.
- `eslint-disable` 주석(`// eslint-disable`, `/* eslint-disable */` 등 모든 형태)을 절대 작성하지 않는다. ESLint 경고가 발생하면 주석으로 억제하지 말고 근본 원인을 해결한다.
- 인라인 `style` prop(`style={{ ... }}`)을 작성하지 않는다. 모든 스타일은 Tailwind 클래스로 표현한다. Tailwind로 표현이 불가능한 경우에만 개발자에게 확인 후 예외를 허용한다.
