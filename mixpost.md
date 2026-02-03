# 🚀 Mixpost 셀프 호스팅 가이드

Mixpost는 가장 강력한 오픈소스 소셜 미디어 관리 툴입니다. 이 가이드는 Docker를 사용하여 Mixpost를 개인 서버에 설치하고, 실제 SNS 계정(Facebook, X, LinkedIn 등)을 연동하는 전체 과정을 다룹니다.

## 📋 1. 사전 준비사항 (Prerequisites)

설치를 시작하기 전에 다음 항목들이 준비되어 있어야 합니다.

- **리눅스 서버 (VPS):** Ubuntu 22.04 LTS 추천 (최소 사양: 2GB RAM, 1 vCPU 이상)
- **도메인 (Domain):** SSL 인증서 발급과 SNS API 콜백을 위해 필수입니다. (예: `social.mydomain.com`)
- **Docker & Docker Compose:** 서버에 설치되어 있어야 합니다.
- **SMTP 정보:** 이메일 인증 및 비밀번호 찾기용 (Gmail SMTP, AWS SES 등)

---

## 🛠 2. Mixpost 설치 (Docker Compose)

### 2.1 프로젝트 폴더 생성
```bash
mkdir mixpost
cd mixpost
```

### 2.2 docker-compose.yml 작성
`docker-compose.yml` 파일을 생성하고 아래 내용을 입력하세요.

```yaml
version: '3.8'

services:
  mixpost:
    image: inovector/mixpost:latest
    container_name: mixpost_app
    restart: unless-stopped
    ports:
      - "80:80"
    environment:
      APP_URL: "https://social.mydomain.com" # 👈 본인의 도메인으로 변경
      APP_KEY: "base64:..." # 👈 2.3단계에서 생성 후 입력
      DB_HOST: db
      DB_PORT: 3306
      DB_DATABASE: mixpost
      DB_USERNAME: mixpost
      DB_PASSWORD: secure_password # 👈 변경 권장
      REDIS_HOST: redis
      APP_TIMEZONE: "Asia/Seoul"
      # SMTP 설정
      MAIL_MAILER: smtp
      MAIL_HOST: smtp.gmail.com
      MAIL_PORT: 587
      MAIL_USERNAME: your_email@gmail.com
      MAIL_PASSWORD: your_app_password
      MAIL_ENCRYPTION: tls
      MAIL_FROM_ADDRESS: no-reply@mydomain.com
    depends_on:
      - db
      - redis
    volumes:
      - ./storage:/var/www/html/storage

  db:
    image: mysql:8.0
    container_name: mixpost_db
    restart: unless-stopped
    environment:
      MYSQL_DATABASE: mixpost
      MYSQL_USER: mixpost
      MYSQL_PASSWORD: secure_password # 👈 위와 동일하게 변경
      MYSQL_ROOT_PASSWORD: root_secure_password
    volumes:
      - db_data:/var/lib/mysql

  redis:
    image: redis:alpine
    container_name: mixpost_redis
    restart: unless-stopped
    volumes:
      - redis_data:/data

volumes:
  db_data:
  redis_data:
```

### 2.3 App Key 생성
Laravel 기반이므로 암호화 키가 필요합니다. 터미널에서 아래 명령어를 실행하여 키를 생성합니다.
```bash
docker run --rm inovector/mixpost:latest php artisan key:generate --show
```
출력된 `base64:xxxx...` 문자열을 복사하여 `docker-compose.yml`의 `APP_KEY` 부분에 넣습니다.

### 2.4 컨테이너 실행
```bash
docker compose up -d
```

---

## 👤 3. 관리자 계정 생성

컨테이너 실행 후, 아래 명령어를 입력하여 첫 번째 관리자 계정을 생성합니다.
```bash
docker exec -it mixpost_app php artisan mixpost:create-user
```
- **Name:** 관리자 이름
- **Email:** 관리자 이메일
- **Password:** 비밀번호
- **Is Admin?:** yes

---

## 🔗 4. SNS 서비스 연동

Mixpost 설정 화면의 **Services** 메뉴에서 각 플랫폼의 Client ID와 Secret Key를 입력해야 합니다.

### 공통 필수 설정: Redirect URI (Callback URL)
형식: `https://YOUR_DOMAIN/mixpost/callback/{provider}`
예시: `https://social.mydomain.com/mixpost/callback/twitter`

### 🔹 Twitter (X)
1. [X Developer Portal](https://developer.twitter.com/) 접속
2. 앱 생성 및 `User authentication settings` 설정
3. **App permissions:** Read and Write
4. **Type of App:** Web App, Automated App or Bot
5. **Callback URI:** `https://YOUR_DOMAIN/mixpost/callback/twitter`

### 🔹 Facebook / Instagram
1. [Meta for Developers](https://developers.facebook.com/) 접속
2. '비즈니스' 유형으로 앱 생성
3. **Facebook Login for Business** 추가
4. **Valid OAuth Redirect URIs:** `https://YOUR_DOMAIN/mixpost/callback/facebook`
5. Instagram 게시를 위해 'Instagram Graph API' 권한 추가 필요

### 🔹 LinkedIn
1. [LinkedIn Developers](https://www.linkedin.com/developers/) 접속
2. 앱 생성 후 Products 탭에서 'Share on LinkedIn', 'Sign In with LinkedIn' 추가
3. **Redirect URLs:** `https://YOUR_DOMAIN/mixpost/callback/linkedin`

---

## 💡 5. 사용 팁 및 문제 해결

- **게시물 실패:** API 설정 오류, 권한 부족, 또는 API 호출 한도 초과 확인.
- **미디어 업로드 문제:** storage 폴더 권한 문제일 수 있습니다.
  ```bash
  docker exec -it mixpost_app chmod -R 775 storage
  ```
- **SSL(HTTPS) 필수:** SNS API는 보안상 HTTPS 콜백만 허용하는 경우가 많습니다. Nginx Proxy Manager 등을 사용하여 HTTPS를 반드시 적용하세요.

---

🎉 **축하합니다!** 이제 자신만의 소셜 미디어 관리 시스템이 준비되었습니다.
