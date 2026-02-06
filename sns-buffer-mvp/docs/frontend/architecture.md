# 프론트엔드 아키텍처

## 추천 스택 (제안)
- Next.js + TypeScript
- 상태관리: React Query + Zustand
- 스타일: Tailwind
- 폼: React Hook Form

## 라우팅
- 퍼블릭: `/`, `/login`, `/signup`
- 앱: `/app/*`

## 데이터 흐름
- API 호출은 서버 API 경유
- 토큰은 HttpOnly 쿠키 저장

## 폴더 구조 예시
- `src/app` 라우트
- `src/components` 공용 컴포넌트
- `src/features` 도메인별
- `src/lib/api` API 클라이언트
