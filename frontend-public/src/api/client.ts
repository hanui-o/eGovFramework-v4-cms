/**
 * API 클라이언트 - 공통 fetch 로직
 */

import type { ApiResponse } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * 로컬스토리지에서 토큰 가져오기
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('jToken');
}

/**
 * 토큰 저장
 */
export function setToken(token: string): void {
  localStorage.setItem('jToken', token);
}

/**
 * 토큰 삭제 (로그아웃 시)
 */
export function removeToken(): void {
  localStorage.removeItem('jToken');
  localStorage.removeItem('user');
}

/**
 * 인증 헤더 생성
 */
function getAuthHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: token } : {};
}

/**
 * 기본 API 호출 (인증 불필요)
 */
export async function api<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

/**
 * 인증 필요한 API 호출
 */
export async function apiWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  // 401 에러 시 로그인 페이지로
  if (response.status === 401) {
    removeToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('인증이 만료되었습니다.');
  }

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

/**
 * FormData API 호출 (파일 업로드용)
 */
export async function apiFormData<T>(
  endpoint: string,
  data: FormData,
  method: 'POST' | 'PUT' = 'POST'
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    method,
    headers: {
      ...getAuthHeaders(),
      // Content-Type은 자동 설정됨 (multipart/form-data)
    },
    body: data,
  });

  return response.json();
}

/**
 * URL Encoded API 호출 (회원가입 등)
 */
export async function apiUrlEncoded<T>(
  endpoint: string,
  data: Record<string, string>
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const formBody = new URLSearchParams(data).toString();

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formBody,
  });

  return response.json();
}
