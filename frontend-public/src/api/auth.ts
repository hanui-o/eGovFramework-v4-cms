/**
 * 인증 관련 API
 * - 로그인
 * - 로그아웃
 */

import { api, setToken, removeToken } from './client';
import type { ApiResponse, LoginResponse } from '@/types/api';

export const authApi = {
  /**
   * 로그인
   * @param id 아이디
   * @param password 비밀번호
   * @param userSe 사용자 구분 (GNR: 일반, ENT: 기업, USR: 관리자/직원)
   */
  login: async (id: string, password: string, userSe: string = 'USR') => {
    const response = await api<LoginResponse>('/auth/login-jwt', {
      method: 'POST',
      body: JSON.stringify({ id, password, userSe }),
    });

    // 로그인 성공 시 토큰 저장
    if (response.resultCode === '200' || response.resultCode === 200) {
      const data = response as unknown as { jToken?: string; resultVO?: object };
      if (data.jToken) {
        setToken(data.jToken);
        localStorage.setItem('user', JSON.stringify(data.resultVO));
      }
    }

    return response;
  },

  /**
   * 로그아웃
   */
  logout: () => {
    removeToken();
    return api('/auth/logout');
  },

  /**
   * 현재 로그인 상태 확인
   */
  isLoggedIn: (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('jToken');
  },

  /**
   * 현재 로그인한 사용자 정보
   */
  getCurrentUser: () => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};
