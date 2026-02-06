# 클라우드 옵션

## 옵션 A: Cloudflare 중심
- Workers/Pages
- D1 (SQLite 기반)
- R2 (미디어 저장)
- Queues

### 장점
- 전 세계 엣지 배포
- 간단한 운영
- 저비용 시작

### 단점
- 장기적으로 복잡한 백엔드/데이터 처리 시 제약
- 일부 라이브러리 호환성

## 옵션 B: AWS 중심
- ECS/Fargate 또는 Lambda
- RDS(Postgres)
- S3 (미디어)
- SQS/CloudWatch

### 장점
- 성숙한 생태계
- 확장성/운영 옵션 풍부

### 단점
- 초기 설정/운영 복잡
- 비용 구조 복잡

## 추천 (MVP)
- 빠른 출시와 단순 운영이 목표면 Cloudflare
- 복잡한 워커/데이터 처리 확장이 예상되면 AWS
