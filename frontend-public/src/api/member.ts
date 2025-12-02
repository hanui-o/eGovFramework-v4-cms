/**
 * 회원 관련 API
 * - 회원가입
 * - 아이디 중복체크
 * - 약관 조회
 */

import { api, apiUrlEncoded } from './client';
import type { MemberData, CodeItem } from '@/types/api';

export const memberApi = {
  /**
   * 회원가입 폼 데이터 조회 (패스워드 힌트, 성별 코드 등)
   */
  getSignupFormData: () =>
    api<{
      passwordHint_result: CodeItem[];
      sexdstnCode_result: CodeItem[];
    }>('/etc/member_insert'),

  /**
   * 아이디 중복 체크
   * @param id 확인할 아이디
   * @returns usedCnt가 0이면 사용 가능
   */
  checkId: (id: string) =>
    api<{ usedCnt: number; checkId: string }>(
      `/etc/member_checkid/${encodeURIComponent(id)}`
    ),

  /**
   * 회원가입
   */
  signup: (data: MemberData) =>
    apiUrlEncoded('/etc/member_insert', data as unknown as Record<string, string>),

  /**
   * 약관 조회
   */
  getAgreement: () =>
    api<{ stplatList: object; sbscrbTy: string }>('/etc/member_agreement'),
};
