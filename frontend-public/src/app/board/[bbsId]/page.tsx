'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { boardApi, BoardArticle } from '@/api';
import {
  Section,
  Container,
  SectionHeading,
  Button,
  Card,
  CardBody,
  Input,
  Alert,
  AlertDescription,
} from '@/components/hanui';

interface PageProps {
  params: Promise<{ bbsId: string }>;
}

export default function BoardListPage({ params }: PageProps) {
  const { bbsId } = use(params);
  const router = useRouter();
  const [articles, setArticles] = useState<BoardArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [boardName, setBoardName] = useState('게시판');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchWrd, setSearchWrd] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jToken');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    loadArticles(currentPage);
  }, [bbsId, currentPage]);

  const loadArticles = async (page: number) => {
    setLoading(true);
    setError('');

    try {
      const response = await boardApi.getList(
        bbsId,
        page,
        undefined,
        searchWrd || undefined
      );

      if (response.resultCode === 200 || response.resultCode === '200') {
        const data = response.result;
        setArticles(data.resultList || []);
        setBoardName(data.brdMstrVO?.bbsNm || '게시판');
        if (data.paginationInfo) {
          setTotalPages(data.paginationInfo.totalPageCount || 1);
        }
      } else {
        if (response.resultCode === 403) {
          setError('로그인이 필요합니다.');
        } else {
          setError(response.resultMessage || '게시물을 불러오는데 실패했습니다.');
        }
      }
    } catch (err) {
      setError('서버 연결에 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadArticles(1);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return dateStr.substring(0, 10);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* 헤더 */}
      <header className="bg-krds-white shadow-sm border-b border-krds-gray-20">
        <Container maxWidth="xl" className="py-4">
          <div className="flex justify-between items-center">
            <Link
              href="/"
              className="text-2xl font-bold text-krds-primary-50 hover:text-krds-primary-60 transition-colors"
            >
              eGovFramework CMS
            </Link>
            <nav className="flex items-center gap-3">
              <Link href="/">
                <Button variant="tertiary" size="sm">
                  홈
                </Button>
              </Link>
              <Link href="/board">
                <Button variant="tertiary" size="sm">
                  게시판
                </Button>
              </Link>
            </nav>
          </div>
        </Container>
      </header>

      {/* 메인 콘텐츠 */}
      <Section as="main" padding="page-section" background="gray" className="flex-1">
        <Container maxWidth="xl">
          {/* 제목 및 글쓰기 버튼 */}
          <div className="flex justify-between items-start mb-6">
            <SectionHeading level="h1" title={boardName} className="mb-0" />
            {isLoggedIn && (
              <Link href={`/board/${bbsId}/write`}>
                <Button variant="primary" size="md">
                  글쓰기
                </Button>
              </Link>
            )}
          </div>

          {/* 검색 */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-2">
              <Input
                type="text"
                value={searchWrd}
                onChange={(e) => setSearchWrd(e.target.value)}
                placeholder="검색어를 입력하세요"
                className="flex-1"
              />
              <Button type="submit" variant="secondary" size="md">
                검색
              </Button>
            </div>
          </form>

          {/* 게시물 목록 */}
          <Card variant="shadow" padding="none">
            <CardBody className="p-0">
              {loading ? (
                <div className="p-8 text-center text-krds-gray-60">
                  로딩 중...
                </div>
              ) : error ? (
                <div className="p-8">
                  <Alert variant="error" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                  {error.includes('로그인') && (
                    <div className="text-center">
                      <Link
                        href="/login"
                        className="text-krds-primary-50 hover:underline"
                      >
                        로그인하러 가기
                      </Link>
                    </div>
                  )}
                </div>
              ) : articles.length === 0 ? (
                <div className="p-8 text-center text-krds-gray-60">
                  게시물이 없습니다.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-krds-gray-5 border-b border-krds-gray-20">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-krds-gray-70 w-16">
                          번호
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-krds-gray-70">
                          제목
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-krds-gray-70 w-28">
                          작성자
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-krds-gray-70 w-28">
                          작성일
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-krds-gray-70 w-20">
                          조회
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {articles.map((article) => (
                        <tr
                          key={article.nttId}
                          className="border-b border-krds-gray-10 hover:bg-krds-gray-5 cursor-pointer transition-colors"
                          onClick={() =>
                            router.push(`/board/${bbsId}/${article.nttId}`)
                          }
                        >
                          <td className="px-4 py-3 text-sm text-krds-gray-60">
                            {article.nttNo}
                          </td>
                          <td className="px-4 py-3 text-krds-gray-95">
                            {article.replyLc && parseInt(article.replyLc) > 0 && (
                              <span className="mr-2 text-krds-gray-40">
                                {'└'.padStart(parseInt(article.replyLc) * 2, ' ')}
                              </span>
                            )}
                            {article.nttSj}
                          </td>
                          <td className="px-4 py-3 text-sm text-krds-gray-60">
                            {article.frstRegisterNm || article.ntcrNm || '-'}
                          </td>
                          <td className="px-4 py-3 text-sm text-krds-gray-60">
                            {formatDate(article.frstRegisterPnttm)}
                          </td>
                          <td className="px-4 py-3 text-sm text-krds-gray-60">
                            {article.inqireCo}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardBody>
          </Card>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                이전
              </Button>
              {Array.from({ length: Math.min(10, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'primary' : 'tertiary'}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                );
              })}
              <Button
                variant="tertiary"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                다음
              </Button>
            </div>
          )}
        </Container>
      </Section>

      {/* 푸터 */}
      <footer className="bg-krds-gray-95 text-krds-gray-40 py-8">
        <Container maxWidth="xl">
          <p className="text-center">
            © 2024 eGovFramework CMS. All rights reserved.
          </p>
        </Container>
      </footer>
    </div>
  );
}
