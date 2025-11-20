# FineDustProject 🌫️

미세먼지로부터 건강을 지키기 위한 실용적인 행동 방안을 제공하는 웹 애플리케이션입니다.

## 🌐 방문하기

**배포 URL**: https://fine-dust-project.vercel.app

**배포 QR**: 

<img width="200" height="200" alt="qr사진" src="https://github.com/user-attachments/assets/5e9d8b65-0428-4129-8175-a2e1c8a817ff" />

## 📋 서비스 소개

FineDustProject는 미세먼지로부터 건강을 지키기 위한 **실용적인 행동 방안**을 제공하는 서비스입니다. 단순한 수치 확인을 넘어서, 사용자가 상황에 맞는 구체적인 행동을 쉽게 선택하고 실행할 수 있도록 도와줍니다.

### 🌟 서비스 특징

- **3D 인터랙티브 하우스**: Spline을 활용한 3D 가상 공간에서 실제 생활 공간과 유사한 환경을 제공하며, 실내 요소들(창문, 공기청정기, 가구 등)을 클릭하여 해당 상황에 맞는 행동 방안을 확인할 수 있습니다.
- **개인화된 정보 제공**: 사용자의 건강 상태, 연령대, 자녀 유무, 반려동물 보유 여부 등 프로필 정보를 기반으로 맞춤형 행동 가이드를 제공합니다.
- **대기질 모니터링**: 현재 위치 기반의 미세먼지(PM10, PM2.5) 농도를 제공하며, 상황에 맞는 대응 방안을 제시합니다.
- **직접 행동으로 이어지는 기능**: 행동 방안 모달에서 필요한 제품 구매 링크, 관련 정보 사이트(질병관리청, 대한천식알레르기학회 등)로 직접 이동할 수 있어 실용성을 높였습니다.
- **PWA 및 알림 기능**: Service Worker를 활용한 백그라운드 알림으로 사용자에게 지속적인 건강 관리를 유도합니다.

### 🎯 주요 기능

#### 구현 완료 ✅

- **3D 인터랙티브 하우스**: Spline으로 제작된 3D 하우스 환경에서 11개 상호작용 객체 제공
  - 창문, 청소기, 냉장고, 공기청정기, 출입문, 싱크대, 가스레인지, 소파, 조명, 반려식물, 반려견
- **맞춤형 행동 가이드**: 미세먼지 수준과 사용자 프로필을 기반으로 한 개인화된 행동 방안 제시
- **스마트 설명 분류**: 행동 방안의 설명을 4가지 유형(목적/효과, 근거, 원리, 주의)으로 자동 분류하여 사용자가 이해하기 쉽게 표시
- **외부 링크 연동**: 행동 방안에서 필요한 제품 구매 링크 및 공식 정보 사이트 링크 제공
- **프로필 기반 개인화**: 건강 상태, 연령대, 자녀, 반려동물 정보를 반영한 맞춤형 조언
- **전체 행동 방안 보기**: Dashboard에서 모든 행동 방안을 카테고리별로 한눈에 확인 가능
- **미세먼지 데이터**: 위치 기반 PM10, PM2.5 농도 및 등급 표시
- **반응형 디자인**: 데스크톱, 태블릿, 모바일 모든 기기에서 최적화된 사용자 경험
- **Service Worker 알림**: 브라우저를 닫은 후에도 백그라운드에서 알림을 통해 사용자에게 미션을 상기시킴
- **프로필 관리**: 사용자 정보를 localStorage에 저장하여 지속적인 개인화 서비스 제공

### 사용 방법

1. **프로필 설정**: 우측 상단 프로필 아이콘을 클릭하여 건강 상태, 연령대, 자녀 유무, 반려동물 보유 여부 등을 설정합니다.
2. **3D 하우스 탐색**: 메인 화면의 3D 하우스에서 객체를 클릭하여 해당 상황에 맞는 행동 방안을 확인합니다.
3. **미세먼지 정보 확인**: 좌측 사이드바에서 현재 위치의 미세먼지 농도와 등급을 확인합니다.
4. **행동 방안 확인**: 3D 하우스에서 객체를 클릭하거나 Dashboard의 전체 행동 방안 보기를 확인합니다.

## 🛠️ 기술 스택

### 주요 구현 언어 및 프레임워크

