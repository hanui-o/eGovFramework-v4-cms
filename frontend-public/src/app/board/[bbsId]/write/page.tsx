'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { boardApi } from '@/api';
import {
  Section,
  Container,
  SectionHeading,
  Button,
  Card,
  CardBody,
  Input,
  Textarea,
  Label,
  Alert,
  AlertDescription,
} from '@/components/hanui';

interface PageProps {
  params: Promise<{ bbsId: string }>;
}

export default function BoardWritePage({ params }: PageProps) {
  const { bbsId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const editNttId = searchParams.get('edit');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [boardName, setBoardName] = useState('게시판');
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    // 로그인 확인
    const token = localStorage.getItem('jToken');
    if (!token) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    // 게시판 정보 로드
    loadBoardInfo();

    // 수정 모드인 경우 기존 글 로드
    if (editNttId) {
      setIsEdit(true);
      loadArticle(editNttId);
    }
  }, [bbsId, editNttId]);

  const loadBoardInfo = async () => {
    try {
      const response = await boardApi.getFileAtchInfo(bbsId);
      if (response.result) {
        setBoardName(
          (response.result as unknown as { bbsNm?: string }).bbsNm || '게시판'
        );
      }
    } catch (err) {
      console.error('Failed to load board info:', err);
    }
  };

  const loadArticle = async (nttId: string) => {
    try {
      const response = await boardApi.getDetail(bbsId, parseInt(nttId));
      if (response.resultCode === 200 || response.resultCode === '200') {
        const data = response.result;
        const article = data.result || data;
        setTitle((article as unknown as { nttSj?: string }).nttSj || '');
        setContent((article as unknown as { nttCn?: string }).nttCn || '');
      }
    } catch (err) {
      console.error('Failed to load article:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }

    if (!content.trim()) {
      setError('내용을 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('bbsId', bbsId);
      formData.append('nttSj', title);
      formData.append('nttCn', content);

      // 파일 첨부
      if (files) {
        for (let i = 0; i < files.length; i++) {
          formData.append('files', files[i]);
        }
      }

      let response;
      if (isEdit && editNttId) {
        response = await boardApi.update(parseInt(editNttId), formData);
      } else {
        response = await boardApi.create(formData);
      }

      if (response.resultCode === 200 || response.resultCode === '200') {
        alert(isEdit ? '수정되었습니다.' : '등록되었습니다.');
        router.push(`/board/${bbsId}`);
      } else {
        setError(
          response.resultMessage ||
            (isEdit ? '수정에 실패했습니다.' : '등록에 실패했습니다.')
        );
      }
    } catch (err) {
      setError('서버 연결에 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
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
        <Container maxWidth="lg">
          {/* 뒤로가기 링크 */}
          <div className="mb-6">
            <Link
              href={`/board/${bbsId}`}
              className="inline-flex items-center text-krds-primary-50 hover:text-krds-primary-60 font-medium"
            >
              ← {boardName} 목록으로
            </Link>
          </div>

          <Card variant="shadow" padding="lg">
            <CardBody>
              <SectionHeading
                level="h1"
                title={isEdit ? '게시물 수정' : '게시물 작성'}
              />

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 제목 */}
                <div className="space-y-2">
                  <Label htmlFor="title">
                    제목 <span className="text-krds-danger-50">*</span>
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목을 입력하세요"
                    required
                  />
                </div>

                {/* 내용 */}
                <div className="space-y-2">
                  <Label htmlFor="content">
                    내용 <span className="text-krds-danger-50">*</span>
                  </Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={15}
                    placeholder="내용을 입력하세요"
                    required
                  />
                </div>

                {/* 파일 첨부 */}
                <div className="space-y-2">
                  <Label htmlFor="files">파일 첨부</Label>
                  <input
                    id="files"
                    type="file"
                    multiple
                    onChange={(e) => setFiles(e.target.files)}
                    className="w-full h-12 px-4 py-2 border border-krds-gray-60 rounded-md bg-krds-white text-krds-gray-95 focus:outline-none focus:border-2 focus:border-krds-primary-50 file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:bg-krds-gray-10 file:text-krds-gray-70 file:font-medium hover:file:bg-krds-gray-20"
                  />
                  <p className="text-sm text-krds-gray-60">
                    여러 파일을 선택할 수 있습니다.
                  </p>
                </div>

                {/* 에러 메시지 */}
                {error && (
                  <Alert variant="error">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* 버튼 */}
                <div className="flex justify-end gap-3 pt-4">
                  <Link href={`/board/${bbsId}`}>
                    <Button variant="tertiary" size="lg">
                      취소
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={loading}
                  >
                    {isEdit ? '수정' : '등록'}
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
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
