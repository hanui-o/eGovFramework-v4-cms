# GS인증 CMS 기술 문서

> **문서 버전**: v1.0 (연습용)
> **목표 버전**: eGovFramework v5 기반
> **인증 목표**: GS 2등급

---

## 1. 제품 개요

### 1.1 제품명
**odada CMS** (가칭)

### 1.2 제품 설명
전자정부 표준프레임워크 기반의 콘텐츠 관리 시스템(CMS)으로, 공공기관 및 기업의 웹사이트 구축·운영을 위한 통합 솔루션

### 1.3 기술 스택

| 구분 | 기술 | 버전 |
|------|------|------|
| **Backend** | eGovFramework | v5.x (예정) |
| **Backend** | Spring Boot | 3.x |
| **Backend** | Java | 17+ |
| **Backend** | MyBatis | 3.x |
| **Database** | MySQL / MariaDB / PostgreSQL | - |
| **Frontend (Public)** | Next.js + TypeScript | 15.x |
| **Frontend (Admin)** | React + Vite + TypeScript | 19.x |
| **UI Library** | HANUI (KRDS 기반) | latest |

---

## 2. 시스템 아키텍처

### 2.1 전체 구조

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
├─────────────────────────────┬───────────────────────────────┤
│   frontend-public (3000)    │   frontend-admin (3001)       │
│   Next.js + HANUI           │   React + Vite + HANUI        │
│   - 사용자 웹사이트          │   - 관리자 대시보드            │
└─────────────────────────────┴───────────────────────────────┘
                              │
                              ▼ REST API (JSON)
┌─────────────────────────────────────────────────────────────┐
│                       Backend (8080)                         │
│                    eGovFramework v5                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Controller  │  │   Service   │  │     DAO     │         │
│  │   (API)     │→ │   (Impl)    │→ │  (MyBatis)  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│         │                │                │                  │
│         ▼                ▼                ▼                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │     DTO     │  │   Domain    │  │     VO      │         │
│  │ (Req/Res)   │  │   (Model)   │  │  (Query)    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
├─────────────────────────────────────────────────────────────┤
│  Security: JWT + Spring Security                             │
│  Logging: SLF4J + Logback                                    │
│  Validation: Bean Validation (JSR-380)                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Database Layer                          │
│              MySQL / MariaDB / PostgreSQL                    │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 패키지 구조

```
backend/src/main/java/egovframework/
├── com/                          # 공통 컴포넌트
│   ├── cmm/                      # 공통 모듈
│   │   ├── config/               # 설정
│   │   ├── exception/            # 예외 처리
│   │   └── util/                 # 유틸리티
│   ├── jwt/                      # JWT 인증
│   └── security/                 # Spring Security
│
└── let/                          # 업무 기능
    ├── uat/                      # 사용자 인증 (User Authentication)
    │   └── uia/                  # 로그인/로그아웃
    ├── uss/                      # 사용자 서비스 (User Service)
    │   └── umt/                  # 회원 관리
    ├── cop/                      # 협업 (Cooperation)
    │   ├── bbs/                  # 게시판
    │   └── smt/                  # 일정 관리
    ├── cms/                      # 콘텐츠 관리 [신규]
    │   ├── mnu/                  # 메뉴 관리
    │   ├── cnt/                  # 콘텐츠 관리
    │   ├── bnr/                  # 배너 관리
    │   └── pop/                  # 팝업 관리
    └── sts/                      # 통계 [신규]
        └── vst/                  # 방문자 통계
```

---

## 3. 기능 명세

### 3.1 기능 목록

#### 3.1.1 필수 기능 (GS인증 필수)

| No | 대분류 | 중분류 | 기능명 | 상태 |
|----|--------|--------|--------|------|
| 1 | 회원 | 인증 | 로그인/로그아웃 | ✅ 완료 |
| 2 | 회원 | 인증 | 회원가입 | ✅ 완료 |
| 3 | 회원 | 인증 | 비밀번호 찾기 | ✅ 완료 |
| 4 | 회원 | 마이페이지 | 내 정보 조회/수정 | ✅ 완료 |
| 5 | 게시판 | 공지사항 | 목록/상세/등록/수정/삭제 | ✅ 완료 |
| 6 | 게시판 | 자료실 | 파일 첨부 게시판 | ✅ 완료 |
| 7 | 게시판 | Q&A | 답변형 게시판 | ✅ 완료 |
| 8 | 게시판 | 갤러리 | 이미지 게시판 | ✅ 완료 |
| 9 | 관리자 | 회원관리 | 회원 목록/상세/수정/삭제 | ✅ 완료 |
| 10 | 관리자 | 게시판관리 | 게시판 생성/설정 | ✅ 완료 |
| 11 | 관리자 | 권한관리 | 역할/권한 설정 | ⬜ 개발필요 |

