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

-   **URL:** [http://localhost:3000](http://localhost:3000)

---

## 📜 주요 스크립트 명령어

-   `pnpm dev` (or `pnpm start`): Vite 개발 서버를 시작합니다.
-   `pnpm build`: 프로덕션용으로 프로젝트를 빌드하여 `dist` 폴더에 결과물을 생성합니다.
-   `pnpm preview`: `dist` 폴더의 프로덕션 빌드를 로컬에서 미리 봅니다.
-   `pnpm test`: Vitest를 사용하여 모든 테스트를 실행합니다.
-   `pnpm test:ui`: Vitest UI를 실행하여 시각적으로 테스트를 확인하고 상호작용합니다.
-   `pnpm lint`: ESLint를 사용하여 프로젝트 전체의 코드 스타일을 검사합니다.
-   `pnpm lint:fix`: ESLint가 감지한 문제를 자동으로 수정합니다.
-   `pnpm typecheck`: TypeScript 컴파일러를 통해 타입 오류를 검사합니다.
-   `pnpm prettier`: Prettier를 사용하여 모든 파일의 코드 형식을 맞춥니다.

---

## ✨ 기술 스택 및 설치된 플러그인

이 프로젝트는 다음과 같은 주요 라이브러리와 플러그인으로 구성되어 있습니다.

### 핵심 기술

-   **React (`^19.1.0`):** 사용자 인터페이스 구축을 위한 기본 프레임워크.
-   **Vite (`^7.0.0`):** 빠르고 효율적인 개발 및 빌드를 위한 번들러.
-   **TypeScript (`^5.8.3`):** 코드의 안정성과 가독성을 높이기 위한 정적 타입 언어.

### 라우팅

-   **React Router (`^7.6.2`):** 클라이언트 사이드 라우팅을 관리합니다.

### 스타일링

-   **Tailwind CSS (`^4.1.11`):** 유틸리티-우선 CSS 프레임워크.
-   **PostCSS (`^8.5.6`):** CSS 변환을 위한 도구.
-   **`@tailwindcss/postcss`:** PostCSS와 Tailwind CSS를 연결하는 플러그인.
-   **`prettier-plugin-tailwindcss`:** Prettier가 Tailwind CSS 클래스 순서를 자동으로 정렬하도록 돕는 플러그인.
-   **`clsx`:** 조건부로 클래스 이름을 쉽게 결합하기 위한 유틸리티.

### 코드 품질 및 일관성

-   **ESLint (`^9.29.0`):** JavaScript 및 TypeScript 코드의 문제를 찾아주는 린터.
    -   `eslint-config-ts-prefixer`: 타입스크립트 관련 ESLint 규칙 프리셋.
    -   `eslint-plugin-react-hooks`: React Hooks의 규칙을 강제하는 플러그인.
-   **Prettier (`^3.6.1`):** 일관된 코드 스타일을 유지하기 위한 코드 포맷터.
-   **Husky (`^9.1.7`):** Git hooks를 쉽게 관리하여 커밋 전 `lint-staged` 실행 등을 자동화.
-   **`lint-staged`:** Git에 스테이징된 파일에 대해서만 린팅 및 포맷팅을 실행.

### 테스트

-   **Vitest (`^3.2.0`):** Vite 환경에 최적화된 테스트 프레임워크.
-   **React Testing Library (`^16.3.0`):** 컴포넌트를 사용자와 같은 방식으로 테스트하기 위한 라이브러리.
-   **JSDOM (`^26.1.0`):** Node.js 환경에서 DOM 환경을 시뮬레이션하여 테스트를 실행.
-   **`@vitest/ui`:** 테스트 결과를 시각적으로 보여주는 Vitest용 UI.

### API 모킹

-   **Mock Service Worker (MSW) (`^2.10.2`):** 서비스 워커를 사용하여 네트워크 요청을 가로채 API를 모킹합니다.

### Vite 플러그인

-   **`@vitejs/plugin-react-swc`:** SWC를 사용하여 React 코드를 매우 빠르게 트랜스파일합니다.
-   **`vite-plugin-environment`:** `.env` 파일의 환경 변수를 애플리케이션에서 사용할 수 있도록 합니다.
-   **`vite-plugin-svgr`:** SVG 파일을 React 컴포넌트처럼 가져와서 사용할 수 있게 합니다.
