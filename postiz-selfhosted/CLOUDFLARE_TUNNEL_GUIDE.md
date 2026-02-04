# Cloudflare Tunnel을 이용한 도메인 연결 가이드 (Mac 기준)

이 가이드는 로컬 서버에서 실행 중인 **Postiz(포트 4200)**를 외부 도메인(예: `social.yourdomain.com`)과 HTTPS로 안전하게 연결하여 소셜 연동(OAuth) 환경을 구축하는 방법을 설명합니다.

---

## 1. cloudflared 설치

터미널에서 Homebrew를 사용하여 Cloudflare Tunnel 클라이언트를 설치합니다.

```bash
brew install cloudflared
```

---

## 2. Cloudflare 계정 인증

Cloudflare 계정에 터널링 권한을 부여합니다.

```bash
cloudflared tunnel login
```

1. 위 명령어를 실행하면 브라우저 창이 열립니다.
2. Cloudflare 계정에 로그인합니다.
3. 사용할 **도메인**을 선택하고 **Authorize** 버튼을 클릭합니다.
4. 완료되면 터미널에 `Success` 메시지가 뜹니다.

---

## 3. 터널 생성 및 설정

### 3-1. 터널 생성
로컬 서버와 외부를 이어줄 통로(터널)를 생성합니다. (이름은 `d-blog-tunnel`로 가정)

```bash
cloudflared tunnel create d-blog-tunnel
```
* 명령어를 실행하면 `Credentials file` 경로와 함께 **Tunnel ID**가 생성됩니다. 이 ID를 복사해두세요.

### 3-2. DNS 레코드 등록 (도메인 연결)
사용하실 서브도메인을 방금 만든 터널에 연결합니다.

```bash
# 형식: cloudflared tunnel route dns [터널이름] [사용할서브도메인]
cloudflared tunnel route dns d-blog-tunnel social.yourdomain.com
```
* 이제 `social.yourdomain.com`으로 접속하면 이 터널을 타게 됩니다.

---

## 4. 터널 설정 파일 작성 (선택 사항이나 권장)

매번 명령어를 길게 입력하지 않기 위해 설정 파일을 만듭니다. `~/.cloudflared/config.yml` 파일을 생성하거나 프로젝트 폴더에 만들어도 됩니다.

```yaml
tunnel: <복사한-터널-ID>
credentials-file: /Users/<유저명>/.cloudflared/<터널-ID>.json

ingress:
  - hostname: social.yourdomain.com
    service: http://localhost:4200
  - service: http_status:404
```

---

## 5. 터널 실행

설정 파일 없이 바로 실행하려면 다음 명령어를 사용합니다:

```bash
cloudflared tunnel run --url http://localhost:4200 d-blog-tunnel
```

설정 파일(`config.yml`)을 만들었다면 다음 명령어로 간편하게 실행합니다:

```bash
cloudflared tunnel run d-blog-tunnel
```

이제 **`https://social.yourdomain.com`**으로 접속하면 로컬에서 돌아가는 Postiz 대시보드가 열립니다!

---

## 6. Postiz 환경변수 업데이트 (필수)

도메인이 연결되었다면, `postiz-selfhosted/docker-compose.yml` 또는 `.env` 파일을 열어 다음 주소들을 수정하고 재시작해야 합니다.

```yaml
# docker-compose.yml 예시
MAIN_URL: https://social.yourdomain.com
FRONTEND_URL: https://social.yourdomain.com
NEXT_PUBLIC_BACKEND_URL: https://social.yourdomain.com/api
```

재시작 명령어:
```bash
docker-compose up -d
```

---

## 7. 프론트엔드 연동 (D-Blog Frontend)

제작 중인 Next.js 프로젝트의 `.env.local` 파일도 업데이트해 줍니다.

```env
# d-blog-frontend/.env.local
NEXT_PUBLIC_POSTIZ_API_URL=https://social.yourdomain.com/api/v1
```

이제 모든 소셜 연동(OAuth) 시 리다이렉트가 이 도메인을 통해 로컬 서버로 정확히 전달됩니다.