#### 3.1.2 권장 기능 (입찰 경쟁력)

| No | 대분류 | 중분류 | 기능명 | 상태 |
|----|--------|--------|--------|------|
| 12 | CMS | 메뉴관리 | 메뉴 CRUD, 순서변경, 트리구조 | ⬜ 개발필요 |
| 13 | CMS | 콘텐츠관리 | 페이지 CRUD, WYSIWYG 에디터 | ⬜ 개발필요 |
| 14 | CMS | 배너관리 | 메인배너 CRUD, 노출기간 설정 | ⬜ 개발필요 |
| 15 | CMS | 팝업관리 | 레이어팝업, 오늘하루보지않기 | ⬜ 개발필요 |
| 16 | 통계 | 방문자 | 일별/월별 방문자 통계 | ⬜ 개발필요 |
| 17 | 통계 | 게시물 | 게시판별 등록 통계 | ⬜ 개발필요 |

#### 3.1.3 선택 기능 (차별화)

| No | 대분류 | 기능명 | 비고 |
|----|--------|--------|------|
| 18 | 알림 | SMS/이메일 발송 | 외부 API 연동 |
| 19 | 설문 | 설문조사 | 객관식/주관식 |
| 20 | 만족도 | 만족도 조사 | 5점 척도 |
| 21 | 연동 | SSO | 행정망 연동 |
| 22 | 연동 | 공공데이터 API | 공공데이터포털 |

---

### 3.2 API 명세

#### 3.2.1 인증 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/v1/auth/login` | 로그인 |
| POST | `/api/v1/auth/logout` | 로그아웃 |
| POST | `/api/v1/auth/refresh` | 토큰 갱신 |
| POST | `/api/v1/auth/signup` | 회원가입 |

#### 3.2.2 회원 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/v1/members` | 회원 목록 |
| GET | `/api/v1/members/{id}` | 회원 상세 |
| PUT | `/api/v1/members/{id}` | 회원 수정 |
| DELETE | `/api/v1/members/{id}` | 회원 삭제 |

#### 3.2.3 게시판 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/v1/boards` | 게시판 목록 |
| GET | `/api/v1/boards/{bbsId}/articles` | 게시물 목록 |
| GET | `/api/v1/boards/{bbsId}/articles/{nttId}` | 게시물 상세 |
| POST | `/api/v1/boards/{bbsId}/articles` | 게시물 등록 |
| PUT | `/api/v1/boards/{bbsId}/articles/{nttId}` | 게시물 수정 |
| DELETE | `/api/v1/boards/{bbsId}/articles/{nttId}` | 게시물 삭제 |

#### 3.2.4 CMS API (신규)

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/v1/cms/menus` | 메뉴 목록 (트리) |
| POST | `/api/v1/cms/menus` | 메뉴 등록 |
| PUT | `/api/v1/cms/menus/{id}` | 메뉴 수정 |
| PUT | `/api/v1/cms/menus/order` | 메뉴 순서 변경 |
| DELETE | `/api/v1/cms/menus/{id}` | 메뉴 삭제 |
| GET | `/api/v1/cms/contents` | 콘텐츠 목록 |
| GET | `/api/v1/cms/contents/{id}` | 콘텐츠 상세 |
| POST | `/api/v1/cms/contents` | 콘텐츠 등록 |
| PUT | `/api/v1/cms/contents/{id}` | 콘텐츠 수정 |
| DELETE | `/api/v1/cms/contents/{id}` | 콘텐츠 삭제 |
| GET | `/api/v1/cms/banners` | 배너 목록 |
| POST | `/api/v1/cms/banners` | 배너 등록 |
| GET | `/api/v1/cms/popups` | 팝업 목록 |
| POST | `/api/v1/cms/popups` | 팝업 등록 |

---

## 4. 데이터베이스 설계

### 4.1 ERD (핵심 테이블)

```
┌─────────────────┐       ┌─────────────────┐
│   COMTNGNRLMBER │       │  COMTNBBS       │
│   (회원)        │       │  (게시판마스터)  │
├─────────────────┤       ├─────────────────┤
│ MBER_ID (PK)    │       │ BBS_ID (PK)     │
│ USER_ID         │       │ BBS_NM          │
│ PASSWORD        │       │ BBS_TY_CODE     │
│ MBER_NM         │       │ USE_AT          │
│ ...             │       │ ...             │
└─────────────────┘       └─────────────────┘
         │                        │
         │                        ▼
         │                ┌─────────────────┐
         │                │  COMTNBBS_ATCH  │
         │                │  (게시물)        │
         │                ├─────────────────┤
         └───────────────▶│ NTT_ID (PK)     │
                          │ BBS_ID (FK)     │
                          │ FRST_REGIST_ID  │
                          │ NTT_SJ (제목)    │
                          │ NTT_CN (내용)    │
                          │ ...             │
                          └─────────────────┘