- **TypeScript** - 타입 안전성을 통한 안정적인 개발 및 런타임 에러 방지
- **React 19** - 컴포넌트 기반 사용자 인터페이스 구축
- **Vite** - 빠른 개발 서버 및 최적화된 빌드 도구
- **CSS3** - 반응형 레이아웃 및 모던 UI 스타일링

### Frontend 라이브러리 및 도구

- **Spline (@splinetool/react-spline)** - 3D 인터랙티브 하우스 구현
- **Three.js** - 3D 그래픽스 라이브러리
- **@react-three/fiber** - React용 Three.js 렌더러
- **@react-three/drei** - Three.js 유틸리티 헬퍼
- **react-responsive** - 반응형 디자인을 위한 미디어 쿼리 훅
- **xlsx** - Excel 파일 처리 (대기질 데이터 import)
- **Feature-Sliced Design (FSD)** - 확장 가능한 아키텍처 패턴

### API 및 데이터 소스

- **한국환경공단 대기질 공공데이터 API** - 실시간 미세먼지 데이터 조회
- **에어코리아 제공 미세먼지 데이터 xlsx 파일** - API 서버 불안정할 경우 대체용
- **Kakao Maps API** - 위치 기반 주소 변환

## 💡 기술 스택 선택 이유

이 프로젝트는 순수 HTML, CSS, JavaScript 대신 **React**, **TypeScript**, **Vercel**을 선택했습니다. 각 기술 선택의 이유와 장점은 다음과 같습니다.

### 🎯 React 선택 이유

#### 순수 HTML/CSS/JS의 한계
- **상태 관리의 복잡성**: 프로필 정보, 미세먼지 데이터, 모달 상태 등 여러 상태를 전역적으로 관리하기 어려움
- **DOM 조작의 비효율성**: 3D 하우스 인터랙션, 동적 모달 표시 등 복잡한 UI 업데이트 시 직접 DOM 조작이 필요
- **코드 재사용성 부족**: 비슷한 UI 패턴(모달, 카드 등)을 반복적으로 작성해야 함
- **컴포넌트 간 통신 어려움**: 부모-자식 컴포넌트 간 데이터 전달이 복잡하고 에러 발생 가능성 높음

#### React의 장점
- **컴포넌트 기반 아키텍처**: 재사용 가능한 컴포넌트로 코드 중복 최소화
  - `BehavioralModal`, `ProfileModal`, `DustInfo` 등 독립적인 컴포넌트로 분리
  - Feature-Sliced Design(FSD) 아키텍처와 완벽하게 호환
- **선언적 UI**: 상태 변경 시 자동으로 UI 업데이트 (Virtual DOM)
  - 3D 하우스 객체 클릭 시 모달 표시 로직이 간단하고 직관적
- **강력한 생태계**: Spline, Three.js 등 3D 라이브러리와의 통합이 용이
  - `@splinetool/react-spline`으로 React 컴포넌트처럼 3D 하우스 사용
- **상태 관리**: React Hooks를 통한 효율적인 상태 관리
  - `useState`, `useEffect`로 프로필 정보, 미세먼지 데이터 관리
- **개발자 경험**: Hot Module Replacement(HMR)로 빠른 개발 피드백

### 🔷 TypeScript 선택 이유

#### 순수 JavaScript의 한계
- **런타임 에러**: 타입 체크가 없어 실행 중에만 에러 발견
  - API 응답 데이터 구조가 예상과 다를 때 런타임에만 에러 발생
  - 프로필 데이터의 잘못된 타입으로 인한 버그
- **코드 가독성**: 함수의 파라미터와 반환값을 명확히 알기 어려움
- **리팩토링 어려움**: 변수명이나 함수명 변경 시 모든 사용처를 수동으로 확인해야 함
- **자동완성 부족**: IDE가 코드의 의도를 파악하지 못해 자동완성 지원이 약함

#### TypeScript의 장점
- **타입 안전성**: 컴파일 타임에 타입 에러 발견
  ```typescript
  // 예시: 프로필 타입 정의로 안전한 데이터 관리
  interface Profile {
    name: string;
    ageGroup: 'child' | 'adult' | 'senior';
    hasChildren: boolean;
    hasPet: boolean;
  }
  ```
