# Sampoom Management Frontend

이 프로젝트는 Sampoom Management 시스템을 위한 프론트엔드 애플리케이션입니다. Vite, React, TypeScript를 기반으로 구축되었습니다.

## 💻 프로젝트 시작하기

### 1. 사전 요구 사항

- [Node.js](https://nodejs.org/en/) (프로젝트 `volta` 설정에 따라 `v22.17.0` 사용)
- [pnpm](https://pnpm.io/installation)

### 2. 설치 및 실행

1.  **저장소 클론**

    ```bash
    git clone <your-repository-url>
    cd Sampoom-Management-Frontend
    ```

2.  **의존성 설치**

    ```bash
    pnpm install
    ```

3.  **개발 서버 실행**

    ```bash
    pnpm dev
    ```

### 3. 애플리케이션 접속

개발 서버가 성공적으로 실행되면 아래 주소로 접속할 수 있습니다.

- **URL:** [http://localhost:3000](http://localhost:3000)

---

## 📜 주요 스크립트 명령어

### 개발

- `pnpm dev` (or `pnpm start`): Vite 개발 서버를 시작합니다.
- `pnpm build`: 프로덕션용으로 프로젝트를 빌드하여 `dist` 폴더에 결과물을 생성합니다.
- `pnpm preview`: `dist` 폴더의 프로덕션 빌드를 로컬에서 미리 봅니다.

### 테스트

- `pnpm test`: Vitest를 사용하여 모든 테스트를 실행합니다.
- `pnpm test:ui`: Vitest UI를 실행하여 시각적으로 테스트를 확인하고 상호작용합니다.
- `pnpm test:watch`: 파일 변경 시 자동으로 테스트를 재실행합니다.

### 코드 품질

- `pnpm lint`: ESLint를 사용하여 프로젝트 전체의 코드 스타일을 검사합니다.
- `pnpm lint:fix`: ESLint가 감지한 문제를 자동으로 수정합니다.
- `pnpm typecheck`: TypeScript 컴파일러를 통해 타입 오류를 검사합니다.
- `pnpm prettier`: Prettier를 사용하여 모든 파일의 코드 형식을 맞춥니다.

### FSD 아키텍처

- `pnpm fsd`: Steiger를 사용하여 FSD 아키텍처 규칙을 검사합니다.
- `pnpm diagram`: FSD 아키텍처 의존성 다이어그램을 생성합니다.

### API 타입 생성

- `pnpm merge-api-schemas`: 여러 OpenAPI 스키마를 하나로 병합합니다.
- `pnpm generate-api-types`: 병합된 OpenAPI 스키마에서 TypeScript 타입을 생성합니다.
- `pnpm generate:api:all`: API 스키마 병합 및 타입 생성을 한 번에 실행합니다.

### 유틸리티

- `pnpm clean`: `node_modules`, `pnpm-lock.yaml`, `dist` 폴더를 삭제합니다.
- `pnpm validate`: 프로젝트 검증 스크립트를 실행합니다.

---

## 🏗️ 프로젝트 아키텍처

이 프로젝트는 **FSD (Feature-Sliced Design)** 아키텍처를 기반으로 구성되어 있습니다. FSD는 확장 가능하고 유지보수가 용이한 프론트엔드 애플리케이션을 위한 방법론입니다.

### 디렉토리 구조

```
src/
├── app/          # 애플리케이션 초기화, 라우팅, 공급자
├── pages/        # 전체 페이지 컴포넌트
├── widgets/      # 독립적인 복합 블록 (예: Header, Layout, Sidebar)
├── features/     # 비즈니스 기능 (사용자 액션과 통합)
├── entities/     # 비즈니스 엔티티
└── shared/       # 재사용 가능한 인프라 코드 (UI kit, API, utils)
```

### 주요 비즈니스 모듈

#### 📦 Master (기준 정보)

- 품목 관리 (Items)
- BOM 관리 (Bill of Materials)
- 거래처 관리 (Partners)
- 부서 관리 (Departments)
- 직급 관리 (Positions)
- 작업장 관리 (Work Centers)
- 공정 관리 (Routings)

#### 🏭 Factory (공장 관리)

- 주문 관리 (Orders)
- 원자재 재고 (Materials)
- BOM 관리
- 직원 관리

#### 📦 Warehouse (창고 관리)

- 주문 관리
- 부품 재고 (Inventory)
- 직원 관리

#### 👥 HRM (인사 관리)

- 근태 관리 (Attendance)
- 직원 관리
- 평가 관리 (Evaluation)
- 급여 관리 (Payroll)

#### 🏭 Production (생산 관리)

- 작업 지시서 (Work Orders)
- 생산 계획 (Planning)

#### 🛒 Purchasing (구매 관리)

- 구매 주문
- 구매 요청

#### 💰 Sales (판매 관리)

- 판매 주문

#### 📊 WMS (창고 관리 시스템)

- 재고 관리 (Inventory)
- 출고 관리 (Shipping)

---

## ✨ 기술 스택 및 설치된 플러그인

이 프로젝트는 다음과 같은 주요 라이브러리와 플러그인으로 구성되어 있습니다.

### 핵심 기술

- **React (`^19.2.0`):** 사용자 인터페이스 구축을 위한 기본 프레임워크.
- **Vite (`^7.1.12`):** 빠르고 효율적인 개발 및 빌드를 위한 번들러.
- **TypeScript (`^5.9.3`):** 코드의 안정성과 가독성을 높이기 위한 정적 타입 언어.

### 상태 관리

- **Zustand (`^5.0.8`):** 경량 상태 관리 라이브러리 (인증 상태 등).

### 데이터 페칭 & API

- **TanStack Query (`^5.90.5`):** 서버 상태 관리 및 데이터 페칭.
- **openapi-fetch (`^0.15.0`):** 타입 안전한 OpenAPI 클라이언트.
- **openapi-react-query (`^0.5.1`):** React Query와 OpenAPI 통합.
- **axios (`^1.13.0`):** HTTP 클라이언트.

### 라우팅

- **React Router (`^7.9.4`):** 클라이언트 사이드 라우팅 관리.

### UI 컴포넌트 & 스타일링

- **Tailwind CSS (`^4.1.16`):** 유틸리티-우선 CSS 프레임워크.
- **PostCSS (`^8.5.6`):** CSS 변환을 위한 도구.
- **`@tailwindcss/postcss`:** PostCSS와 Tailwind CSS를 연결하는 플러그인.
- **`prettier-plugin-tailwindcss`:** Prettier가 Tailwind CSS 클래스 순서를 자동으로 정렬하는 플러그인.
- **`clsx` (`^2.1.1`):** 조건부 클래스 이름 결합.
- **`tailwind-merge` (`^3.3.1`):** Tailwind 클래스 병합.
- **`class-variance-authority` (`^0.7.1`):** 컴포넌트 변형 관리.
- **`@radix-ui/react-slot` (`^1.2.3`):** 컴포넌트 합성.
- **`@heroicons/react` (`^2.2.0`):** 아이콘 라이브러리.

### 모니터링

- **`@vercel/analytics` (`^1.5.0`):** Vercel Analytics.
- **`@vercel/speed-insights` (`^1.2.0`):** Vercel Speed Insights.

### 에러 처리

- **react-error-boundary (`^6.0.0`):** React 애플리케이션의 에러 경계 처리.

### 코드 품질 및 일관성

- **ESLint (`^9.38.0`):** JavaScript 및 TypeScript 코드의 문제를 찾아주는 린터.
  - `eslint-config-ts-prefixer` (`^4.0.0`): 타입스크립트 관련 ESLint 규칙 프리셋.
  - `eslint-plugin-react-hooks` (`^7.0.1`): React Hooks의 규칙을 강제하는 플러그인.
  - `@feature-sliced/steiger-plugin` (`^0.5.7`): FSD 아키텍처 규칙 검증 플러그인.
- **Prettier (`^3.6.1`):** 일관된 코드 스타일을 유지하기 위한 코드 포맷터.
- **Husky (`^9.1.7`):** Git hooks를 쉽게 관리하여 커밋 전 `lint-staged` 실행 등을 자동화.
- **lint-staged (`^16.2.6`):** Git에 스테이징된 파일에 대해서만 린팅 및 포맷팅을 실행.
- **steiger (`^0.5.11`):** FSD 아키텍처 검증 도구.
- **dependency-cruiser (`^17.1.0`):** 의존성 다이어그램 생성 도구.

### 테스트

- **Vitest (`^3.2.0`):** Vite 환경에 최적화된 테스트 프레임워크.
- **React Testing Library (`^16.3.0`):** 컴포넌트를 사용자와 같은 방식으로 테스트하기 위한 라이브러리.
- **JSDOM (`^27.0.1`):** Node.js 환경에서 DOM 환경을 시뮬레이션하여 테스트를 실행.
- **@vitest/ui (`^3.1.1`):** 테스트 결과를 시각적으로 보여주는 Vitest용 UI.
- **@testing-library/jest-dom (`^6.9.1`):** Jest DOM 매처 라이브러리.
- **@testing-library/user-event (`^14.6.1`):** 사용자 이벤트 시뮬레이션.

### API 모킹

- **Mock Service Worker (MSW) (`^2.11.6`):** 서비스 워커를 사용하여 네트워크 요청을 가로채 API를 모킹합니다.

### 타입 생성

- **openapi-typescript (`^7.10.1`):** OpenAPI 스키마에서 TypeScript 타입 생성.
- **openapi-merge-cli (`^1.3.2`):** 여러 OpenAPI 스키마 병합.

### Vite 플러그인

- **@vitejs/plugin-react-swc (`^4.2.0`):** SWC를 사용하여 React 코드를 매우 빠르게 트랜스파일합니다.
- **vite-plugin-environment (`^1.1.3`):** `.env` 파일의 환경 변수를 애플리케이션에서 사용할 수 있도록 합니다.
- **vite-plugin-svgr (`^4.5.0`):** SVG 파일을 React 컴포넌트처럼 가져와서 사용할 수 있게 합니다.

### Tailwind CSS 플러그인

- **@tailwindcss/aspect-ratio (`^0.4.2`):** 종횡비 유틸리티.
- **@tailwindcss/forms (`^0.5.10`):** 폼 요소 스타일링.
- **@tailwindcss/typography (`^0.5.19`):** 타이포그래피 플러그인.

---

## 📁 프로젝트 구조 상세

### FSD 레이어 설명

#### `app/` - 애플리케이션 초기화

- 라우팅 설정
- 전역 프로바이더 (Theme, Notification 등)
- 에러 바운더리
- 애플리케이션 진입점

#### `pages/` - 페이지 컴포넌트

- 전체 페이지 뷰
- 라우터 경로와 직접 연결
- URL 기반 라우팅

#### `widgets/` - 복합 UI 블록

- Header, Layout, Sidebar 등
- 여러 기능을 결합한 독립적인 블록
- 여러 페이지에서 재사용 가능

#### `features/` - 비즈니스 기능

- 사용자 액션과 관련된 기능
- 특정 도메인의 상호작용 로직

#### `entities/` - 비즈니스 엔티티

- 비즈니스 도메인 객체
- API 모델 및 비즈니스 로직

#### `shared/` - 재사용 가능한 코드

- UI kit (Button, Input, Table 등)
- API 클라이언트
- 유틸리티 함수
- 공통 설정

---

## 🔧 개발 환경 설정

### 환경 변수

프로젝트 루트에 `.env` 파일을 생성하고 필요한 환경 변수를 설정하세요.

```bash
# .env 예시
REACT_APP_TEXT=Development
```

### Path Alias

프로젝트에서 `@` alias를 사용하여 절대 경로로 import할 수 있습니다:

```typescript
// 상대 경로 대신
import { Button } from "../../../shared/ui/Button";

// 절대 경로 사용
import { Button } from "@/shared/ui/Button";
```

### FSD 아키텍처 검증

FSD 아키텍처 규칙을 검증하려면:

```bash
pnpm fsd
```

의존성 다이어그램을 생성하려면:

```bash
pnpm diagram
```

---

## 📝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.
