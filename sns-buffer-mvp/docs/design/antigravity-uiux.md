# Google Antigravity UI/UX Spec

작성일: 2026-02-06  
버전: 1.2 (React Tech Stack 추가)  
프로젝트: Google Antigravity (Chrome Experiment)  
적용 대상: SNS Buffer MVP 웹 UI

---

## 1. 개요 (Project Overview)
Google Antigravity는 사용자에게 예상치 못한 즐거움(Serendipity)을 제공하는 인터랙티브 웹사이트다. 친숙한 구글 검색 페이지가 사용자의 개입으로 인해 무너져 내리는 경험을 통해 유쾌한 인상을 남긴다.

UX 목표
- 놀라움: 정적인 페이지가 동적으로 변하는 순간의 임팩트 극대화
- 탐험: 사용자가 요소를 클릭하고 던지며 체류 시간 증대
- 지속성: 카오스 상태에서도 검색 기능 유지

---

## 2. 디자인 시스템 (Design System)

### 2.1 컬러 팔레트 (Color Palette)
- Brand Blue: `#4285F4` (로고, 버튼, 링크)
- Brand Red: `#EA4335` (로고)
- Brand Yellow: `#FBBC05` (로고)
- Brand Green: `#34A853` (로고)
- Background: `#FFFFFF` (Negative Space)
- Text Primary: `#202124` (Readability)
- Text Gray: `#5F6368` (Secondary Info)

### 2.2 타이포그래피 (Typography)
- Primary Font: `Arial, sans-serif`
- Logo: 이미지로 처리
- Search Input: 16px
- Buttons: 14px, Bold
- Footer Links: 13px, Regular

---

## 3. 사용자 여정 및 인터랙션 (User Journey & Interaction)

### 3.1 사용자 흐름 (User Flow)
- 진입: URL 접속
- 인지: Google 검색 페이지로 인식
- 탐색: 마우스 이동/클릭 시도
- 전환: 중력 활성화, UI 요소 낙하
- 놀이: 요소 드래그 및 충돌 실험
- 이탈/검색: 검색 입력 후 엔터 또는 종료

### 3.2 마이크로 인터랙션 (Micro-interactions)
A. 트리거
- 조건: 페이지 로드 후 최초 mousemove 또는 click
- 피드백: 즉각적으로 중력 엔진 가동

B. 호버 및 커서
- 초기 상태: default, text, pointer
- 활성 상태: hover 시 grab, drag 시 grabbing
- 검색창 내부: text 유지

C. 드래그 앤 스로우
- 마우스 다운 후 이동 → 업 시 속도 벡터 계산
- 놓는 순간의 속도에 비례한 추진력

---

## 4. UI 구성요소 상세 (UI Components Detail)

### 4.1 검색바 (The Search Bar)
- 최상위 요소 (z-index: 100)
- 포커스 시 파란색 외곽선 유지
- 회전/이동 중에도 텍스트 입력 가능

### 4.2 버튼 및 링크 (Buttons & Links)
- Hit Area는 시각적 크기와 동일
- 충돌 박스는 사각형 권장

### 4.3 로고 (Logo)
- 가장 무거운 질량
- 충돌 시 화면 진동 효과 고려

---

## 5. 모션 및 물리 가이드라인 (Motion & Physics Guidelines)

### 5.1 물리 속성 (Physics Properties)
- Gravity: Normal ~ Low
- Bounciness: 0.6 ~ 0.8
- Friction: 0.1

### 5.2 반응형 동작 (Responsive Behavior)
- Mobile: DeviceOrientation으로 중력 방향 변경
- 터치 제스처로 멀티 터치 드래그 지원

---

## 6. 접근성 (Accessibility)
- 키보드 탐색 시 DOM 순서 유지
- 포커스 요소는 물리 효과에서 잠시 제외 고려
- 시맨틱 구조 유지 (header/main/footer/nav)

---

## 7. React 구현 스택 (React Tech Stack)

### 7.1 Core Libraries
- Physics Engine: `matter-js`
- Animation: `framer-motion`
- Styling: `tailwindcss`
- Icons: `lucide-react`

### 7.2 State & Utils
- Global State: `zustand`
- Hooks: `react-use`
- Class Utils: `clsx`, `tailwind-merge`

### 7.3 구현 아키텍처 (Implementation Architecture)
- Headless Physics Pattern: Matter.js는 백그라운드에서 연산
- DOM Sync Strategy: ref로 Body 연결, transform 직접 주입
- Canvas 렌더링 금지, HTML DOM 유지

---

## 8. 개발 핸드오프 노트 (Developer Handoff)
- 물리 활성화 시 React re-render 최소화
- 좌표 업데이트는 ref 직접 조작
- 이미지 자산은 투명 PNG/SVG 사용
- 초기 CSS 위치와 Body 좌표는 완전 일치 필요
