# Postiz AWS 배포 가이드 (Namecheap DNS 유지)

이 문서는 **Namecheap DNS를 유지**하면서 **AWS EC2**에 Postiz를 배포하고, **서브도메인 + HTTPS**로 운영하는 방법을 정리합니다.

---

## 0) 준비물

- AWS 계정
- Namecheap 도메인 (예: `example.com`)
- 사용할 서브도메인 (예: `postiz.example.com`)

---

## 1) AWS EC2 생성

1. **EC2 인스턴스 생성**
   - OS: **Ubuntu 22.04 LTS** 권장
   - 타입: t3.small 이상 권장 (최소 t3.micro도 가능하지만 여유가 적음)

2. **보안 그룹 열기 (Security Group)**
   - 인바운드 규칙
     - `22` (SSH)
     - `80` (HTTP)
     - `443` (HTTPS)
     - `4200` (테스트용, 선택)

3. **퍼블릭 IP 확인**
   - EC2의 퍼블릭 IPv4 주소를 기록해둡니다.

---

## 2) Namecheap DNS 설정

Namecheap DNS에서 **A 레코드 추가**:

- 호스트: `postiz`
- 타입: `A`
- 값: **EC2 퍼블릭 IP**
- TTL: 기본값

설정 후 전파까지 **수 분~수십 분** 걸릴 수 있습니다.

---

## 3) EC2에서 Docker 설치

SSH 접속:

```bash
ssh -i /path/to/key.pem ubuntu@EC2_PUBLIC_IP
```

Docker 설치:

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo $VERSION_CODENAME) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Docker 권한 설정 (선택):

```bash
sudo usermod -aG docker $USER
newgrp docker
```

---

## 4) Postiz 배포 폴더 준비

EC2에서 폴더 생성:

```bash
mkdir -p ~/postiz
cd ~/postiz
```

`docker-compose.yml` 준비 (예시):

```yaml
version: '3.9'

services:
  postiz:
    image: ghcr.io/gitroomhq/postiz-app:latest
    container_name: postiz-app
    restart: always
    ports:
      - "4200:5000"
    environment:
      - MAIN_URL=https://postiz.example.com
      - FRONTEND_URL=https://postiz.example.com
      - NEXT_PUBLIC_BACKEND_URL=https://postiz.example.com/api
      - JWT_SECRET=CHANGE_ME_RANDOM
      - DATABASE_URL=postgresql://postiz_user:postiz_password@postiz-postgres:5432/postiz_db
      - REDIS_URL=redis://postiz-redis:6379
      - TEMPORAL_ADDRESS=temporal:7233
      - IS_GENERAL=true
      - DISABLE_REGISTRATION=false
      - STORAGE_PROVIDER=local
      - BACKEND_INTERNAL_URL=http://127.0.0.1:3000
    depends_on:
      - postiz-postgres
      - postiz-redis
      - temporal
    networks:
      - postiz-network

  postiz-postgres:
    image: postgres:15-alpine
    container_name: postiz-postgres
    restart: always
    environment:
      - POSTGRES_USER=postiz_user
      - POSTGRES_PASSWORD=postiz_password
      - POSTGRES_DB=postiz_db
    healthcheck:
      test: [ "CMD-SHELL", "pg_isready -U postiz_user -d postiz_db" ]
      interval: 5s
      timeout: 5s
      retries: 5
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - postiz-network

  postiz-redis:
    image: redis:7-alpine
    container_name: postiz-redis
    restart: always
    healthcheck:
      test: [ "CMD", "redis-cli", "ping" ]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - postiz-network

  temporal-elasticsearch:
    container_name: temporal-elasticsearch
    image: elasticsearch:7.17.27
    environment:
      - cluster.routing.allocation.disk.threshold_enabled=true
      - cluster.routing.allocation.disk.watermark.low=512mb
      - cluster.routing.allocation.disk.watermark.high=256mb
      - cluster.routing.allocation.disk.watermark.flood_stage=128mb
      - discovery.type=single-node
      - ES_JAVA_OPTS=-Xms256m -Xmx256m
      - xpack.security.enabled=false
    networks:
      - postiz-network

  temporal:
    container_name: temporal
    image: temporalio/auto-setup:1.24
    depends_on:
      - postiz-postgres
      - temporal-elasticsearch
    environment:
      - DB=postgres12
      - DB_PORT=5432
      - POSTGRES_USER=postiz_user
      - POSTGRES_PWD=postiz_password
      - POSTGRES_SEEDS=postiz-postgres
      - ENABLE_ES=true
      - ES_SEEDS=temporal-elasticsearch
      - ES_VERSION=v7
    networks:
      - postiz-network

volumes:
  postgres_data:

networks:
  postiz-network:
    name: postiz-network
    driver: bridge
```

---

## 5) 도커 실행

```bash
docker compose up -d
```

정상 확인:

```bash
docker compose ps
```

브라우저에서 테스트 (HTTP):

```
http://EC2_PUBLIC_IP:4200
```

---

## 6) HTTPS 설정 (Caddy 추천)

Caddy는 자동으로 SSL을 발급합니다.

### 6-1) Caddy 설치

```bash
sudo apt install -y caddy
```

### 6-2) Caddy 설정

`/etc/caddy/Caddyfile` 수정:

```
postiz.example.com {
    reverse_proxy 127.0.0.1:4200
}
```

적용:

```bash
sudo systemctl reload caddy
```

---

## 7) 최종 확인

브라우저에서:

```
https://postiz.example.com
```

로그인 테스트 후 정상 유지되면 완료입니다.

---

## 참고

- 로그인 반복 문제는 `trycloudflare.com` 도메인에서 쿠키가 차단되기 때문에 발생합니다.
- **고정 도메인 + HTTPS** 환경에서는 정상 동작합니다.

---

## 다음 단계 (선택)

- DB/Redis 볼륨 백업
- CloudWatch 모니터링
- 장애 대비 스냅샷/AMI
