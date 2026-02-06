import { NavLink, Route, Routes } from "react-router-dom";

const publicLinks = [
  { label: "Gmail", to: "/login" },
  { label: "이미지", to: "/signup" },
];

const appNavLinks = [
  { label: "대시보드", to: "/app" },
  { label: "게시물 작성", to: "/app/post" },
  { label: "예약 캘린더", to: "/app/schedule" },
  { label: "채널 연결", to: "/app/accounts" },
];

const sidebarLinks = [
  { label: "대시보드", to: "/app" },
  { label: "게시물 작성", to: "/app/post" },
  { label: "예약 캘린더", to: "/app/schedule" },
  { label: "채널 연결", to: "/app/accounts" },
  { label: "콘텐츠 라이브러리", to: "/app/library" },
  { label: "분석", to: "/app/analytics" },
  { label: "설정", to: "/app/settings" },
  { label: "결제/플랜", to: "/app/billing" },
];

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Zm0 11.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm6.8.3 3.2 3.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 4a2.5 2.5 0 0 1 2.5 2.5v5a2.5 2.5 0 0 1-5 0v-5A2.5 2.5 0 0 1 12 4Zm5 7a5 5 0 0 1-10 0M12 19v2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AppGridIcon() {
  return (
    <span className="app-grid" aria-hidden="true">
      {Array.from({ length: 9 }).map((_, index) => (
        <span key={index} />
      ))}
    </span>
  );
}

function Logo({ size = "lg" }: { size?: "sm" | "lg" }) {
  return (
    <div className={`logo logo--${size} gravity-item`} aria-label="SNS Buffer MVP">
      <span className="logo-letter blue">S</span>
      <span className="logo-letter red">N</span>
      <span className="logo-letter yellow">S</span>
      <span className="logo-letter green">B</span>
      <span className="logo-text">uffer</span>
    </div>
  );
}

function PublicHeader() {
  return (
    <header className="header header--public">
      <div className="header-left" />
      <nav className="nav nav--public">
        {publicLinks.map((item) => (
          <NavLink key={item.to} to={item.to} className="gravity-item">
            {item.label}
          </NavLink>
        ))}
        <button className="icon-button gravity-item" type="button" aria-label="앱 메뉴">
          <AppGridIcon />
        </button>
        <span className="profile-dot gravity-item" aria-hidden="true" />
      </nav>
    </header>
  );
}

function AppHeader({ cta }: { cta: { label: string; to: string } }) {
  return (
    <header className="header header--app">
      <NavLink to="/" className="brand">
        <Logo size="sm" />
      </NavLink>
      <nav className="nav nav--app">
        {appNavLinks.map((item) => (
          <NavLink key={item.to} to={item.to}>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <NavLink className="btn btn-primary" to={cta.to}>
        {cta.label}
      </NavLink>
    </header>
  );
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="page">
      <PublicHeader />
      <main className="main">{children}</main>
      <footer className="footer">
        <nav className="footer-links">
          <span>광고</span>
          <span>비즈니스</span>
          <span>Google 정보</span>
          <span>개인정보처리방침</span>
        </nav>
      </footer>
    </div>
  );
}

function AppLayout({ children, cta }: { children: React.ReactNode; cta: { label: string; to: string } }) {
  return (
    <div className="page">
      <AppHeader cta={cta} />
      <main className="main">
        <div className="sidebar-layout">
          <aside className="sidebar">
            {sidebarLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? "active" : undefined)}
                end={item.to === "/app"}
              >
                {item.label}
              </NavLink>
            ))}
          </aside>
          <section className="content">{children}</section>
        </div>
      </main>
    </div>
  );
}

