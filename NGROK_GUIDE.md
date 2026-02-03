# 🌐 ngrok을 활용한 로컬 외부 노출 및 SNS 연동 가이드

이 가이드는 로컬 환경(내 컴퓨터)에서 실행 중인 Mixpost를 외부로 노출하여, 페이스북, X(Twitter) 등의 SNS API 연동을 테스트하는 방법을 다룹니다.

---

## 1. ngrok 이란?
ngrok은 방화벽 뒤에 있는 로컬 서버를 안전한 터널을 통해 외부 인터넷에 공개해주는 도구입니다. 특히 **HTTPS** 주소를 제공하므로 SNS API의 리디렉션(Callback) 테스트에 필수적입니다.

## 2. ngrok 설치 및 실행

### 2.1 설치 (Mac 기준)
터미널에서 Homebrew를 사용하여 설치합니다.
```bash
brew install ngrok
```

### 2.2 인증 (최초 1회)
[ngrok 홈페이지](https://dashboard.ngrok.com/get-started/your-authtoken)에 로그인하여 본인의 Authtoken을 등록합니다.
```bash
ngrok config add-authtoken <YOUR_AUTH_TOKEN>
```

### 2.3 실행
Mixpost가 실행 중인 80번 포트를 외부로 노출합니다.
```bash
ngrok http 80
```
실행 후 터미널에 나타나는 **Forwarding** 주소(예: `https://abcd-123.ngrok-free.app`)를 복사하세요.

---

## 3. Mixpost 설정 업데이트

ngrok 주소가 생성될 때마다 Mixpost 대시보드 및 SNS API가 이 주소를 인식하도록 설정해야 합니다.

### 3.1 docker-compose.yml 수정
`mixpost/docker-compose.yml` 파일을 열어 `APP_URL`을 수정합니다.
```yaml
environment:
  APP_URL: "https://abcd-123.ngrok-free.app" # 👈 복사한 ngrok 주소 입력
```

### 3.2 컨테이너 재시작
수정된 환경 변수를 적용합니다.
```bash
cd mixpost
docker compose up -d
```

---

## 4. SNS 개발자 센터 설정 (예시: Facebook)

이제 생성된 HTTPS 주소를 각 SNS 플랫폼의 앱 설정에 등록합니다.

- **App Domains:** `abcd-123.ngrok-free.app`
- **Valid OAuth Redirect URIs:** `https://abcd-123.ngrok-free.app/mixpost/callback/facebook`
- **Privacy Policy URL:** `https://abcd-123.ngrok-free.app/privacy` (테스트용으로 임의 설정 가능)

---

## ⚠️ 주의사항

1. **URL 변경:** ngrok 무료 버전은 터미널을 껐다 켜면 주소가 바뀝니다. 주소가 바뀌면 위 **3단계와 4단계**를 다시 수행해야 합니다.
2. **보안:** 외부에서 내 컴퓨터로 접속이 가능한 상태이므로, 테스트가 끝나면 ngrok 터미널을 종료하는 것을 권장합니다.
3. **타임아웃:** ngrok 터널링은 때때로 연결이 불안정할 수 있습니다. 운영 환경에서는 반드시 실제 서버와 도메인 사용을 권장합니다.