- **자동완성 및 IntelliSense**: IDE가 정확한 타입 정보를 제공하여 개발 속도 향상
- **리팩토링 안정성**: 타입 시스템이 변경사항의 영향을 자동으로 추적
- **문서화 효과**: 타입 정의 자체가 코드 문서 역할
- **대규모 프로젝트 적합**: Feature-Sliced Design과 같은 복잡한 아키텍처에서 타입 시스템이 필수적

### 🚀 Vercel 배포 선택 이유

#### 전통적인 배포 방식의 한계
- **수동 배포 과정**: FTP 업로드, 서버 설정, 빌드 과정을 수동으로 수행
- **빌드 환경 관리**: 로컬과 서버 환경 차이로 인한 배포 실패 가능성
- **CDN 설정**: 전 세계 사용자를 위한 CDN 구성을 별도로 설정해야 함
- **HTTPS 설정**: SSL 인증서 발급 및 갱신을 수동으로 관리
- **롤백 어려움**: 배포 후 문제 발생 시 이전 버전으로 되돌리기 복잡

#### Vercel의 장점
- **자동 배포**: GitHub 푸시 시 자동으로 빌드 및 배포
  - `git push`만으로 즉시 프로덕션 배포
  - Pull Request마다 프리뷰 배포 생성
- **최적화된 빌드**: Vite 기반 프로젝트를 자동으로 감지하고 최적화
  - 코드 스플리팅, 압축, 최신 JavaScript 변환 자동 처리
- **글로벌 CDN**: 전 세계 엣지 서버에 자동 배포로 빠른 로딩 속도
- **HTTPS 자동 설정**: 무료 SSL 인증서 자동 발급 및 갱신
- **환경 변수 관리**: 대시보드에서 API 키 등 환경 변수 안전하게 관리
- **서버리스 함수 지원**: 필요 시 API 엔드포인트 추가 가능
- **롤백 기능**: 한 번의 클릭으로 이전 배포로 즉시 롤백
- **무료 플랜**: 개인 프로젝트에 충분한 무료 플랜 제공

### 📊 종합 비교

| 항목 | HTML/CSS/JS | React + TypeScript + Vercel |
|------|------------|----------------------------|
| **개발 속도** | 느림 (수동 DOM 조작) | 빠름 (컴포넌트 재사용) |
| **코드 유지보수** | 어려움 (전역 상태 관리) | 쉬움 (모듈화된 구조) |
| **타입 안전성** | 없음 (런타임 에러) | 있음 (컴파일 타임 체크) |
| **배포 과정** | 수동 (FTP, 서버 설정) | 자동 (Git 푸시만) |
| **성능 최적화** | 수동 설정 필요 | 자동 최적화 |
| **확장성** | 제한적 | 우수 (FSD 아키텍처) |
| **개발자 경험** | 기본적 | 우수 (HMR, 자동완성) |

### 🎯 프로젝트 특성에 맞는 선택

이 프로젝트는 다음과 같은 특성으로 인해 React + TypeScript + Vercel이 필수적입니다:

1. **복잡한 상태 관리**: 프로필 정보, 미세먼지 데이터, 3D 하우스 인터랙션 등 다수의 상태를 효율적으로 관리
2. **3D 라이브러리 통합**: Spline, Three.js 등 React 생태계와의 통합 필요
3. **컴포넌트 재사용**: 모달, 카드, 버튼 등 반복되는 UI 패턴
4. **타입 안전성**: API 응답, 프로필 데이터 등 복잡한 데이터 구조의 타입 보장
5. **빠른 배포**: 지속적인 기능 추가 및 업데이트를 위한 자동 배포 파이프라인

### 3D 인터랙티브 하우스 - Spline 소개

FineDustProject는 **Spline**을 활용하여 3D 인터랙티브 하우스를 구현했습니다.

#### Spline이란?

Spline은 웹 브라우저에서 실시간으로 렌더링되는 3D 콘텐츠를 쉽게 제작할 수 있는 클라우드 기반 3D 디자인 도구입니다. 복잡한 3D 프로그래밍 지식 없이도 인터랙티브한 3D 경험을 웹 애플리케이션에 통합할 수 있습니다.

#### Spline 사용 이유

