# Postiz (Open Source) 셀프 호스팅 완벽 가이드

이 문서는 Postiz 오픈소스 버전을 Docker로 직접 구축하여 무제한 채널을 무료로 사용하고, API를 통해 D-PLOG와 같은 자체 서비스에 SNS 자동화 기능을 연동하는 방법을 다룹니다.

## 1. 사전 준비 사항 (Prerequisites)

설치 전에 서버(또는 로컬 PC)에 다음 환경이 구성되어야 합니다.

- **OS:** Linux (Ubuntu 권장), macOS, 또는 Windows (WSL2)
- **Docker:** 컨테이너 실행 환경
- **Docker Compose:** 멀티 컨테이너 관리 도구

**설치 확인:**
```bash
docker -v
docker-compose -v
```

---

## 2. 설치 방법 (Docker Compose)

Postiz 구동에 필요한 앱, DB(PostgreSQL), 캐시(Redis)를 한 번에 설치합니다.

### 2-1. 프로젝트 폴더 생성
```bash
mkdir postiz-selfhosted
cd postiz-selfhosted
```

### 2-2. docker-compose.yml 파일 생성
아래 내용을 복사하여 `docker-compose.yml` 파일로 저장하세요.

```yaml
version: '3.9'

services:
  # 1. Postiz 애플리케이션
  postiz:
    image: ghcr.io/gitroomhq/postiz-app:latest
    container_name: postiz-app
    restart: always
    ports:
      - "4200:4200" # 호스트 포트 4200으로 웹 접속
    environment:
      # --- [필수] 기본 설정 ---
      - DATABASE_URL=postgresql://postiz_user:postiz_password@postgres:5432/postiz_db
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=random_secret_string_please_change_this # 보안을 위해 반드시 변경!
      - MAIN_URL=http://localhost:4200 # 실제 도메인 사용 시 변경 (예: https://social.d-plog.com)
      - FRONTEND_URL=http://localhost:4200
      - NEXT_PUBLIC_BACKEND_URL=http://localhost:4200/api
      
      # --- [선택] SNS 연결 설정 (Self-Hosted 필수) ---
      # 각 SNS 개발자 센터에서 발급받은 키를 입력해야 연동이 가능합니다.
      # (사용하지 않는 채널은 주석 처리해도 무방합니다)
      
      # X (Twitter)
      # - TWITTER_CLIENT_ID=...
      # - TWITTER_CLIENT_SECRET=...
      
      # Facebook / Instagram
      # - FACEBOOK_APP_ID=...
      # - FACEBOOK_APP_SECRET=...
      
      # LinkedIn
      # - LINKEDIN_CLIENT_ID=...
      # - LINKEDIN_CLIENT_SECRET=...
      
    depends_on:
      - postgres
      - redis
    networks:
      - postiz-network

  # 2. 데이터베이스 (PostgreSQL)
  postgres:
    image: postgres:15-alpine
    container_name: postiz-postgres
    restart: always
    environment:
      - POSTGRES_USER=postiz_user
      - POSTGRES_PASSWORD=postiz_password
      - POSTGRES_DB=postiz_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - postiz-network

  # 3. 캐시 서버 (Redis)
  redis:
    image: redis:7-alpine
    container_name: postiz-redis
    restart: always
    volumes:
      - redis_data:/data
    networks:
      - postiz-network

volumes:
  postgres_data:
  redis_data:

networks:
  postiz-network:
    driver: bridge
```

### 2-3. 서비스 실행
```bash
docker-compose up -d
```
최초 실행 시 이미지를 다운로드하느라 수 분이 소요될 수 있습니다.

---

## 3. 초기 설정 및 SNS 채널 연결

### 3-1. 관리자 대시보드 접속
- 브라우저 주소창에 `http://localhost:4200` (또는 `http://서버IP:4200`) 입력.
- **회원가입:** 관리자 이메일과 비밀번호를 설정하여 첫 계정을 생성합니다.
- **로그인:** Postiz가 제공하는 완성된 관리자 UI에 접속됩니다. (별도 개발 불필요)

### 3-2. SNS 채널 연결 (Connect Channels)
- **메뉴 이동:** 좌측 사이드바의 "Integrations" (또는 Connect Channels) 클릭.
- **플랫폼 선택:** 연결할 SNS(Instagram, Facebook, X 등) 아이콘 클릭.
- **키 설정 확인:**
  - **중요:** 버튼 클릭 시 반응이 없거나 에러가 난다면, `docker-compose.yml`의 environment에 해당 SNS의 Client ID/Secret이 올바르게 입력되었는지 확인하세요.
  - 입력 후에는 반드시 `docker-compose up -d`로 재시작해야 반영됩니다.
- **권한 허용:** 팝업창에서 Postiz 앱의 접근 권한을 허용하면 "Connected" 상태로 변경됩니다.

---

## 4. D-PLOG 서비스 연동 (API 사용법)

개발하신 D-PLOG 서비스에서 글 작성을 자동화하기 위한 API 가이드입니다.

### 4-1. API Key 발급
1. Postiz 대시보드 > 좌측 하단 **Settings** 클릭.
2. **API Keys** 탭 선택 > **Create New API Key** 클릭.
3. 생성된 키 복사 (이 키는 API 요청 헤더 `Authorization: Bearer <KEY>` 또는 `X-Api-Key`로 사용됩니다).

### 4-2. 포스팅 생성 예제 (cURL)
D-PLOG 서버에서 "발행" 버튼을 눌렀을 때 실행될 로직 예시입니다.

```bash
curl -X POST http://localhost:4200/api/v1/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_API_KEY>" \
  -d '{
    "content": "오늘의 D-PLOG 추천 메뉴입니다! 🍝 #맛집 #점심추천",
    "providers": ["twitter", "linkedin"], 
    "media": ["https://d-plog.com/images/menu_today.jpg"],
    "scheduleAt": "2024-05-20T11:30:00.000Z"
  }'
```
- `providers`: 전송할 SNS 플랫폼 식별자 (연결된 채널 ID 등을 확인 필요)
- `scheduleAt`: 예약 발송 시간 (ISO 8601 형식). 생략 시 즉시 발행됩니다.

---

## 5. 운영 및 문제 해결 (Troubleshooting)

### 운영 팁
- **데이터 백업:** `postgres_data` 볼륨에는 모든 계정 정보와 예약 글 데이터가 저장됩니다. 주기적으로 백업하세요.
- **HTTPS 적용:** 실제 서비스 시 Nginx 등을 앞단에 두고 SSL 인증서를 적용하는 것을 강력히 권장합니다.

### 자주 묻는 질문
**Q: 포트 4200이 이미 사용 중입니다.**
A: `docker-compose.yml`에서 "4200:4200"을 "5000:4200" 등으로 변경하여 호스트 포트를 바꾸세요.

**Q: 권한(Permission) 에러가 발생합니다.**
A: 리눅스 환경인 경우 볼륨 폴더에 쓰기 권한이 있는지 확인하세요. (`chmod` 또는 `sudo` 실행)
