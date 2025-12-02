/**
 * API 모듈 통합 export
 *
 * 사용법:
 * import { authApi, boardApi } from '@/api';
 */

// 개별 API 모듈
export { authApi } from './auth';
export { memberApi } from './member';
export { boardApi } from './board';
export { mypageApi } from './mypage';

// 클라이언트 유틸리티
export {
  api,
  apiWithAuth,
  apiFormData,
  getToken,
  setToken,
  removeToken,
} from './client';

// 타입 re-export
export type {
  ApiResponse,
  LoginResponse,
  MemberData,
  BoardArticle,
  BoardMaster,
  BoardListResponse,
  BoardDetailResponse,
  MypageData,
  PaginationInfo,
  CodeItem,
} from '@/types/api';