[신규 테이블]

┌─────────────────┐       ┌─────────────────┐
│  CMS_MENU       │       │  CMS_CONTENT    │
│  (메뉴)         │       │  (콘텐츠)       │
├─────────────────┤       ├─────────────────┤
│ MENU_ID (PK)    │──────▶│ CONTENT_ID (PK) │
│ PARENT_ID (FK)  │       │ MENU_ID (FK)    │
│ MENU_NM         │       │ CONTENT_TITLE   │
│ MENU_URL        │       │ CONTENT_HTML    │
│ SORT_ORDER      │       │ USE_AT          │
│ MENU_DEPTH      │       │ ...             │
│ USE_AT          │       └─────────────────┘
└─────────────────┘

┌─────────────────┐       ┌─────────────────┐
│  CMS_BANNER     │       │  CMS_POPUP      │
│  (배너)         │       │  (팝업)         │
├─────────────────┤       ├─────────────────┤
│ BANNER_ID (PK)  │       │ POPUP_ID (PK)   │
│ BANNER_NM       │       │ POPUP_NM        │
│ BANNER_IMG      │       │ POPUP_CONTENT   │
│ LINK_URL        │       │ START_DATE      │
│ START_DATE      │       │ END_DATE        │
│ END_DATE        │       │ POPUP_WIDTH     │
│ SORT_ORDER      │       │ POPUP_HEIGHT    │
│ USE_AT          │       │ USE_AT          │
└─────────────────┘       └─────────────────┘
```

### 4.2 신규 테이블 DDL

```sql
-- 메뉴 테이블
CREATE TABLE CMS_MENU (
    MENU_ID         VARCHAR(20)  PRIMARY KEY,
    PARENT_ID       VARCHAR(20)  NULL,
    MENU_NM         VARCHAR(100) NOT NULL,
    MENU_URL        VARCHAR(255) NULL,
    MENU_TYPE       VARCHAR(20)  DEFAULT 'LINK',  -- LINK, CONTENT, BOARD
    TARGET_ID       VARCHAR(20)  NULL,            -- 연결된 콘텐츠/게시판 ID
    SORT_ORDER      INT          DEFAULT 0,
    MENU_DEPTH      INT          DEFAULT 1,
    USE_AT          CHAR(1)      DEFAULT 'Y',
    FRST_REGISTER_ID VARCHAR(20) NOT NULL,
    FRST_REGIST_PNTTM DATETIME   NOT NULL,
    LAST_UPDUSR_ID  VARCHAR(20)  NULL,
    LAST_UPDT_PNTTM DATETIME     NULL,
    FOREIGN KEY (PARENT_ID) REFERENCES CMS_MENU(MENU_ID)
);

-- 콘텐츠 테이블
CREATE TABLE CMS_CONTENT (
    CONTENT_ID      VARCHAR(20)  PRIMARY KEY,
    MENU_ID         VARCHAR(20)  NULL,
    CONTENT_TITLE   VARCHAR(200) NOT NULL,
    CONTENT_HTML    LONGTEXT     NOT NULL,
    USE_AT          CHAR(1)      DEFAULT 'Y',
    FRST_REGISTER_ID VARCHAR(20) NOT NULL,
    FRST_REGIST_PNTTM DATETIME   NOT NULL,
    LAST_UPDUSR_ID  VARCHAR(20)  NULL,
    LAST_UPDT_PNTTM DATETIME     NULL,
    FOREIGN KEY (MENU_ID) REFERENCES CMS_MENU(MENU_ID)
);

