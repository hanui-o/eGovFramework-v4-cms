'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { boardApi, BoardArticle } from '@/api';
import {
  Section,
  Container,
  Button,
  Card,
  CardBody,
  CardFooter,
  Alert,
  AlertDescription,
  Badge,
} from '@/components/hanui';

interface PageProps {
  params: Promise<{ bbsId: string; nttId: string }>;
}

export default function BoardDetailPage({ params }: PageProps) {
  const { bbsId, nttId } = use(params);
  const router = useRouter();
  const [article, setArticle] = useState<BoardArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [boardName, setBoardName] = useState('게시판');
  const [isAuthor, setIsAuthor] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadArticle();
  }, [bbsId, nttId]);

  const loadArticle = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await boardApi.getDetail(bbsId, parseInt(nttId));

      if (response.resultCode === 200 || response.resultCode === '200') {
        const data = response.result;
        setArticle(data.result || (data as unknown as BoardArticle));
        setBoardName(
          (data as unknown as { brdMstrVO?: { bbsNm?: string } }).brdMstrVO
            ?.bbsNm || '게시판'
        );

        // 작성자 확인
        const user = localStorage.getItem('user');
        if (user) {
          try {
            const userData = JSON.parse(user);
            const sessionUniqId = (
              data as unknown as { sessionUniqId?: string }
            ).sessionUniqId;
            const articleAuthor = (
              data.result || (data as unknown as BoardArticle)
            ).frstRegisterId;
            setIsAuthor(
              sessionUniqId === articleAuthor ||
                userData.uniqId === articleAuthor
            );
          } catch {
            setIsAuthor(false);
          }
        }
      } else {
        if (response.resultCode === 403) {
          setError('로그인이 필요합니다.');
        } else {
          setError(
            response.resultMessage || '게시물을 불러오는데 실패했습니다.'
          );
        }
      }
    } catch (err) {
      setError('서버 연결에 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    setDeleting(true);
    try {
      const response = await boardApi.delete(bbsId, parseInt(nttId));
      if (response.resultCode === 200 || response.resultCode === '200') {
        alert('삭제되었습니다.');
        router.push(`/board/${bbsId}`);
      } else {
        alert(response.resultMessage || '삭제에 실패했습니다.');
      }
    } catch (err) {
      alert('서버 연결에 실패했습니다.');
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return dateStr.replace('T', ' ').substring(0, 19);
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
      <Section
        as="main"
        padding="page-section"
        background="gray"
        className="flex-1"
      >
        <Container maxWidth="xl">
          {/* 뒤로가기 링크 */}
          <div className="mb-6">
            <Link
              href={`/board/${bbsId}`}
              className="inline-flex items-center text-krds-primary-50 hover:text-krds-primary-60 font-medium"
            >
              ← {boardName} 목록으로
            </Link>
          </div>

          {loading ? (
            <Card variant="shadow" padding="lg">
              <CardBody>
                <div className="text-center text-krds-gray-60 py-8">
                  로딩 중...
                </div>
              </CardBody>
            </Card>
          ) : error ? (
            <Card variant="shadow" padding="lg">
              <CardBody>
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
              </CardBody>
            </Card>
          ) : article ? (
            <Card variant="shadow" padding="none">
              {/* 제목 영역 */}
              <div className="border-b border-krds-gray-20 p-6">
                <h1 className="text-2xl font-bold text-krds-gray-95 mb-4">
                  {article.nttSj}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm text-krds-gray-60">
                  <span className="flex items-center gap-1">
                    <span className="text-krds-gray-70">작성자:</span>
                    <span className="text-krds-gray-95">
                      {article.frstRegisterNm || article.ntcrNm || '-'}
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-krds-gray-70">작성일:</span>
                    <span>{formatDate(article.frstRegisterPnttm)}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-krds-gray-70">조회수:</span>
                    <Badge variant="secondary" size="sm">
                      {article.inqireCo}
                    </Badge>
                  </span>
                </div>
              </div>

              {/* 내용 영역 */}
              <CardBody className="min-h-[300px]">
                <div
                  className="prose max-w-none text-krds-gray-95 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: article.nttCn?.replace(/\n/g, '<br/>') || '',
                  }}
                />
              </CardBody>

              {/* 첨부파일 */}
              {article.atchFileId && (
                <div className="border-t border-krds-gray-20 p-6">
                  <h3 className="font-semibold text-krds-gray-95 mb-2">
                    첨부파일
                  </h3>
                  <p className="text-sm text-krds-gray-60">
                    첨부파일 ID: {article.atchFileId}
                  </p>
                </div>
              )}

              {/* 버튼 영역 */}
              <CardFooter className="flex justify-between border-t border-krds-gray-20">
                <Link href={`/board/${bbsId}`}>
                  <Button variant="tertiary" size="md">
                    목록
                  </Button>
                </Link>
                {isAuthor && (
                  <div className="flex gap-2">
                    <Link href={`/board/${bbsId}/write?edit=${nttId}`}>
                      <Button variant="secondary" size="md">
                        수정
                      </Button>
                    </Link>
                    <Button
                      variant="primary"
                      size="md"
                      onClick={handleDelete}
                      loading={deleting}
                      className="bg-krds-danger-50 hover:bg-krds-danger-60 border-krds-danger-50"
                    >
                      삭제
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          ) : (
            <Card variant="shadow" padding="lg">
              <CardBody>
                <div className="text-center text-krds-gray-60 py-8">
                  게시물을 찾을 수 없습니다.
                </div>
              </CardBody>
            </Card>
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
