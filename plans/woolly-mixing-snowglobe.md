# 배포 계획: metz_adventure (로컬 DB → AWS 전환)

## 현재 진행 상태
- [x] Step 1: AWS RDS 생성 완료
  - 엔드포인트: `metz-away.cxai4s8i6c57.ap-southeast-2.rds.amazonaws.com`
  - 리전: ap-southeast-2 (시드니)
  - 사용자: metz
- [x] `backend/server.js` 수정 완료 (PORT, CORS 환경변수화)
- [ ] Step 2: backend/.env → RDS 연결 정보로 업데이트
- [ ] Step 3: RDS에 DB 스키마 초기화
- [ ] Step 4: Railway 백엔드 배포
- [ ] Step 5: Vercel 프론트엔드 배포

---

## 다음 실행 단계

### Step 2: backend/.env 업데이트
```
DATABASE_URL=postgresql://metz:<PASSWORD>@metz-away.cxai4s8i6c57.ap-southeast-2.rds.amazonaws.com:5432/metz_adventure
CORS_ORIGIN=http://localhost:3000
PORT=4000
```
> 비밀번호는 RDS 생성 시 설정한 값 사용

### Step 3: RDS에 스키마 초기화
`backend/db/init.js`에 CREATE TABLE 코드가 이미 있으므로 아래 명령으로 실행:
```bash
cd backend && node db/init.js
```
단, init.js가 DATABASE_URL을 읽는 구조인지 확인 필요.

### Step 4: Railway 백엔드 배포
1. railway.app 접속 → GitHub 연결 → backend/ 루트 디렉토리 지정
2. 환경변수 설정:
   - `DATABASE_URL`: RDS 연결 문자열
   - `CORS_ORIGIN`: Vercel 배포 URL (나중에 업데이트)
3. 배포 후 Railway URL 확인 (예: `https://xxx.railway.app`)

### Step 5: Vercel 프론트엔드 배포
1. vercel.com → Import Git Repository → frontend/ 루트 지정
2. 환경변수 설정:
   - `NEXT_PUBLIC_API_URL`: Railway URL
   - `NEXTAUTH_URL`: Vercel 배포 URL
   - `NEXTAUTH_SECRET`: 강한 랜덤 문자열
3. 배포 완료 후 Railway의 `CORS_ORIGIN`을 Vercel URL로 업데이트

## 주의사항
- `.env` 파일은 절대 git에 커밋하지 않기 (.gitignore 확인 필요)
- RDS 보안 그룹에서 Railway 서버만 5432 허용 (현재 퍼블릭 액세스 허용 상태 → Railway 배포 후 제한 권장)