-- 배너 테이블
CREATE TABLE CMS_BANNER (
    BANNER_ID       VARCHAR(20)  PRIMARY KEY,
    BANNER_NM       VARCHAR(100) NOT NULL,
    BANNER_IMG      VARCHAR(255) NOT NULL,
    LINK_URL        VARCHAR(255) NULL,
    LINK_TARGET     VARCHAR(20)  DEFAULT '_self',
    START_DATE      DATE         NOT NULL,
    END_DATE        DATE         NOT NULL,
    SORT_ORDER      INT          DEFAULT 0,
    USE_AT          CHAR(1)      DEFAULT 'Y',
    FRST_REGISTER_ID VARCHAR(20) NOT NULL,
    FRST_REGIST_PNTTM DATETIME   NOT NULL
);

-- 팝업 테이블
CREATE TABLE CMS_POPUP (
    POPUP_ID        VARCHAR(20)  PRIMARY KEY,
    POPUP_NM        VARCHAR(100) NOT NULL,
    POPUP_CONTENT   LONGTEXT     NOT NULL,
    START_DATE      DATE         NOT NULL,
    END_DATE        DATE         NOT NULL,
    POPUP_WIDTH     INT          DEFAULT 500,
    POPUP_HEIGHT    INT          DEFAULT 400,
    POPUP_LEFT      INT          DEFAULT 100,
    POPUP_TOP       INT          DEFAULT 100,
    TODAY_CLOSE_AT  CHAR(1)      DEFAULT 'Y',  -- 오늘하루보지않기
    USE_AT          CHAR(1)      DEFAULT 'Y',
    FRST_REGISTER_ID VARCHAR(20) NOT NULL,
    FRST_REGIST_PNTTM DATETIME   NOT NULL
);

-- 방문자 통계 테이블
CREATE TABLE STS_VISITOR (
    VISIT_ID        BIGINT       PRIMARY KEY AUTO_INCREMENT,
    VISIT_DATE      DATE         NOT NULL,
    VISIT_IP        VARCHAR(50)  NOT NULL,
    USER_AGENT      VARCHAR(500) NULL,
    REFERER         VARCHAR(500) NULL,
    VISIT_URL       VARCHAR(255) NULL,
    SESSION_ID      VARCHAR(100) NULL,
    MEMBER_ID       VARCHAR(20)  NULL,
    CREATED_AT      DATETIME     DEFAULT CURRENT_TIMESTAMP,
    INDEX IDX_VISIT_DATE (VISIT_DATE)
);
```

---

## 5. 보안 명세

### 5.1 인증/인가

| 항목 | 구현 방식 |
|------|----------|
| 인증 | JWT (Access Token + Refresh Token) |
| 세션 | Stateless (토큰 기반) |
| 권한 | Role 기반 (ADMIN, USER, GUEST) |
| 암호화 | BCrypt (비밀번호), AES-256 (민감정보) |

### 5.2 시큐어코딩 적용

| 취약점 | 대응 방안 |
|--------|----------|
| SQL Injection | PreparedStatement, MyBatis #{} |
| XSS | 입력값 이스케이프, CSP 헤더 |
| CSRF | CSRF Token, SameSite Cookie |
| 파일 업로드 | 확장자 화이트리스트, 저장 경로 분리 |
| 인증 우회 | Spring Security 필터 체인 |
| 민감정보 노출 | DTO 분리, @JsonIgnore |

### 5.3 OWASP Top 10 대응

| # | 취약점 | 상태 |
|---|--------|------|
| A01 | Broken Access Control | ✅ 대응 |
| A02 | Cryptographic Failures | ✅ 대응 |
| A03 | Injection | ✅ 대응 |
| A04 | Insecure Design | ✅ 대응 |
| A05 | Security Misconfiguration | ✅ 대응 |
| A06 | Vulnerable Components | ⚠️ 정기 점검 필요 |
| A07 | Auth Failures | ✅ 대응 |
| A08 | Data Integrity Failures | ✅ 대응 |
| A09 | Logging Failures | ✅ 대응 |
| A10 | SSRF | ✅ 대응 |

---

## 6. 품질 요구사항

### 6.1 성능 요구사항

| 항목 | 목표값 | 측정 방법 |
|------|--------|----------|
| 응답시간 | 평균 1초 이내 | JMeter |
| 동시접속 | 100명 이상 | JMeter |
| TPS | 50 TPS 이상 | JMeter |
| 가용성 | 99.5% 이상 | 모니터링 |

### 6.2 테스트 요구사항

| 테스트 유형 | 도구 | 커버리지 목표 |
|------------|------|--------------|
| 단위 테스트 | JUnit 5 | 70% 이상 |
| 통합 테스트 | Spring Test | 주요 API 100% |
| E2E 테스트 | Selenium/Playwright | 핵심 시나리오 |
| 부하 테스트 | JMeter | 성능 기준 충족 |
| 보안 테스트 | OWASP ZAP | 취약점 0건 |
| 정적 분석 | SonarQube | Major 이슈 0건 |

### 6.3 웹 접근성

| 항목 | 기준 | 비고 |
|------|------|------|
| 인증 | KWCAG 2.2 | 웹 접근성 품질인증마크 |
| 레벨 | AA | 공공기관 필수 |
| 검사 도구 | OpenWAX, KADO-WAH | |

---

## 7. 운영 환경

### 7.1 시스템 요구사항

| 구분 | 최소 사양 | 권장 사양 |
|------|----------|----------|
| CPU | 2 Core | 4 Core |
| Memory | 4 GB | 8 GB |
| Disk | 50 GB | 100 GB |
| OS | CentOS 7+ / Ubuntu 20.04+ | Rocky Linux 9 |
| JDK | OpenJDK 17 | OpenJDK 21 |
| WAS | Embedded Tomcat | 외장 Tomcat 10 |
| DB | MySQL 8.0 | MariaDB 10.6+ |

### 7.2 배포 구성

```
[개발 환경]
localhost → Docker Compose (BE + FE + DB)

