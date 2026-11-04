# 삼품관리 프론트엔드

자동차 부품 제조사의 생산, 재고, 구매, 판매, 기준 정보, 인사 업무를 한곳에서 다루는 ERP 웹 화면입니다.
현대오토에버 모빌리티 SW 스쿨 3조(33-Auto)가 만든 팀 프로젝트의 프론트엔드 저장소입니다.

**배포본: https://sampoom.vercel.app**<br>
**API 규격: https://sampoom.vercel.app/swagger.html**

> 프로젝트는 끝났고 지금은 유지보수만 합니다. 원래 함께 돌던 MSA 백엔드(10개 서비스)는 내려가 있어서, 배포본과 로컬 개발 서버 모두 브라우저 안에서 도는 목 서버(MSW)로 동작합니다. 그래서 백엔드 없이도 화면을 끝까지 눌러볼 수 있습니다.

## 써 보기

1. https://sampoom.vercel.app 에 들어갑니다.
2. 로그인 화면의 "예시 계정으로 둘러보기"에서 부서를 하나 고릅니다. 이메일, 비밀번호, 조직이 채워집니다.
3. 로그인한 뒤 홈의 모듈 카드에서 각 화면으로 들어갑니다.

| 부서      | 이메일                 |
| --------- | ---------------------- |
| 생산 관리 | production@example.com |
| 재고 관리 | inventory@example.com  |
| 구매 관리 | purchase@example.com   |
| 판매 관리 | sales@example.com      |
| 기준 정보 | md@example.com         |
| 인사 관리 | hr@example.com         |
| 대리점    | agency@example.com     |

비밀번호는 모두 `12341234`입니다.

써 보기 전에 알아 두면 좋은 점:

- **어느 계정, 어느 조직을 골라도 쓸 수 있는 기능은 같습니다.** 역할별로 화면을 나누는 인가를 만들다가 멈췄기 때문입니다. `production2@example.com` 같은 담당자 계정 13개도 그때 역할을 나누려고 만들어 둔 것이라, 지금은 위 관리자 계정과 다르지 않습니다.
- **새로고침하면 데이터가 처음 상태로 돌아갑니다.** 목 데이터가 브라우저 메모리에만 있기 때문입니다. 로그인은 쿠키에 남아 유지됩니다.
- **모듈끼리 데이터가 이어지지 않습니다.** 모듈마다 목 데이터가 따로 있어서, 예를 들어 출고를 처리해도 재고 현황 숫자는 바뀌지 않습니다. 기준 정보의 품목만 다른 화면과 데이터를 같이 씁니다.
- 웹에는 판매 주문을 새로 만드는 화면이 없습니다. 주문은 원래 대리점 앱에서 들어왔고, 앱은 백엔드가 없어 지금 동작하지 않습니다. 들어 있는 주문을 다 처리했다면 새로고침하면 됩니다.
- 알려진 버그: 회원가입한 계정으로 로그인한 채 새로고침하면 그 계정이 사라져서, 로그인은 유지되지만 사용자가 생산 관리자로 바뀌어 보입니다.

## 화면

모듈 안에서는 위쪽 탭으로 화면을 옮깁니다. 왼쪽 아래 달 모양 버튼으로 다크 모드를 켜고 끌 수 있습니다.

| 모듈           | 탭과 주소                                                                                                                                          |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 기준 정보 관리 | 품목 `/master/items`, BOM `/master/bom`, 거래처 `/master/partners`, 지점 `/master/branches`, 작업장 `/master/workcenters`, 공정 `/master/routings` |
| 판매 관리      | 판매 주문 `/sales/orders`                                                                                                                          |
| 재고 관리(WMS) | 출고 지시 `/wms/shipping`, 재고 현황 `/wms/inventory`, 발주 관리 `/wms/orders`, ROP 설정 `/wms/rop-settings`                                       |
| 생산 관리      | 생산 지시(MES) `/production/orders`, 생산 계획(MRP) `/production/planning`, 생산 스케줄(MPS) `/production/mps`                                     |
| 구매 관리      | 구매 요청 `/purchasing/requests`                                                                                                                   |
| 인사 관리(HRM) | 직원 관리 `/hrm/employees`                                                                                                                         |

그 밖의 주소는 홈 `/`, 로그인 `/login`, 회원가입 `/signup`, 내 정보 `/profile`입니다.

부품은 대리점 주문 → 판매 → 창고 출고 → 창고의 발주 → 공장 생산 → 원자재 구매 순서로 움직입니다. 각 단계와 상태 값, BOM이나 ROP 같은 용어는 [업무 흐름과 용어](docs/domain.md)에 정리했습니다.

| 로그인                                       | 홈                                           | 생산 관리                                            |
| -------------------------------------------- | -------------------------------------------- | ---------------------------------------------------- |
| ![로그인 화면](public/screenshots/login.png) | ![홈 화면](public/screenshots/dashboard.png) | ![생산 관리 화면](public/screenshots/production.png) |

## 로컬에서 실행하기

준비물은 두 가지입니다.

- **Node.js 22.** `package.json`의 volta 설정이 `22.17.0`입니다. volta가 없다면 nvm 같은 도구로 22 버전을 쓰면 됩니다.
- **pnpm 10.** `npm install -g pnpm@10`으로 설치합니다. npm이나 yarn으로 의존성을 설치하면 `preinstall` 단계에서 막힙니다.

