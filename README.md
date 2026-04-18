# my-fullstack-lab

풀스택 웹 개발을 연습하고 다양한 아이디어를 실험하기 위한 개인 실험실입니다. React 프론트엔드와 Node.js/Express 백엔드로 구성된 완전한 개발 환경을 제공합니다.

## 빠른 시작

### 사전 준비

- Node.js 18+ 및 npm
- Docker 및 Docker Compose (선택사항, 컨테이너 기반 개발 시 필요)

### 로컬 실행

1. **저장소 클론**

```bash
git clone https://github.com/kwonbongjun/my-fullstack-lab.git
cd my-fullstack-lab
```

2. **백엔드 실행**

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

백엔드는 http://localhost:3001 에서 실행됩니다.

3. **프론트엔드 실행** (새 터미널에서)

```bash
cd frontend
npm install
npm run dev
```

프론트엔드는 http://localhost:5173 에서 실행됩니다.

### Docker로 실행

프론트엔드와 백엔드를 Docker로 동시에 실행할 수 있습니다:

```bash
docker-compose up
```

두 서비스가 컨테이너로 시작됩니다:

- 백엔드: http://localhost:3001
- 프론트엔드: http://localhost:5173

> **참고:** `docker-compose.yml`은 로컬 개발 전용입니다. 프로덕션 배포는 GitHub Actions에서 `docker build` → Artifact Registry → Cloud Run 순서로 진행되며 docker-compose를 사용하지 않습니다.

### docker-compose.yml 구조 설명

```yaml
services:
  backend:
    volumes:
      - ./backend:/app # 호스트의 소스코드를 컨테이너에 실시간 동기화
      - /app/node_modules # 컨테이너의 node_modules를 익명 볼륨으로 보호
```

- **`./backend:/app`** (바인드 마운트): 호스트의 `./backend` 폴더를 컨테이너의 `/app`에 연결합니다. 로컬에서 코드를 수정하면 컨테이너에 즉시 반영되어, 이미지를 다시 빌드할 필요가 없습니다.
- **`/app/node_modules`** (익명 볼륨): 위의 바인드 마운트가 `/app` 전체를 호스트 폴더로 덮어쓰기 때문에, Dockerfile에서 `npm install`로 설치한 `node_modules`가 사라지는 문제가 생깁니다. 이 익명 볼륨을 선언하면 `node_modules`만 마운트에서 제외되어 컨테이너 내부의 것을 그대로 유지합니다.
- **`depends_on: backend`**: 프론트엔드보다 백엔드 컨테이너가 먼저 시작됩니다.
- **`fullstack-network`** (bridge): 두 서비스가 같은 네트워크에 속해 컨테이너 이름으로 서로 통신할 수 있습니다 (예: `http://backend:3001`).

### 로컬 vs 프로덕션 Dockerfile 동작 차이

`backend/Dockerfile`은 하나이지만, 실행 환경에 따라 동작이 다릅니다:

|              | 로컬 (docker-compose)                                              | 프로덕션 (Cloud Run)                                          |
| ------------ | ------------------------------------------------------------------ | ------------------------------------------------------------- |
| 실행 방식    | `docker-compose up`                                                | GitHub Actions → `docker build` → `gcloud run deploy`         |
| 소스코드     | volumes로 호스트 폴더를 마운트하여 Dockerfile의 빌드 결과를 덮어씀 | Dockerfile의 `COPY . .`와 `yarn build` 결과물이 이미지에 고정 |
| 코드 반영    | 파일 저장 즉시 반영                                                | 재배포 필요                                                   |
| node_modules | 익명 볼륨으로 컨테이너 내부 것 사용                                | 이미지 빌드 시 설치된 것 사용                                 |

## 프로젝트 구조

```
my-fullstack-lab/
├── backend/                # Express.js API 서버
│   ├── server.js           # 메인 서버 파일
│   ├── Dockerfile          # Cloud Run용 Docker 이미지
│   ├── package.json        # 백엔드 의존성
│   └── README.md           # 백엔드 문서
├── frontend/               # React + Vite 애플리케이션
│   ├── src/                # 소스 파일
│   ├── package.json        # 프론트엔드 의존성
│   └── README.md           # 프론트엔드 문서
├── .github/workflows/      # CI/CD 파이프라인
│   ├── cloudrun-backend.yml      # 백엔드 Cloud Run 배포 (main 브랜치)
│   └── cloudrun-backend-pr.yml   # 백엔드 PR 빌드 검증
├── .gitignore
├── LICENSE
└── README.md
```

## 기술 스택

### 프론트엔드

- **React 19** - UI 라이브러리
- **Vite** - 빌드 도구 및 개발 서버
- **ESLint** - 코드 린팅

### 백엔드

- **Node.js** - 런타임 환경
- **Express 5** - 웹 프레임워크
- **CORS** - 교차 출처 리소스 공유
- **dotenv** - 환경 변수 관리

### 데이터베이스 및 인프라

- **Cloud SQL** - PostgreSQL 데이터베이스 (GCP)
- **Cloud Run** - 서버리스 컨테이너 플랫폼 (GCP)
- **Artifact Registry** - Docker 이미지 레지스트리 (GCP)

## 주요 기능

- HMR(Hot Module Replacement)을 통한 빠른 개발
- 백엔드 API 예제 엔드포인트
- 프론트엔드-백엔드 연동 예제
- 로컬 개발을 위한 CORS 설정
- 개발 모드 및 프로덕션 모드 지원

## API 엔드포인트

### 백엔드 API

- `GET /health` - 헬스 체크
- `GET /api/hello` - GET 예제 엔드포인트
- `POST /api/data` - POST 예제 엔드포인트

## CI/CD 및 배포

### GitHub Actions 워크플로우

| 워크플로우                | 트리거                              | 설명                                         |
| ------------------------- | ----------------------------------- | -------------------------------------------- |
| `cloudrun-backend.yml`    | `main` 브랜치 push (백엔드 변경 시) | 빌드, Artifact Registry push, Cloud Run 배포 |
| `cloudrun-backend-pr.yml` | PR (백엔드 변경 시)                 | Docker 이미지 빌드 검증                      |

### Cloud Run 배포

백엔드는 `main` 브랜치에 변경사항이 push되면 **Google Cloud Run**에 자동 배포됩니다:

- **리전**: asia-northeast3 (서울)
- **데이터베이스**: Cloud SQL (PostgreSQL)
- **오토스케일링**: 0~10 인스턴스

## 개발 가이드

### 백엔드

```bash
cd backend
npm run dev    # 핫 리로드로 개발 서버 시작
npm start      # 프로덕션 서버 시작
```

### 프론트엔드

```bash
cd frontend
npm run dev      # 개발 서버 시작
npm run build    # 프로덕션 빌드
npm run preview  # 프로덕션 빌드 미리보기
npm run lint     # 린팅 실행
```

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참고하세요.