[운영 환경 - 단일 서버]
┌─────────────────────────────────────┐
│           Nginx (80/443)            │
│  - SSL 인증서 (Let's Encrypt)       │
│  - 정적 파일 서빙                    │
│  - Reverse Proxy                    │
├─────────────────────────────────────┤
│  Backend (8080)  │  Frontend (3000) │
│  Spring Boot     │  Next.js         │
├─────────────────────────────────────┤
│           MySQL/MariaDB             │
└─────────────────────────────────────┘

[운영 환경 - 이중화]
┌─────────────────────────────────────┐
│           Load Balancer             │
├─────────────────────────────────────┤
│  Server 1       │      Server 2     │
│  (Active)       │      (Standby)    │
├─────────────────────────────────────┤
│         DB Master-Slave             │
└─────────────────────────────────────┘
```

---

## 8. GS인증 준비 체크리스트

### 8.1 기술 준비

- [ ] 기능 명세서 작성
- [ ] API 문서화 (Swagger/OpenAPI)
- [ ] 테스트 케이스 작성 (단위/통합)
- [ ] 정적 분석 통과 (SonarQube)
- [ ] 보안 취약점 점검 (OWASP ZAP)
- [ ] 성능 테스트 결과서 작성

### 8.2 문서 준비

- [ ] 제품 설명서
- [ ] 설치 매뉴얼
- [ ] 사용자 매뉴얼
- [ ] 운영자 매뉴얼
- [ ] 요구사항 추적표 (RTM)
- [ ] 테스트 결과서

### 8.3 인증 신청

- [ ] 인증 기관 선정 (TTA, KTC 등)
- [ ] 인증 신청서 작성
- [ ] 인증 비용 납부 (~300만원)
- [ ] 인증 심사 대응 (2~3주)

---

## 9. 로드맵

```
Phase 1: 현재 (eGov v4.3 연습)
├── 백엔드 기능 분석 완료
├── 프론트엔드 구조 설계 (public/admin 분리)
└── HANUI 적용 테스트

Phase 2: eGov v5 출시 후
├── v5 마이그레이션
├── CMS 기능 개발 (메뉴/콘텐츠/배너/팝업)
├── 관리자 화면 완성
└── 테스트 코드 작성

Phase 3: GS인증 준비
├── 문서화 (매뉴얼, 테스트 결과서)
├── 정적 분석/보안 점검
├── 성능 테스트
└── GS 2등급 인증 신청

Phase 4: 입찰 활용
├── 나라장터 등록
├── 제안서 템플릿 준비
└── 레퍼런스 확보
```

---

## 10. 참고 자료

- [전자정부 표준프레임워크](https://www.egovframe.go.kr/)
- [GS인증 안내](https://www.sw.or.kr/site/sw/gs/gs_intro.do)
- [HANUI 컴포넌트](https://hanui.io)
- [KRDS 디자인 시스템](https://uiux.egovframe.go.kr/guide/index.html)
- [웹 접근성 연구소](https://www.wah.or.kr/)

---

> **작성일**: 2024-12-02
> **작성자**: odada
> **다음 업데이트**: eGovFramework v5 출시 후
