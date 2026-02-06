# 백엔드 아키텍처

## 역할
- 인증/권한
- Buffer OAuth 토큰 관리
- 게시물 생성/예약/발행 상태 관리
- 실패 재시도 및 알림

## 추천 스택 (제안)
- Node.js + NestJS 또는 Fastify
- DB: Postgres
- Cache/Queue: Redis
- 스토리지: S3 호환(이미지)

## 서비스 구성
- API 서버
- 워커(예약 발행, 재시도)
- 웹훅 수신기

## 외부 연동
- Buffer API (OAuth, 게시물 예약/발행)
