# API 스펙 (초안)

## 인증
- POST /auth/signup
- POST /auth/login
- POST /auth/logout

## 계정/채널
- GET /accounts
- POST /accounts/link
- DELETE /accounts/:id

## 게시물
- POST /posts
- GET /posts
- GET /posts/:id
- PATCH /posts/:id
- DELETE /posts/:id

## 업로드
- POST /uploads

## 통계
- GET /analytics/summary
- GET /stats/summary

## 결제
- GET /billing/plan
- POST /billing/checkout
