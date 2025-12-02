/**
 * 게시판 관련 API
 * - 목록 조회
 * - 상세 조회
 * - 등록/수정/삭제
 */

import { apiWithAuth, apiFormData } from './client';
import type { BoardListResponse, BoardDetailResponse, BoardMaster } from '@/types/api';

export const boardApi = {
  /**
   * 게시물 목록 조회
   * @param bbsId 게시판 ID
   * @param pageIndex 페이지 번호 (1부터 시작)
   * @param searchCnd 검색 조건 (0: 제목, 1: 내용, 2: 작성자)
   * @param searchWrd 검색어
   */
  getList: (
    bbsId: string,
    pageIndex = 1,
    searchCnd?: string,
    searchWrd?: string
  ) => {
    const params = new URLSearchParams({
      bbsId,
      pageIndex: String(pageIndex),
    });
    if (searchCnd) params.append('searchCnd', searchCnd);
    if (searchWrd) params.append('searchWrd', searchWrd);

    return apiWithAuth<BoardListResponse>(`/board?${params.toString()}`);
  },

  /**
   * 게시물 상세 조회
   * @param bbsId 게시판 ID
   * @param nttId 게시글 ID
   */
  getDetail: (bbsId: string, nttId: number) =>
    apiWithAuth<BoardDetailResponse>(`/board/${bbsId}/${nttId}`),

  /**
   * 게시물 등록
   * @param data FormData (제목, 내용, 첨부파일 등)
   */
  create: (data: FormData) => apiFormData('/board', data, 'POST'),

  /**
   * 게시물 수정
   * @param nttId 게시글 ID
   * @param data FormData
   */
  update: (nttId: number, data: FormData) =>
    apiFormData(`/board/${nttId}`, data, 'PUT'),

  /**
   * 게시물 삭제
   * @param bbsId 게시판 ID
   * @param nttId 게시글 ID
   */
  delete: (bbsId: string, nttId: number) =>
    apiWithAuth(`/board/${bbsId}/${nttId}`, {
      method: 'PATCH',
      body: JSON.stringify({}),
    }),

  /**
   * 게시판 파일첨부 정보 조회
   * @param bbsId 게시판 ID
   */
  getFileAtchInfo: (bbsId: string) =>
    apiWithAuth<BoardMaster>(`/boardFileAtch/${bbsId}`),
};
