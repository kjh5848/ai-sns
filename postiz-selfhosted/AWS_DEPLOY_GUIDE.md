# Postiz AWS 배포 가이드 (Namecheap DNS 유지)

이 문서는 **Namecheap DNS를 유지**하면서 **AWS EC2**에 Postiz를 배포하고, **서브도메인 + HTTPS**로 운영하는 방법을 정리합니다.

---

## 0) 준비물

- AWS 계정
- Namecheap 도메인 (예: `example.com`)
- 사용할 서브도메인 (예: `postiz.example.com`)

---

## 0-1) IAM 생성 가이드 (권장)

AWS 루트 계정 대신 **IAM 사용자**로 작업하는 것을 권장합니다.

### A. IAM 사용자 생성 (콘솔 권장)

1. AWS 콘솔 → IAM → **Users** → **Create user**
2. 사용자 이름 예시: `postiz-admin`
3. 액세스 유형:
   - 콘솔 로그인 필요하면 **Console access** 체크
   - CLI 사용할 계획이면 **Access key**도 생성
4. **MFA 설정**: 필수 권장

### B. 사용자 권한 (가장 간단한 구성)

빠르게 진행하려면 아래 **AWS 관리형 정책**을 붙입니다.

- `AdministratorAccess`  
  - 가장 빠르고 간단하지만 권한이 큽니다.

### C. 최소 권한 구성 (권장 대체안)

EC2와 보안 그룹 생성/관리만 필요하다면 아래 조합으로 충분합니다.

- `AmazonEC2FullAccess`
- `IAMReadOnlyAccess`

필요 시 추가:
- `CloudWatchReadOnlyAccess` (로그 조회)

---

## 0-2) EC2 인스턴스 역할(IAM Role) 생성 (선택)

운영 편의성을 위해 EC2에 IAM Role을 붙일 수 있습니다.

### 역할 이름 예시
- `postiz-ec2-role`

### 신뢰 정책
- **EC2** 신뢰(기본 선택값)

### 부여 권한 (필요한 경우만)
- `AmazonSSMManagedInstanceCore`  
  - SSH 없이 **SSM(Session Manager)** 로 접속하고 싶을 때 사용합니다.
  - 효과:
    - EC2에 **SSM Agent**가 설치되어 있고 네트워크가 정상이라면,
      인바운드 22번 포트를 열지 않아도 원격 접속이 가능합니다.
    - 콘솔/CLI에서 **세션 시작, 파일 전송, 명령 실행**이 가능합니다.
  - 전제 조건:
    - EC2가 **아웃바운드 인터넷** 또는 **VPC 엔드포인트(SSM, EC2Messages, SSMMessages)**에 접근 가능해야 합니다.
    - Ubuntu 22.04는 기본적으로 SSM Agent가 설치되어 있습니다.
  - 참고:
    - 보안 강화를 위해 SSH(22)를 닫고 SSM만 사용하는 구성이 가능합니다.

- `CloudWatchAgentServerPolicy`  
  - **CloudWatch Logs/메트릭 전송**이 필요할 때 사용합니다.
  - 효과:
    - `/var/log/*`, 도커 로그, 애플리케이션 로그 등을 **CloudWatch Logs**로 수집 가능
    - CPU/메모리/디스크 같은 **OS 레벨 메트릭** 전송 가능
  - 전제 조건:
    - EC2에 **CloudWatch Agent** 설치 및 설정이 필요합니다.
    - 로그 그룹/스트림이 자동 생성되도록 IAM 권한이 있어야 합니다.
  - 참고:
    - 운영 환경에서는 문제 추적과 장애 대응에 매우 유용합니다.

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

## 1-1) EC2를 AWS CLI로 생성 (명령어 가이드)

빠르게 진행하려면 `aws.env`를 활용한 스크립트를 사용하세요.

### A. aws.env 확인

`postiz-selfhosted/aws.env`에 기본값이 있습니다.

추가로 SSH 접속용 CIDR을 지정해야 합니다:

```bash
export SSH_CIDR=YOUR_PUBLIC_IP/32
```

퍼블릭 IP 확인 예시:

```bash
curl -s https://checkip.amazonaws.com
```

### B. 스크립트 실행

```bash
cd postiz-selfhosted
export SSH_CIDR=YOUR_PUBLIC_IP/32
./aws-create-ec2.sh
```

출력된 `PUBLIC_IP`로 다음 단계 SSH 접속을 진행하면 됩니다.

아래는 **AWS CLI로 EC2를 생성하는 최소 명령어**입니다.  
사전에 `aws configure`로 자격 증명이 설정되어 있어야 합니다.

### A. 기본 변수 설정

```bash
export AWS_REGION=ap-northeast-2
export AMI_ID=$(aws ec2 describe-images \
  --region $AWS_REGION \
  --owners 099720109477 \
  --filters "Name=name,Values=ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*" \
           "Name=state,Values=available" \
  --query "Images | sort_by(@, &CreationDate) | [-1].ImageId" \
  --output text)

export KEY_NAME=postiz-key
export INSTANCE_TYPE=t3.small
export SG_NAME=postiz-sg
export TAG_NAME=postiz-ec2
```

### B. 키페어 생성

```bash
aws ec2 create-key-pair \
  --region $AWS_REGION \
  --key-name $KEY_NAME \
  --query "KeyMaterial" \
  --output text > ${KEY_NAME}.pem

chmod 400 ${KEY_NAME}.pem
```

### C. 보안 그룹 생성 및 포트 오픈

```bash
export VPC_ID=$(aws ec2 describe-vpcs --region $AWS_REGION --query "Vpcs[0].VpcId" --output text)

export SG_ID=$(aws ec2 create-security-group \
  --region $AWS_REGION \
  --group-name $SG_NAME \
  --description "Postiz security group" \
  --vpc-id $VPC_ID \
  --query "GroupId" \
  --output text)

aws ec2 authorize-security-group-ingress --region $AWS_REGION --group-id $SG_ID --protocol tcp --port 22 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --region $AWS_REGION --group-id $SG_ID --protocol tcp --port 80 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --region $AWS_REGION --group-id $SG_ID --protocol tcp --port 443 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --region $AWS_REGION --group-id $SG_ID --protocol tcp --port 4200 --cidr 0.0.0.0/0
```

### D. EC2 인스턴스 생성

```bash
export INSTANCE_ID=$(aws ec2 run-instances \
  --region $AWS_REGION \
  --image-id $AMI_ID \
  --instance-type $INSTANCE_TYPE \
  --key-name $KEY_NAME \
  --security-group-ids $SG_ID \
  --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=$TAG_NAME}]" \
  --query "Instances[0].InstanceId" \
  --output text)

aws ec2 wait instance-running --region $AWS_REGION --instance-ids $INSTANCE_ID
```

### E. 퍼블릭 IP 확인

```bash
export PUBLIC_IP=$(aws ec2 describe-instances \
  --region $AWS_REGION \
  --instance-ids $INSTANCE_ID \
  --query "Reservations[0].Instances[0].PublicIpAddress" \
  --output text)

echo $PUBLIC_IP
```

이제 다음 단계에서 `ssh -i ${KEY_NAME}.pem ubuntu@$PUBLIC_IP`로 접속해 설치를 진행하면 됩니다.

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

## 3-1) CLI로 Postiz 올리기 (명령어 가이드)

아래는 **EC2에서 CLI로 Postiz를 올리는 최소 명령어**입니다.

1. SSH 접속:

```bash
ssh -i /path/to/key.pem ubuntu@EC2_PUBLIC_IP
```

2. 배포 폴더 생성:

```bash
mkdir -p ~/postiz
cd ~/postiz
```

3. `docker-compose.yml` 작성:

```bash
cat <<'EOF' > docker-compose.yml
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
EOF
```

4. 실행:

```bash
docker compose up -d
```

5. 상태 확인:

```bash
docker compose ps
```

6. 로그 확인:

```bash
docker compose logs -f postiz
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
