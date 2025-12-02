'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { mypageApi } from '@/api';
import {
  Section,
  Container,
  SectionHeading,
  Button,
  Card,
  CardBody,
  Input,
  Label,
  Alert,
  AlertDescription,
} from '@/components/hanui';

interface CodeItem {
  code: string;
  codeNm: string;
}

export default function MypagePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    uniqId: '',
    mberId: '',
    mberNm: '',
    mberEmailAdres: '',
    sexdstnCode: '',
    moblphonNo: '',
    zip: '',
    adres: '',
    detailAdres: '',
    passwordHint: '',
    passwordCnsr: '',
    password: '',
  });

  const [passwordHints, setPasswordHints] = useState<CodeItem[]>([]);
  const [genderCodes, setGenderCodes] = useState<CodeItem[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('jToken');
    if (!token) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }
    loadMyInfo();
  }, []);

  const loadMyInfo = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await mypageApi.getMyInfo();

      if (response.resultCode === 200 || response.resultCode === '200') {
        const data = response.result;
        if (data.mberManageVO) {
          setFormData({
            ...data.mberManageVO,
            password: '',
          });
        }
        if (data.passwordHint_result) {
          setPasswordHints(data.passwordHint_result);
        }
        if (data.sexdstnCode_result) {
          setGenderCodes(data.sexdstnCode_result);
        }
      } else {
        if (response.resultCode === 403) {
          setError('로그인이 필요합니다.');
          router.push('/login');
        } else {
          setError(
            response.resultMessage || '정보를 불러오는데 실패했습니다.'
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await mypageApi.updateMyInfo(formData);

      if (response.resultCode === 200 || response.resultCode === '200') {
        setSuccess('정보가 수정되었습니다.');
        setIsEditing(false);

        // 로컬 스토리지의 사용자 정보 업데이트
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          user.name = formData.mberNm;
          localStorage.setItem('user', JSON.stringify(user));
        }
      } else {
        setError(response.resultMessage || '수정에 실패했습니다.');
      }
    } catch (err) {
      setError('서버 연결에 실패했습니다.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;

    try {
      const response = await mypageApi.deleteAccount({
        uniqId: formData.uniqId,
      });

      if (response.resultCode === 200 || response.resultCode === '200') {
        alert('탈퇴 처리되었습니다.');
        localStorage.removeItem('jToken');
        localStorage.removeItem('user');
        router.push('/');
      } else {
        alert(response.resultMessage || '탈퇴 처리에 실패했습니다.');
      }
    } catch (err) {
      alert('서버 연결에 실패했습니다.');
      console.error(err);
    }
  };

  const getGenderName = (code: string) => {
    const gender = genderCodes.find((g) => g.code === code);
    return gender?.codeNm || code;
  };

  const getPasswordHintName = (code: string) => {
    const hint = passwordHints.find((h) => h.code === code);
    return hint?.codeNm || code;
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
        <Container maxWidth="md">
          <SectionHeading
            level="h1"
            title="마이페이지"
            description="회원 정보를 확인하고 수정할 수 있습니다."
          />

          {loading ? (
            <Card variant="shadow" padding="lg">
              <CardBody>
                <div className="text-center text-krds-gray-60 py-8">
                  로딩 중...
                </div>
              </CardBody>
            </Card>
          ) : error && !formData.mberId ? (
            <Card variant="shadow" padding="lg">
              <CardBody>
                <Alert variant="error">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </CardBody>
            </Card>
          ) : (
            <Card variant="shadow" padding="lg">
              <CardBody>
                {/* 헤더 영역 */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-krds-gray-20">
                  <h2 className="text-xl font-semibold text-krds-gray-95">
                    내 정보
                  </h2>
                  {!isEditing && (
                    <Button
                      variant="tertiary"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      수정
                    </Button>
                  )}
                </div>

                {isEditing ? (
                  /* 수정 모드 */
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="mberId">아이디</Label>
                      <Input
                        id="mberId"
                        type="text"
                        value={formData.mberId}
                        disabled
                        readOnly
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mberNm">
                        이름 <span className="text-krds-danger-50">*</span>
                      </Label>
                      <Input
                        id="mberNm"
                        name="mberNm"
                        type="text"
                        value={formData.mberNm}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mberEmailAdres">
                        이메일 <span className="text-krds-danger-50">*</span>
                      </Label>
                      <Input
                        id="mberEmailAdres"
                        name="mberEmailAdres"
                        type="email"
                        value={formData.mberEmailAdres}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sexdstnCode">성별</Label>
                      <select
                        id="sexdstnCode"
                        name="sexdstnCode"
                        value={formData.sexdstnCode}
                        onChange={handleChange}
                        className="w-full h-12 px-4 border border-krds-gray-60 rounded-md bg-krds-white text-krds-gray-95 focus:outline-none focus:border-2 focus:border-krds-primary-50"
                      >
                        <option value="">선택하세요</option>
                        {genderCodes.map((code) => (
                          <option key={code.code} value={code.code}>
                            {code.codeNm}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="moblphonNo">휴대폰 번호</Label>
                      <Input
                        id="moblphonNo"
                        name="moblphonNo"
                        type="tel"
                        value={formData.moblphonNo}
                        onChange={handleChange}
                        placeholder="010-1234-5678"
                      />
                    </div>

                    {error && (
                      <Alert variant="error">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {success && (
                      <Alert variant="success">
                        <AlertDescription>{success}</AlertDescription>
                      </Alert>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                      <Button
                        type="button"
                        variant="tertiary"
                        size="md"
                        onClick={() => {
                          setIsEditing(false);
                          loadMyInfo();
                        }}
                      >
                        취소
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        loading={saving}
                      >
                        저장
                      </Button>
                    </div>
                  </form>
                ) : (
                  /* 조회 모드 */
                  <div className="space-y-4">
                    <div className="flex border-b border-krds-gray-10 pb-3">
                      <span className="w-32 text-krds-gray-60 font-medium">
                        아이디
                      </span>
                      <span className="text-krds-gray-95">
                        {formData.mberId}
                      </span>
                    </div>
                    <div className="flex border-b border-krds-gray-10 pb-3">
                      <span className="w-32 text-krds-gray-60 font-medium">
                        이름
                      </span>
                      <span className="text-krds-gray-95">
                        {formData.mberNm}
                      </span>
                    </div>
                    <div className="flex border-b border-krds-gray-10 pb-3">
                      <span className="w-32 text-krds-gray-60 font-medium">
                        이메일
                      </span>
                      <span className="text-krds-gray-95">
                        {formData.mberEmailAdres}
                      </span>
                    </div>
                    <div className="flex border-b border-krds-gray-10 pb-3">
                      <span className="w-32 text-krds-gray-60 font-medium">
                        성별
                      </span>
                      <span className="text-krds-gray-95">
                        {getGenderName(formData.sexdstnCode)}
                      </span>
                    </div>
                    <div className="flex border-b border-krds-gray-10 pb-3">
                      <span className="w-32 text-krds-gray-60 font-medium">
                        휴대폰
                      </span>
                      <span className="text-krds-gray-95">
                        {formData.moblphonNo || '-'}
                      </span>
                    </div>
                    <div className="flex border-b border-krds-gray-10 pb-3">
                      <span className="w-32 text-krds-gray-60 font-medium">
                        비밀번호 힌트
                      </span>
                      <span className="text-krds-gray-95">
                        {getPasswordHintName(formData.passwordHint)}
                      </span>
                    </div>

                    {success && (
                      <Alert variant="success">
                        <AlertDescription>{success}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                {/* 회원 탈퇴 */}
                <div className="mt-8 pt-6 border-t border-krds-gray-20">
                  <button
                    onClick={handleDelete}
                    className="text-krds-danger-50 hover:text-krds-danger-60 text-sm font-medium transition-colors"
                  >
                    회원 탈퇴
                  </button>
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