function SearchBar({ placeholder }: { placeholder: string }) {
  return (
    <form
      className="search-shell gravity-item"
      action="https://www.google.com/search"
      method="GET"
      target="_blank"
    >
      <span className="icon icon-search" aria-hidden="true">
        <SearchIcon />
      </span>
      <input
        className="search-input"
        name="q"
        placeholder={placeholder}
        aria-label="검색"
      />
      <button className="icon-button" type="button" aria-label="음성 검색">
        <MicIcon />
      </button>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid">{children}</div>;
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card gravity-item">
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

function Kv({ items }: { items: [string, string][] }) {
  return (
    <div className="kv">
      {items.map(([key, value], index) => (
        <div key={`${key}-${index}`} style={{ display: "contents" }}>
          <div>{key}</div>
          <div>{value}</div>
        </div>
      ))}
    </div>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return <div className="notice">{children}</div>;
}

function Landing() {
  return (
    <PublicLayout>
      <section className="home">
        <Logo size="lg" />
        <SearchBar placeholder="채널, 예약, 게시물 검색" />
        <div className="button-row">
          <NavLink className="btn btn-secondary gravity-item" to="/signup">
            SNS 검색
          </NavLink>
          <NavLink className="btn btn-secondary gravity-item" to="/app">
            I'm Feeling Lucky
          </NavLink>
        </div>
        <p className="home-meta">채널 3개 무료 · 1초 내 목록 로딩 · 실패 알림 제공</p>
      </section>
    </PublicLayout>
  );
}

function Login() {
  return (
    <PublicLayout>
      <section className="auth">
        <div className="auth-header">
          <h1>기존 사용자 로그인</h1>
          <p>이메일/비밀번호 또는 소셜 로그인으로 진입합니다.</p>
        </div>
        <div className="auth-card">
          <Notice>상태/에러: 인증 실패, 계정 미확인</Notice>
          <Kv
            items={[
              ["이메일/비밀번호", "기본 로그인 폼"],
              ["소셜 로그인", "선택 옵션"],
              ["비밀번호 재설정", "링크 제공"],
            ]}
          />
          <div className="button-row">
            <NavLink className="btn btn-primary" to="/app">
              로그인
            </NavLink>
            <NavLink className="btn btn-secondary" to="/signup">
              회원가입
            </NavLink>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

function Signup() {
  return (
    <PublicLayout>
      <section className="auth">
        <div className="auth-header">
          <h1>신규 사용자 온보딩 시작</h1>
          <p>이메일/비밀번호로 빠르게 계정을 생성합니다.</p>
        </div>
        <div className="auth-card">
          <Notice>상태/에러: 중복 이메일, 약관 미동의</Notice>
          <Kv
            items={[
              ["이메일/비밀번호", "기본 가입 폼"],
              ["약관 동의", "필수 체크박스"],
              ["소셜 가입", "선택 옵션"],
            ]}
          />
          <div className="button-row">
            <NavLink className="btn btn-primary" to="/onboarding">
              회원가입
            </NavLink>
            <NavLink className="btn btn-secondary" to="/login">
              로그인
            </NavLink>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

function Onboarding() {
  return (
    <PublicLayout>
      <section className="auth">
        <div className="auth-header">
          <h1>Buffer 연결과 채널 연결 완료</h1>
          <p>OAuth로 Buffer를 연결하고 사용할 채널을 선택합니다.</p>
        </div>
        <div className="auth-card">
          <Notice>상태/에러: OAuth 실패, 채널 연결 실패</Notice>
          <Kv
            items={[
              ["Buffer 연결 버튼", "OAuth 진행"],
              ["채널 선택/연결", "SNS 채널 선택"],
              ["플랜 안내", "무료 3개 제한"],
            ]}
          />
          <div className="button-row">
            <NavLink className="btn btn-primary" to="/app">
              대시보드 이동
            </NavLink>
            <NavLink className="btn btn-secondary" to="/app/accounts">
              채널 연결
            </NavLink>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

function Dashboard() {
  return (
    <AppLayout cta={{ label: "새 게시물", to: "/app/post" }}>
      <div className="page-header">
        <h1>대시보드</h1>
        <p>오늘/이번주 예약 개수, 최근 발행 결과, 채널 상태 요약.</p>
      </div>
      <Section title="요약 카드">
        <Grid>
          <Card title="예약 요약">오늘/이번주 예약 개수</Card>
          <Card title="최근 발행 결과">성공/실패/재시도 상태</Card>
          <Card title="채널 상태">연결 상태 및 경고 표시</Card>
        </Grid>
      </Section>
      <Section title="주요 액션">
        <Grid>
          <Card title="새 게시물 작성">`/app/post`로 이동</Card>
          <Card title="예약 캘린더 이동">`/app/schedule`로 이동</Card>
          <Card title="채널 관리">`/app/accounts`로 이동</Card>
        </Grid>
      </Section>
      <Section title="API">
        <Kv
          items={[
            ["GET /stats/summary", "요약 지표 제공"],
            ["GET /posts/recent", "최근 발행 결과 조회"],
          ]}
        />
      </Section>
    </AppLayout>
  );
}

function PostEditor() {
  return (
    <AppLayout cta={{ label: "예약 보기", to: "/app/schedule" }}>
      <div className="page-header">
        <h1>게시물 작성</h1>
        <p>텍스트, 이미지, 해시태그 템플릿으로 게시물을 구성합니다.</p>
        <Notice>상태/에러: 이미지 업로드 실패, 예약 시간 충돌</Notice>
      </div>
      <Section title="주요 구성">
        <Grid>
          <Card title="채널 선택">SNS 채널 다중 선택</Card>
          <Card title="텍스트 입력">게시물 본문 작성</Card>
          <Card title="이미지 업로드">미디어 첨부</Card>
          <Card title="해시태그 템플릿">템플릿 저장/불러오기</Card>
          <Card title="예약 시간 선택">발행 일정 설정</Card>
          <Card title="미리보기">가능한 범위 내 미리보기</Card>
        </Grid>
      </Section>
      <Section title="주요 액션">
        <Grid>
          <Card title="즉시 발행">바로 발행 요청</Card>
          <Card title="예약 저장">스케줄 등록</Card>
          <Card title="임시 저장">초안 보관</Card>
        </Grid>
      </Section>
      <Section title="API">
        <Kv
          items={[
            ["POST /posts", "게시물 생성"],
            ["POST /uploads", "이미지 업로드"],
          ]}
        />
      </Section>
    </AppLayout>
  );
}

function Schedule() {
  return (
    <AppLayout cta={{ label: "새 게시물", to: "/app/post" }}>
      <div className="page-header">
        <h1>예약 캘린더</h1>
        <p>월/주 보기 전환과 예약 카드 목록으로 일정 관리.</p>
      </div>
      <Section title="주요 구성">
        <Grid>
          <Card title="월/주 보기 전환">뷰 모드 선택</Card>
          <Card title="예약 카드 목록">상태별 필터 지원</Card>
          <Card title="드래그로 시간 변경">선택 기능</Card>
        </Grid>
      </Section>
      <Section title="주요 액션">
        <Grid>
          <Card title="예약 수정">시간/채널 변경</Card>
          <Card title="예약 취소">발행 취소</Card>
          <Card title="상태 필터">예정/실패/완료 필터링</Card>
        </Grid>
      </Section>
      <Section title="API">
        <Kv
          items={[
            ["GET /posts?status=scheduled", "예약 목록 조회"],
            ["PATCH /posts/:id", "예약 수정"],
          ]}
        />
      </Section>
    </AppLayout>
  );
}

function Accounts() {
  return (
    <AppLayout cta={{ label: "게시물 작성", to: "/app/post" }}>
      <div className="page-header">
        <h1>채널 연결</h1>
        <p>Buffer 계정과 채널을 연결하고 상태를 확인합니다.</p>
      </div>
      <Section title="주요 구성">
        <Grid>
          <Card title="연결된 채널 리스트">채널 상태와 제한 표시</Card>
          <Card title="채널 추가">무료 3개 제한 안내</Card>
          <Card title="연결 상태 표시">정상/만료/에러 상태</Card>
        </Grid>
      </Section>
      <Section title="주요 액션">
        <Grid>
          <Card title="채널 추가">Buffer 채널 연결</Card>
          <Card title="연결 해제">채널 연결 해제</Card>
          <Card title="재인증">만료 계정 재연결</Card>
        </Grid>
      </Section>
      <Section title="API">
        <Kv
          items={[
            ["GET /accounts", "채널 리스트 조회"],
            ["POST /accounts/link", "채널 연결"],
            ["DELETE /accounts/:id", "채널 삭제"],
          ]}
        />
      </Section>
    </AppLayout>
  );
}

function Library() {
  return (
    <AppLayout cta={{ label: "복사해서 작성", to: "/app/post" }}>
      <div className="page-header">
        <h1>콘텐츠 라이브러리</h1>
        <p>작성/발행된 게시물을 재사용합니다.</p>
      </div>
      <Section title="주요 구성">
        <Grid>
          <Card title="게시물 카드 리스트">작성/발행 이력</Card>
          <Card title="검색/필터">채널/기간/상태 필터</Card>
          <Card title="템플릿 저장">자주 쓰는 콘텐츠 보관</Card>
        </Grid>
      </Section>
      <Section title="주요 액션">
        <Grid>
          <Card title="복사해서 작성">기존 게시물 재사용</Card>
          <Card title="템플릿 저장">새 템플릿 추가</Card>
        </Grid>
      </Section>
      <Section title="API">
        <Kv
          items={[
            ["GET /posts", "게시물 조회"],
            ["POST /templates", "템플릿 저장"],
          ]}
        />
      </Section>
    </AppLayout>
  );
}

function Analytics() {
  return (
    <AppLayout cta={{ label: "기간 변경", to: "/app/analytics" }}>
      <div className="page-header">
        <h1>분석</h1>
        <p>최근 7일/30일 성과와 채널별 발행 수.</p>
      </div>
      <Section title="주요 구성">
        <Grid>
          <Card title="기간 선택">7일/30일</Card>
          <Card title="채널별 발행 수">채널별 비교</Card>
          <Card title="요일/시간 분석">가장 많이 발행한 요일/시간</Card>
        </Grid>
      </Section>
      <Section title="주요 액션">
        <Grid>
          <Card title="기간 변경">필터로 분석 범위 변경</Card>
        </Grid>
      </Section>
      <Section title="API">
        <Kv items={[["GET /analytics/summary", "성과 요약"]]} />
      </Section>
    </AppLayout>
  );
}

function Settings() {
  return (
    <AppLayout cta={{ label: "저장", to: "/app/settings" }}>
      <div className="page-header">
        <h1>설정</h1>
        <p>프로필/비밀번호, 알림, 타임존을 관리합니다.</p>
      </div>
      <Section title="주요 구성">
        <Grid>
          <Card title="프로필/비밀번호 변경">이메일, 비밀번호 관리</Card>
          <Card title="알림 설정">이메일/앱 알림</Card>
          <Card title="기본 타임존">예약 기준 타임존</Card>
        </Grid>
      </Section>
      <Section title="주요 액션">
        <Grid>
          <Card title="저장">설정 값 업데이트</Card>
        </Grid>
      </Section>
      <Section title="API">
        <Kv
          items={[
            ["GET /me", "내 정보 조회"],
            ["PATCH /me", "내 정보 수정"],
          ]}
        />
      </Section>
    </AppLayout>
  );
}

function Billing() {
  return (
    <AppLayout cta={{ label: "업그레이드", to: "/app/billing" }}>
      <div className="page-header">
        <h1>결제/플랜</h1>
        <p>플랜 비교와 결제 수단 등록, 결제 내역을 관리합니다.</p>
      </div>
      <Section title="주요 구성">
        <Grid>
          <Card title="플랜 비교">무료 3개 채널 기준</Card>
          <Card title="결제 수단 등록">카드/간편 결제</Card>
          <Card title="결제 내역">최근 결제 기록</Card>
        </Grid>
      </Section>
      <Section title="주요 액션">
        <Grid>
          <Card title="업그레이드">유료 플랜 전환</Card>
          <Card title="플랜 변경/해지">구독 관리</Card>
        </Grid>
      </Section>
      <Section title="API">
        <Kv
          items={[
            ["GET /billing/plan", "플랜 정보 조회"],
            ["POST /billing/checkout", "결제 요청"],
          ]}
        />
      </Section>
    </AppLayout>
  );
}

function NotFound() {
  return (
    <PublicLayout>
      <section className="auth">
        <div className="auth-header">
          <h1>페이지를 찾을 수 없습니다</h1>
          <p>요청한 경로가 존재하지 않습니다.</p>
        </div>
        <div className="auth-card">
          <NavLink className="btn btn-primary" to="/">
            랜딩 이동
          </NavLink>
        </div>
      </section>
    </PublicLayout>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/app" element={<Dashboard />} />
      <Route path="/app/post" element={<PostEditor />} />
      <Route path="/app/schedule" element={<Schedule />} />
      <Route path="/app/accounts" element={<Accounts />} />
      <Route path="/app/library" element={<Library />} />
      <Route path="/app/analytics" element={<Analytics />} />
      <Route path="/app/settings" element={<Settings />} />
      <Route path="/app/billing" element={<Billing />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