1. **직관적인 3D 제작**: 코드 없이 3D 모델링과 애니메이션을 제작할 수 있어 디자이너와 개발자 간 협업이 용이합니다.
2. **웹 최적화**: 자동으로 웹에서 최적의 성능을 제공하는 경량화된 런타임을 제공합니다.
3. **실시간 상호작용**: 객체 클릭, 변수 변경 등 실시간 이벤트를 JavaScript로 쉽게 제어할 수 있습니다.
4. **반응형**: 다양한 디바이스와 화면 크기에 대응하는 반응형 렌더링을 지원합니다.

#### FineDustProject에서의 활용

- **3D 하우스 환경**: 실제 생활 공간과 유사한 3D 가상 공간을 제공하여 사용자가 친숙하게 정보를 탐색할 수 있습니다.
- **객체 클릭 인터랙션**: 11개의 상호작용 가능한 객체(창문, 공기청정기, 가구 등)를 클릭하면 해당 상황에 맞는 행동 방안 모달이 표시됩니다.
- **사용자 조작**: WASD 키로 이동, 방향키로 화면 회전 등 자유로운 시점 조작이 가능합니다.

#### 기술적 구현

```typescript
// Spline 컴포넌트 통합
import Spline from '@splinetool/react-spline'
import type { Application } from '@splinetool/runtime'

// Spline 변수 감지 및 이벤트 처리
const value = splineApp.getVariable('nowObject')
// 객체 클릭 시 맞춤형 행동 방안 모달 표시
```

## 🏗️ 프로젝트 구조

이 프로젝트는 **Feature-Sliced Design (FSD)** 아키텍처를 따릅니다:

```
FineDustProject/
├── public/
│   ├── data/              # 대기질 데이터 파일들
│   │   ├── air-quality.json
│   │   ├── stations_with_coords.json
│   │   └── *.xlsx         # Excel 데이터 파일
│   └── sw.js              # Service Worker 스크립트
├── scripts/
│   ├── fetchAirQuality.mjs      # 대기질 데이터 가져오기
│   └── importAirQualityFromXlsx.mjs  # Excel 데이터 import
├── src/
│   ├── app/               # 애플리케이션 설정 및 프로바이더
│   │   ├── App.tsx        # 루트 컴포넌트
│   │   └── App.css        # App 스타일
│   ├── pages/             # 페이지 컴포넌트들 (ui/model 구조)
│   │   ├── Dashboard/
│   │   │   ├── ui/
│   │   │   │   ├── Dashboard.tsx  # 메인 대시보드 UI
│   │   │   │   └── Dashboard.css  # Dashboard 스타일
│   │   │   ├── model/
│   │   │   │   ├── types.ts        # 타입 정의
│   │   │   │   ├── constants.ts    # 상수
│   │   │   │   ├── hooks.ts        # 커스텀 훅
│   │   │   │   └── utils.ts        # 유틸리티 함수
│   │   │   └── index.ts            # Export
│   │   └── Profile/
│   │       ├── ui/
│   │       │   ├── Profile.tsx     # 프로필 설정 페이지 UI
│   │       │   └── Profile.css      # Profile 스타일
│   │       ├── model/
│   │       │   ├── types.ts        # 타입 정의
│   │       │   └── utils.ts        # 유틸리티 함수
│   │       └── index.ts            # Export
│   ├── widgets/           # 독립적인 UI 블록들 (ui/model 구조)
│   │   ├── House3D/
│   │   │   ├── ui/
│   │   │   │   ├── House3D.tsx     # 3D 하우스 UI
│   │   │   │   └── House3D.css     # House3D 스타일
│   │   │   ├── model/
│   │   │   │   ├── types.ts        # 타입 정의
│   │   │   │   ├── constants.ts    # 상수 (색상 맵, 객체 이름 등)
│   │   │   │   ├── hooks.ts        # 커스텀 훅 (useBehavioralModal)
│   │   │   │   └── utils.ts        # 유틸리티 함수 (색상 계산 등)
│   │   │   └── index.ts            # Export
│   │   ├── DustInfo/
│   │   │   ├── ui/
│   │   │   │   ├── DustInfo.tsx    # 미세먼지 정보 위젯 UI
│   │   │   │   └── DustInfo.css    # DustInfo 스타일
│   │   │   ├── model/
│   │   │   │   ├── types.ts        # 타입 정의
│   │   │   │   ├── constants.ts    # 상수 (등급 범례 등)
│   │   │   │   └── hooks.ts        # 커스텀 훅 (useDustGrades)
│   │   │   └── index.ts            # Export
│   │   └── ProfileInfo/
│   │       ├── ui/
│   │       │   ├── ProfileInfo.tsx # 프로필 정보 위젯 UI
│   │       │   └── ProfileInfo.css  # ProfileInfo 스타일
│   │       ├── model/
│   │       │   ├── types.ts        # 타입 정의
│   │       │   ├── utils.ts        # 유틸리티 함수 (getLabel)
│   │       │   └── hooks.ts        # 커스텀 훅 (useProfileItems)
│   │       └── index.ts            # Export
│   ├── components/        # 재사용 가능한 UI 컴포넌트들 (ui/model 구조)
│   │   ├── DashboardHeader/      # 대시보드 헤더 (날짜, 시간 표시)
│   │   ├── DashboardSidebar/     # 대시보드 사이드바 (프로필, 미세먼지 정보)
│   │   ├── Calendar/             # 캘린더 컴포넌트
│   │   ├── MissionList/          # 미션 목록 컴포넌트
│   │   ├── BehavioralModal/      # 행동 방안 모달
│   │   ├── DustMoodOverlay/      # 미세먼지 분위기 오버레이
│   │   ├── QuickBehavioralButton/ # 빠른 행동 방안 버튼
│   │   ├── MobileDustControls/   # 모바일 미세먼지 컨트롤
│   │   ├── ProfileHeader/        # 프로필 헤더
│   │   ├── ProfileModal/         # 프로필 모달
│   │   ├── ProfileNameEditor/    # 프로필 이름 편집기
│   │   ├── ProfileCategoryCard/  # 프로필 카테고리 카드
│   │   ├── ProfileCategoryList/  # 프로필 카테고리 목록
│   │   ├── ProfileCategoryModal/ # 프로필 카테고리 모달
│   │   └── SaveButton/           # 저장 버튼
│   │       # 각 컴포넌트는 ui/ (UI 컴포넌트)와 model/ (타입, 상수, 훅, 로직)로 분리
│   ├── features/          # 비즈니스 기능들
│   ├── entities/          # 비즈니스 엔티티들
│   ├── shared/            # 공통 요소들
│   │   ├── api/           # API 호출 함수들
│   │   │   └── dustApi.ts # 대기질 API 관련 함수
│   │   ├── styles/        # 전역 스타일
│   │   │   └── global.css
│   │   ├── types/         # TypeScript 타입 정의
│   │   │   ├── api.ts     # API 관련 타입
│   │   │   ├── profile.ts # 프로필 관련 타입
│   │   │   └── todo.ts    # Todo 관련 타입
│   │   ├── ui/            # 재사용 가능한 UI 컴포넌트들
│   │   │   ├── Toast.tsx  # 토스트 알림 컴포넌트
│   │   │   └── Toast.css
│   │   ├── utils/         # 유틸리티 함수들
│   │   │   ├── messageParser.ts  # 행동 방안 메시지 파싱 및 설명 유형 분류
│   │   │   └── notifications.ts  # 알림 관련 유틸리티
│   │   └── assets/
│   │       └── data/      # 정적 데이터 파일들
│   │           ├── behavioral_guidelines.json  # 행동 방안 데이터 (설명 포함)
│   │           ├── profileCategories.json
│   │           └── todoList.json
│   └── main.tsx           # 애플리케이션 진입점
├── package.json           # 프로젝트 의존성 및 스크립트
├── package-lock.json      # 의존성 잠금 파일
├── vite.config.ts         # Vite 설정 (경로 별칭 포함)
├── vercel.json            # Vercel 배포 설정
├── tsconfig.json          # TypeScript 설정
├── tsconfig.app.json      # 앱용 TypeScript 설정
├── tsconfig.node.json     # Node.js용 TypeScript 설정
├── eslint.config.js       # ESLint 설정
└── README.md
```

### FSD 아키텍처의 장점

- **계층화된 구조**: 각 레이어가 명확한 역할을 가짐
- **의존성 방향**: 상위 레이어는 하위 레이어만 참조 가능
- **확장성**: 새로운 기능 추가 시 적절한 레이어에 배치
- **재사용성**: shared 레이어의 컴포넌트들을 전체 프로젝트에서 활용

