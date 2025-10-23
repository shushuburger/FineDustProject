# FineDustProject 🌫️

미세먼지로부터 건강을 지키기 위한 실용적인 행동 방안을 제공하는 웹 애플리케이션입니다.

## 📋 프로젝트 개요

FineDustProject는 미세먼지로부터 건강을 지키기 위한 **실용적인 행동 방안**을 제공하는 서비스입니다. 단순한 수치 확인을 넘어서, 사용자가 상황에 맞는 구체적인 행동을 쉽게 선택하고 실행할 수 있도록 도와줍니다.

### 🎯 주요 기능 (예정)

- **맞춤형 행동 가이드**: 현재 미세먼지 상황에 따른 개인화된 행동 방안 제시
- **실행 가능한 체크리스트**: 마스크 착용, 외출 제한, 공기청정기 가동 등 구체적인 행동 목록
- **건강 관리 도구**: 미세먼지 노출 시간 추적 및 건강 상태 기록
- **스마트 알림**: 행동이 필요한 시점에 맞춤형 알림 제공
- **생활 패턴 최적화**: 개인 일정과 미세먼지 예보를 연계한 최적 외출 시간 추천

## 🛠️ 기술 스택

### Frontend
- **React 18** - 사용자 인터페이스 구축
- **TypeScript** - 타입 안전성 및 개발 생산성 향상
- **Vite** - 빠른 개발 서버 및 빌드 도구
- **Feature-Sliced Design (FSD)** - 확장 가능한 아키텍처 패턴

## 🏗️ 프로젝트 구조

이 프로젝트는 **Feature-Sliced Design (FSD)** 아키텍처를 따릅니다:

```
src/
├── app/           # 애플리케이션 설정 및 프로바이더
├── pages/         # 페이지 컴포넌트들
├── widgets/       # 독립적인 UI 블록들
├── features/      # 비즈니스 기능들
├── entities/      # 비즈니스 엔티티들
└── shared/        # 공통 요소들
    ├── styles/    # 전역 스타일
    ├── lib/       # 유틸리티 함수들
    └── ui/        # 재사용 가능한 UI 컴포넌트들
```

### FSD 아키텍처의 장점

- **계층화된 구조**: 각 레이어가 명확한 역할을 가짐
- **의존성 방향**: 상위 레이어는 하위 레이어만 참조 가능
- **확장성**: 새로운 기능 추가 시 적절한 레이어에 배치
- **재사용성**: shared 레이어의 컴포넌트들을 전체 프로젝트에서 활용

## 🚀 개발 환경 설정

### 필수 요구사항
- Node.js 18.0.0 이상
- npm 또는 yarn

### 설치 및 실행

1. **저장소 클론**
   ```bash
   git clone <repository-url>
   cd FineDustProject
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **개발 서버 실행**
   ```bash
   npm run dev
   ```

4. **브라우저에서 확인**
   - http://localhost:5173 에서 애플리케이션 확인

### 빌드

```bash
npm run build
```

## 🚀 배포 (Vercel)

이 프로젝트는 Vercel을 통해 배포됩니다.

### Vercel CLI를 사용한 배포

1. **Vercel CLI 설치**
   ```bash
   npm i -g vercel
   ```

2. **Vercel 로그인**
   ```bash
   vercel login
   ```

3. **프로젝트 배포**
   ```bash
   # 개발 환경 배포
   vercel
   
   # 프로덕션 배포
   npm run deploy
   ```

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
5. "Deploy" 클릭

이제 `main` 브랜치에 푸시할 때마다 자동으로 배포됩니다.

## 🔧 개발 가이드

### 경로 별칭
프로젝트에서는 `@` 별칭을 사용하여 깔끔한 import 경로를 제공합니다:

```typescript
// ❌ 상대 경로
import { Button } from '../../../shared/ui/Button'

// ✅ 절대 경로 (별칭 사용)
import { Button } from '@/shared/ui/Button'
```

## 📊 데이터 소스 (예정)

이 프로젝트는 다음 공공데이터를 활용하여 맞춤형 행동 방안을 제공합니다:

- **한국환경공단 대기오염정보**: 실시간 미세먼지 농도 데이터
- **기상청 대기질 예보**: 미세먼지 예보 정보
- **건강보험심사평가원**: 미세먼지 관련 건강 관리 가이드라인
- **질병관리청**: 호흡기 질환 예방 행동 지침

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 새로운 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

---

**FineDustProject** - 깨끗한 공기, 건강한 생활을 위한 첫 걸음 🌱