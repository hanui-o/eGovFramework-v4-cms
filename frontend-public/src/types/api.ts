/**
 * API 공통 타입 정의
 */

// 공통 응답 타입
export interface ApiResponse<T = unknown> {
  resultCode: string | number;
  resultMessage: string;
  result: T;
}

// 로그인 응답
export interface LoginResponse {
  jToken?: string;
  resultVO?: {
    id: string;
    name: string;
    email?: string;
    userSe?: string;
  };
}

// 회원 데이터
export interface MemberData {
  mberId: string;
  mberNm: string;
  password: string;
  passwordHint: string;
  passwordCnsr: string;
  mberEmailAdres: string;
  sexdstnCode: string;
  moblphonNo?: string;
  zip?: string;
  adres?: string;
  detailAdres?: string;
}

// 게시글
export interface BoardArticle {
  nttId: number;
  bbsId: string;
  nttNo: number;
  nttSj: string;
  nttCn: string;
  frstRegisterId: string;
  frstRegisterNm?: string;
  frstRegisterPnttm: string;
  inqireCo: number;
  atchFileId?: string;
  ntcrNm?: string;
  replyLc?: string;
  replyAt?: string;
}

// 게시판 마스터
export interface BoardMaster {
  bbsId: string;
  bbsNm: string;
  bbsTyCode: string;
  fileAtchPosblAt: string;
  posblAtchFileNumber: number;
  posblAtchFileSize?: number;
}

// 페이징 정보
export interface PaginationInfo {
  currentPageNo: number;
  recordCountPerPage: number;
  pageSize: number;
  totalRecordCount: number;
  totalPageCount: number;
  firstPageNoOnPageList: number;
  lastPageNoOnPageList: number;
  firstRecordIndex: number;
  lastRecordIndex: number;
}

// 게시글 목록 응답
export interface BoardListResponse {
  resultList: BoardArticle[];
  resultCnt: number;
  paginationInfo: PaginationInfo;
  brdMstrVO?: BoardMaster;
  user?: object;
}

// 게시글 상세 응답
export interface BoardDetailResponse {
  result: BoardArticle;
  brdMstrVO?: BoardMaster;
  sessionUniqId?: string;
  user?: object;
}

// 마이페이지 데이터
export interface MypageData {
  mberManageVO: {
    uniqId: string;
    mberId: string;
    mberNm: string;
    mberEmailAdres: string;
    sexdstnCode: string;
    moblphonNo: string;
    zip: string;
    adres: string;
    detailAdres: string;
    passwordHint: string;
    passwordCnsr: string;
  };
  passwordHint_result?: Array<{ code: string; codeNm: string }>;
  sexdstnCode_result?: Array<{ code: string; codeNm: string }>;
}

// 코드 아이템 (공통코드)
export interface CodeItem {
  code: string;
  codeNm: string;
}