### 컴포넌트 구조 (ui/model 분리)

프로젝트의 모든 페이지, 위젯, 컴포넌트는 **ui/model 구조**로 분리되어 있습니다:

- **`ui/` 폴더**: 순수 UI 컴포넌트만 포함 (JSX, 이벤트 핸들러)
- **`model/` 폴더**: 비즈니스 로직, 타입, 상수, 커스텀 훅 분리
  - `types.ts`: 타입 정의
  - `constants.ts`: 상수 정의 (필요한 경우)
  - `hooks.ts`: 커스텀 훅 (필요한 경우)
  - `utils.ts`: 유틸리티 함수 (필요한 경우)
- **`index.ts`**: 깔끔한 export를 위한 진입점
- **CSS 파일**: 각 컴포넌트의 `ui/` 폴더에 위치

이 구조를 통해 **관심사의 분리**를 명확히 하고, **재사용성**과 **유지보수성**을 향상시킵니다.

### 주요 컴포넌트 설명

#### Pages
- **Dashboard**: 메인 대시보드 페이지 (3D 하우스, 미세먼지 정보, 미션 목록 등)
- **Profile**: 사용자 프로필 설정 페이지 (건강 상태, 연령대, 자녀, 반려동물 등)

#### Widgets
- **House3D**: Spline 기반 3D 인터랙티브 하우스 위젯
- **DustInfo**: 미세먼지 농도 및 등급 정보 위젯
- **ProfileInfo**: 사용자 프로필 정보 요약 위젯

#### 주요 Components
- **BehavioralModal**: 행동 방안 상세 정보를 표시하는 모달
- **MissionList**: 미션 목록 표시
- **DashboardSidebar**: 프로필 및 미세먼지 정보 사이드바

## 🚀 배포 (Vercel)

이 프로젝트는 Vercel을 통해 배포됩니다.

### 자동 배포 설정

GitHub 저장소와 Vercel을 연결하면 자동 배포가 설정됩니다:

