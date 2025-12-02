/**
 * 마이페이지 관련 API
 * - 내 정보 조회
 * - 내 정보 수정
 * - 회원 탈퇴
 */

import { apiWithAuth } from './client';
import type { MypageData } from '@/types/api';

export const mypageApi = {
  /**
   * 내 정보 조회
   */
  getMyInfo: () => apiWithAuth<MypageData>('/mypage'),

  /**
   * 내 정보 수정
   */
  updateMyInfo: (data: Partial<MypageData['mberManageVO']>) =>
    apiWithAuth('/mypage/update', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /**
   * 회원 탈퇴
   */
  deleteAccount: (data: { uniqId: string }) =>
    apiWithAuth('/mypage/delete', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};
