# PeerMall Frontend 프로젝트 구조

이 문서는 PeerMall 프론트엔드 프로젝트의 디렉토리 구조와 각 구성 요소의 역할을 설명합니다.

## 🚀 기술 스택

- **Framework**: React (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Query, Context API
- **Routing**: React Router DOM
- **Local Database**: IndexedDB

## 📂 디렉토리 구조도

```
Frontend/
├── .github/                # GitHub Actions 워크플로우 (존재 시)
├── .vscode/                # VSCode 에디터 설정
├── docs/                   # 프로젝트 문서
│   └── project-structure.md  # 현재 문서
├── node_modules/           # npm 패키지
├── public/                 # 정적 에셋 (이미지, 폰트 등)
├── src/                    # 애플리케이션 소스 코드
│   ├── components/         # 재사용 가능한 React 컴포넌트
│   │   ├── ui/             # shadcn/ui 기본 컴포넌트
│   │   ├── dashboard/      # 대시보드 관련 복합 컴포넌트
│   │   ├── Layout.tsx      # 공통 레이아웃 (헤더, 푸터 등)
│   │   └── ProtectedRoute.tsx # 인증 기반 라우트 보호
│   ├── hooks/              # 커스텀 React Hooks
│   │   ├── use-mobile.tsx  # 모바일 뷰포트 감지
│   │   └── use-toast.ts    # Toast UI Hook
│   ├── lib/                # 라이브러리, 유틸리티, 비즈니스 로직
│   │   ├── indexeddb/      # IndexedDB 관련 서비스 로직
│   │   │   ├── authService.ts
│   │   │   ├── database.ts
│   │   │   ├── peermallService.ts
│   │   │   ├── productService.ts
│   │   │   └── userService.ts
│   │   └── utils.ts        # 공통 유틸리티 함수 (e.g., cn)
│   ├── pages/              # 라우팅 단위의 페이지 컴포넌트
│   │   ├── community/      # 커뮤니티 관련 페이지
│   │   ├── events/         # 이벤트 관련 페이지
│   │   ├── mypage/         # 마이페이지 관련 페이지
│   │   ├── peermalls/      # 피어몰 관련 페이지
│   │   ├── products/       # 상품 관련 페이지
│   │   ├── Index.tsx       # 시작 페이지 (현재 사용 안함)
│   │   ├── Login.tsx       # 로그인 페이지
│   │   ├── Main.tsx        # 메인 대시보드 페이지
│   │   └── NotFound.tsx    # 404 페이지
│   ├── App.css             # 전역 CSS (일부)
│   ├── App.tsx             # 애플리케이션 최상위 컴포넌트 (라우팅 정의)
│   ├── index.css           # Tailwind CSS 기본 설정 및 전역 스타일
│   ├── main.tsx            # 애플리케이션 진입점 (Root 렌더링)
│   └── vite-env.d.ts       # Vite 타입 정의
├── .gitignore              # Git 추적 제외 파일 목록
├── index.html              # 애플리케이션 기본 HTML
├── package.json            # 프로젝트 정보 및 의존성 관리
├── postcss.config.js       # PostCSS 설정 (Tailwind, Autoprefixer)
├── tailwind.config.ts      # Tailwind CSS 설정
├── tsconfig.json           # TypeScript 컴파일러 설정
└── vite.config.ts          # Vite 빌드 도구 설정
```

## 📒 주요 디렉토리 및 파일 역할

### 📁 `public/`
- 웹 서버의 루트에서 직접 접근 가능한 정적 파일들을 위치시킵니다.
- Favicon, `robots.txt`, manifest 파일, 대체 이미지 등이 포함됩니다.

### 📁 `src/`
애플리케이션의 핵심 소스 코드가 위치하는 메인 디렉토리입니다.

#### 📄 `main.tsx`
- React 애플리케이션의 최상위 진입점입니다.
- `ReactDOM.createRoot`를 사용하여 `App` 컴포넌트를 `index.html`의 `#root` 요소에 렌더링합니다.
- IndexedDB를 초기화하는 로직을 포함합니다.

#### 📄 `App.tsx`
- 애플리케이션의 전체적인 구조와 라우팅을 정의합니다.
- `react-router-dom`을 사용하여 각 URL 경로에 해당하는 페이지 컴포넌트를 매핑합니다.
- `QueryClientProvider`, `TooltipProvider` 등 전역 컨텍스트 프로바이더를 설정합니다.
- 인증이 필요한 경로는 `ProtectedRoute` 컴포넌트로 감싸 보호합니다.

#### 📁 `src/components/`
- 여러 페이지에서 재사용될 수 있는 UI 컴포넌트를 관리합니다.
- **`ui/`**: `shadcn/ui`를 통해 생성된 원자 단위의 UI 컴포넌트(Button, Card, Input 등)가 위치합니다. 커스터마이징이 필요할 경우 이 파일들을 수정합니다.
- **`dashboard/`**: 메인 대시보드(`Main.tsx`)에서 사용되는 특정 섹션 컴포넌트(Hero, Category, Content 등)를 그룹화합니다.
- **`Layout.tsx`**: 헤더, 푸터, 네비게이션 등 공통적인 페이지 레이아웃을 정의합니다. `App.tsx`에서 각 페이지를 감싸는 형태로 사용됩니다.
- **`ProtectedRoute.tsx`**: 사용자의 로그인 상태를 확인하여 특정 라우트에 대한 접근을 제어합니다.

#### 📁 `src/pages/`
- `react-router-dom`에 의해 관리되는 각 페이지 단위의 컴포넌트입니다.
- 각 하위 디렉토리는 기능별로 페이지를 그룹화합니다. (e.g., `peermalls`, `products`, `mypage`)
- 페이지 컴포넌트는 주로 `components` 폴더의 컴포넌트들을 조합하여 구성됩니다.

#### 📁 `src/hooks/`
- 여러 컴포넌트에서 공통으로 사용될 수 있는 로직을 분리한 커스텀 React Hook을 관리합니다.
- `use-toast.ts`: 사용자에게 알림 메시지를 보여주는 Toast UI의 상태와 로직을 관리합니다.
- `use-mobile.tsx`: 현재 브라우저의 뷰포트가 모바일 크기인지 여부를 판단하는 훅입니다.

#### 📁 `src/lib/`
- UI와 직접적인 관련이 없는 유틸리티 함수, 외부 서비스 연동, 비즈니스 로직 등을 관리합니다.
- **`utils.ts`**: `clsx`와 `tailwind-merge`를 결합한 `cn` 함수와 같이 프로젝트 전반에서 사용되는 헬퍼 함수를 포함합니다.
- **`indexeddb/`**: 클라이언트 사이드 데이터베이스(IndexedDB)를 관리하기 위한 모든 로직이 포함됩니다.
    - `database.ts`: DB 스키마(테이블, 인덱스)를 정의하고 초기화합니다.
    - `*Service.ts`: 각 데이터 모델(User, Product 등)에 대한 CRUD(Create, Read, Update, Delete) 및 비즈니스 로직을 클래스 형태로 구현합니다.

### 📄 최상위 설정 파일
- **`vite.config.ts`**: Vite 개발 서버 및 빌드 관련 설정을 정의합니다. (플러그인, 경로 별칭 등)
- **`tailwind.config.ts`**: Tailwind CSS의 테마(색상, 폰트, 간격 등)와 플러그인을 설정합니다.
- **`tsconfig.json`**: 프로젝트 전반의 TypeScript 컴파일러 옵션을 설정합니다.
- **`package.json`**: 프로젝트의 이름, 버전, 스크립트, 의존성 패키지 목록을 관리합니다.
