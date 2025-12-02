'use client';

import Link from 'next/link';
import {
  Section,
  Container,
  SectionHeading,
  Button,
  Card,
  CardBody,
  Heading,
} from '@/components/hanui';

const BOARDS = [
  {
    bbsId: 'BBSMSTR_AAAAAAAAAAAA',
    name: '공지사항',
    description: '중요한 공지사항을 확인하세요.',
  },
  {
    bbsId: 'BBSMSTR_BBBBBBBBBBBB',
    name: '자유게시판',
    description: '자유롭게 의견을 나누는 공간입니다.',
  },
  {
    bbsId: 'BBSMSTR_CCCCCCCCCCCC',
    name: '갤러리',
    description: '사진과 이미지를 공유하는 게시판입니다.',
  },
];

export default function BoardMainPage() {
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
              <Link href="/login">
                <Button variant="tertiary" size="sm">
                  로그인
                </Button>
              </Link>
            </nav>
          </div>
        </Container>
      </header>

      {/* 메인 콘텐츠 */}
      <Section as="main" padding="page-section" background="gray" className="flex-1">
        <Container maxWidth="xl">
          <SectionHeading
            level="h1"
            title="게시판"
            description="다양한 게시판에서 정보를 확인하고 공유하세요."
          />

          <div className="grid md:grid-cols-3 gap-6">
            {BOARDS.map((board) => (
              <Link key={board.bbsId} href={`/board/${board.bbsId}`}>
                <Card
                  variant="outline"
                  padding="lg"
                  className="h-full hover:shadow-md hover:border-krds-primary-30 transition-all cursor-pointer"
                >
                  <CardBody className="space-y-3">
                    <Heading level="h2" className="text-krds-gray-95">
                      {board.name}
                    </Heading>
                    <p className="text-krds-gray-70 leading-relaxed">
                      {board.description}
                    </p>
                    <span className="inline-flex items-center text-krds-primary-50 font-medium text-sm">
                      바로가기 →
                    </span>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
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