1. [Vercel 대시보드](https://vercel.com/dashboard)에 접속
2. "New Project" 클릭
3. GitHub 저장소 선택
4. 빌드 설정 확인:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. 환경 변수 설정:
   - `SERVICE_KEY`: 공공데이터포털 API 키
6. "Deploy" 클릭

## 🔧 개발 가이드

### 경로 별칭

프로젝트에서는 `@` 별칭을 사용하여 깔끔한 import 경로를 제공합니다:

```typescript
// ❌ 상대 경로
import { Button } from '../../../shared/ui/Button'

// ✅ 절대 경로 (별칭 사용)
import { Button } from '@/shared/ui/Button'
```

경로 별칭은 `vite.config.ts`에서 설정되어 있습니다.

### 행동 방안 메시지 파싱

행동 방안 메시지는 `messageParser.ts` 유틸리티를 통해 파싱됩니다:

- **메시지 파싱**: `parseMessage()` 함수가 행동 방안 텍스트를 action과 explanation으로 분리
- **설명 유형 감지**: `detectExplanationType()` 함수가 키워드 기반으로 설명 유형 자동 분류
- **링크 처리**: 구매 링크, 정보 링크(질병관리청, 대한천식알레르기학회) 자동 인식 및 처리
- **사용 위치**: `House3D` 모달, `Dashboard` 전체보기 모달에서 사용

### Service Worker 및 알림 기능

이 프로젝트는 Service Worker를 활용하여 백그라운드 알림을 제공합니다:

- **Service Worker 등록**: `src/shared/utils/notifications.ts`에서 처리
- **알림 스케줄링**: 브라우저를 닫은 후 10초 뒤 알림 표시
- **Service Worker 파일**: `public/sw.js`

알림 기능을 사용하려면 브라우저에서 알림 권한을 허용해야 합니다.

## 📊 데이터 소스

### 대기질 데이터

- **한국환경공단 대기질 공공데이터**
  - 실시간 미세먼지(PM10, PM2.5) 농도 데이터
  - 측정소별 데이터 조회
  - 스크립트를 통해 주기적으로 데이터 업데이트 가능

- **에어코리아 Excel 데이터**
  - API 서버 불안정 시 대체용 데이터
  - `public/data/` 폴더에 월별 Excel 파일 저장
  - `scripts/importAirQualityFromXlsx.mjs` 스크립트로 JSON 변환

### 건강 정보 소스 (행동 방안 작성시 참고)

- **질병관리청**: 호흡기 질환 예방 행동 지침 및 공식 정보 링크 제공
- **대한천식알레르기학회**: 천식 및 알레르기 환자를 위한 전문 가이드라인 링크 제공
- **각종 논문 탐색**: 미세먼지 취약 계층, 카테고리별 관련 논문 탐색

### 데이터 파일 구조

- **`behavioral_guidelines.json`**: 행동 방안 가이드라인 데이터
  - 미세먼지 등급별(baseMessages) 및 프로필 조건별(conditionalMessages) 행동 방안
  - 카테고리: window, dog, mask, exercise, cleaning, air_purifier 등
- **`profileCategories.json`**: 프로필 카테고리 정의
- **`todoList.json`**: Todo 목록 데이터
- **`air-quality.json`**: 대기질 데이터 (API 또는 Excel에서 생성)
- **`stations_with_coords.json`**: 측정소 좌표 정보

## 🎨 행동 방안 설명 분류 시스템

### 4가지 설명 유형

행동 방안의 괄호 안 설명은 자동으로 4가지 유형으로 분류되어 표시됩니다:

1. **목적/효과** (`purpose`)
   - 표시 텍스트: "왜 해야 하나요? 하면 무엇이 좋나요?"
   - 색상: 파란색 (#2563eb)
   - 기본 유형으로, 행동의 목적과 효과를 설명

2. **근거** (`evidence`)
   - 표시 텍스트: "왜 해야 하나요?"
   - 색상: 초록색 (#16a34a)
   - 과학적 근거나 권장 사항을 포함하는 설명

3. **원리** (`mechanism`)
   - 표시 텍스트: "왜 해야 하나요?"
   - 색상: 주황색 (#d97706)
   - 작동 메커니즘이나 물리적 원리를 설명

4. **주의** (`warning`)
   - 표시 텍스트: "반드시 지켜야 하는 이유!"
   - 색상: 빨간색 (#dc2626)
   - 위험, 부작용, 금지 사항 등 중요한 주의사항

### 자동 분류 로직

`messageParser.ts`의 `detectExplanationType` 함수가 키워드를 기반으로 설명 유형을 자동 감지합니다:

- **Priority 1 (근거)**: "근거", "권장됨", "초래할 수 있음", "유발함", "악화", "저하", "감소", "증가" 등
- **Priority 2 (주의)**: "위험", "부작용", "피하세요", "금지", "치명적", "재비산", "가능", "수 있음" 등
- **Priority 3 (원리)**: "씻어내", "제거", "배출", "순환", "보조", "기여", "작동", "메커니즘" 등
- **기본값 (목적/효과)**: 위 키워드가 없는 경우, 또는 "왜 해야 하는가", "경우", "때" 등 포함

### UI 표시 방식

- 행동 방안 텍스트 바로 아래에 설명 유형 라벨이 표시됩니다
- 라벨에는 해당 유형의 색상이 적용됩니다
- 설명 텍스트는 라벨 아래에 회색(#475569)으로 표시됩니다
- 3D 하우스 모달과 Dashboard 전체보기 모달 모두 동일한 방식으로 표시됩니다

## 🔔 알림 기능

### Service Worker 기반 백그라운드 알림

이 프로젝트는 Service Worker를 활용하여 브라우저를 닫은 후에도 알림을 표시할 수 있습니다:

1. **알림 권한 요청**: 사용자가 처음 접속할 때 알림 권한을 요청합니다.
2. **Service Worker 등록**: 백그라운드에서 알림을 처리하기 위해 Service Worker를 등록합니다.
3. **알림 스케줄링**: 사용자가 브라우저를 닫을 때 미션 정보를 Service Worker에 전달하고, 10초 후 알림을 표시합니다.

### 알림 동작 방식

- 사용자가 3D 하우스에서 객체를 클릭하여 미션을 선택
- 브라우저를 닫을 때 `beforeunload` 이벤트로 미션 정보를 Service Worker에 전달
- Service Worker가 10초 후 백그라운드에서 알림 표시
- 알림 클릭 시 서비스로 다시 접속 유도

---

**FineDustProject** - 깨끗한 공기, 건강한 생활을 위한 첫 걸음 🌱