```bash
git clone https://github.com/33-Auto/Sampoom-Management-Frontend.git
cd Sampoom-Management-Frontend
pnpm install
pnpm dev
```

터미널에 나온 주소(보통 http://localhost:3000)를 열고 위 계정으로 로그인합니다. 설정 파일 `.env`가 저장소에 들어 있어서 따로 만들 파일은 없습니다.

| 명령                | 하는 일                                                                               |
| ------------------- | ------------------------------------------------------------------------------------- |
| `pnpm dev`          | 목 서버를 켠 개발 서버. 평소에는 이것만 쓰면 됩니다                                   |
| `pnpm validate`     | test, lint, typecheck, build, fsd를 한꺼번에 실행. PR에서 CI가 돌리는 검사와 같습니다 |
| `pnpm generate:api` | `public/openapi.json`으로 API 타입 파일을 다시 만듭니다                               |

나머지 명령과 환경 변수, 배포는 [개발 가이드](docs/development.md)에 있습니다.

## 고쳐서 올리기

- 브랜치는 `fix/fsd-item-mock-data`처럼 `종류/내용`으로 만듭니다. 종류는 `feat`, `fix`, `chore`, `docs`, `refactor`처럼 하는 일에 맞게 붙입니다.
- 커밋 메시지와 PR 제목은 같은 종류를 앞에 붙이고 한국어로 씁니다. 예: `fix: 품목 목 데이터를 entities/part로 내려 FSD 위반 제거`
- 33-Auto 저장소의 `main`으로 PR을 보냅니다. 리뷰는 기다리지 않고, CI가 통과하면 merge commit으로 머지합니다. 쓰기 권한이 필요하면 choosla(ccw.oopsla@gmail.com)에게 메일로 요청해 주세요.
- PR을 열면 팀 리뷰 요청과 CodeRabbit 리뷰 댓글이 자동으로 붙습니다. 프로젝트 기간에 쓰던 것이라 지금은 기다리거나 반영하지 않아도 됩니다.
- 커밋할 때 husky가 스테이징한 파일만 Prettier와 ESLint로 정리합니다. 훅은 내 PC에서 돌기 때문에 윈도우에서도 터미널에서 `pnpm`이 실행되는 상태여야 커밋됩니다.
- `main`에 머지되면 Vercel이 배포본에 자동으로 배포합니다. PR에는 Vercel 봇이 미리보기 주소를 댓글로 남깁니다.
- 예전 기록에 보이는 `SPM-481` 같은 번호는 프로젝트 기간의 Jira 이슈 키입니다. 지금은 Jira를 쓰지 않습니다.

## 더 읽을 문서

- [업무 흐름과 용어](docs/domain.md): 모듈이 이어지는 순서, 문서별 상태 값, 용어
- [개발 가이드](docs/development.md): 코드 구조(FSD), 라우팅, API 호출, 목 서버, 공용 UI, 테스트, 환경 변수, 배포

## 관련 저장소와 팀

React 19, TypeScript, Vite, TanStack Query, Zustand, Tailwind CSS 4, MSW로 만들었습니다. 전체 목록은 [개발 가이드](docs/development.md#기술-스택)에 있습니다.

- 백엔드: [Auth](https://github.com/33-Auto/Sampoom-Management-Backend-Auth), [User](https://github.com/33-Auto/Sampoom-Management-Backend-User), [Order](https://github.com/33-Auto/Sampoom-Management-Backend-Order), [Warehouse](https://github.com/33-Auto/Sampoom-Management-Backend-warehouse), [Factory](https://github.com/33-Auto/Sampoom-Management-Backend-Factory), [Agency](https://github.com/33-Auto/Sampoom-Management-Backend-Agency), [Part](https://github.com/33-Auto/Sampoom-Management-Backend-Part), [Material](https://github.com/33-Auto/Sampoom-Management-Backend-Material), [Purchase](https://github.com/33-Auto/Sampoom-Management-Backend-Purchase), [SITE](https://github.com/33-Auto/Sampoom-Management-Backend-SITE)
- 모바일 앱: [Android](https://github.com/33-Auto/Sampoom-Management-Android), [iOS](https://github.com/33-Auto/Sampoom-Management-iOS)
- 기타: [Swagger](https://github.com/33-Auto/Sampoom-Management-Swagger), [Infra](https://github.com/33-Auto/Sampoom-Management-Infra)
- 팀 소개: [33-Auto 조직 페이지](https://github.com/33-Auto)

프론트엔드는 추창우([CHOOSLA](https://github.com/CHOOSLA))가 맡았고, 판매 관리 화면, 품목 마스터 등록과 수정, 인사 관리 일부 화면은 채상윤([Sangyoon98](https://github.com/Sangyoon98))이 함께 만들었습니다.

## 라이선스

MIT 라이선스입니다. [laststance/create-react-app-vite](https://github.com/laststance/create-react-app-vite) 템플릿에서 시작해서, [LICENSE](LICENSE)에 33-Auto 팀과 템플릿 원작자 Laststance.io의 저작권 표기를 함께 두었습니다.
