'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { memberApi, MemberData } from '@/api';
import {
  Section,
  Container,
  SectionHeading,
  Button,
  Card,
  CardBody,
  CardFooter,
  Input,
  Label,
  Alert,
  AlertDescription,
} from '@/components/hanui';

interface CodeItem {
  code: string;
  codeNm: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [idChecked, setIdChecked] = useState(false);
  const [idAvailable, setIdAvailable] = useState(false);

  const [formData, setFormData] = useState<MemberData>({
    mberId: '',
    mberNm: '',
    password: '',
    passwordHint: '',
    passwordCnsr: '',
    mberEmailAdres: '',
    sexdstnCode: '',
    moblphonNo: '',
  });
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const [passwordHints, setPasswordHints] = useState<CodeItem[]>([]);
  const [genderCodes, setGenderCodes] = useState<CodeItem[]>([]);

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const response = await memberApi.getSignupFormData();
        if (response.result) {
          setPasswordHints(response.result.passwordHint_result || []);
          setGenderCodes(response.result.sexdstnCode_result || []);
        }
      } catch (err) {
        console.error('Failed to load form data:', err);
      }
    };
    loadFormData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'mberId') {
      setIdChecked(false);
      setIdAvailable(false);
    }
  };

  const checkIdDuplicate = async () => {
    if (!formData.mberId) {
      setError('아이디를 입력해주세요.');
      return;
    }

    try {
      const response = await memberApi.checkId(formData.mberId);
      setIdChecked(true);

      if (response.result && response.result.usedCnt === 0) {
        setIdAvailable(true);
        setError('');
        setSuccess('사용 가능한 아이디입니다.');
      } else {
        setIdAvailable(false);
        setSuccess('');
        setError('이미 사용중인 아이디입니다.');
      }
    } catch (err) {
      setError('아이디 중복 확인에 실패했습니다.');
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!idChecked || !idAvailable) {
      setError('아이디 중복 확인을 해주세요.');
      return;
    }

    if (formData.password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (formData.password.length < 4) {
      setError('비밀번호는 4자 이상이어야 합니다.');
      return;
    }

    setLoading(true);

    try {
      const response = await memberApi.signup(formData);

      if (response.resultCode === '200' || response.resultCode === 200) {
        setSuccess('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(response.resultMessage || '회원가입에 실패했습니다.');
      }
    } catch (err) {
      setError('서버 연결에 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section as="main" padding="page-section" background="gray">
      <Container maxWidth="md">
        <SectionHeading
          level="h1"
          title="eGovFramework CMS"
          description="회원가입"
          className="text-center"
        />

        <Card variant="shadow" padding="lg">
          <form onSubmit={handleSubmit}>
            <CardBody className="space-y-5">
              {/* 아이디 */}
              <div className="space-y-2">
                <Label htmlFor="mberId">
                  아이디 <span className="text-krds-danger-50">*</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="mberId"
                    name="mberId"
                    value={formData.mberId}
                    onChange={handleChange}
                    placeholder="아이디"
                    required
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="tertiary"
                    onClick={checkIdDuplicate}
                  >
                    중복확인
                  </Button>
                </div>
                {idChecked && (
                  <p
                    className={`text-sm ${idAvailable ? 'text-krds-success-50' : 'text-krds-danger-50'}`}
                  >
                    {idAvailable
                      ? '사용 가능한 아이디입니다.'
                      : '이미 사용중인 아이디입니다.'}
                  </p>
                )}
              </div>

              {/* 이름 */}
              <div className="space-y-2">
                <Label htmlFor="mberNm">
                  이름 <span className="text-krds-danger-50">*</span>
                </Label>
                <Input
                  id="mberNm"
                  name="mberNm"
                  value={formData.mberNm}
                  onChange={handleChange}
                  placeholder="이름"
                  required
                />
              </div>

              {/* 비밀번호 */}
              <div className="space-y-2">
                <Label htmlFor="password">
                  비밀번호 <span className="text-krds-danger-50">*</span>
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="비밀번호 (4자 이상)"
                  required
                />
              </div>

              {/* 비밀번호 확인 */}
              <div className="space-y-2">
                <Label htmlFor="passwordConfirm">
                  비밀번호 확인 <span className="text-krds-danger-50">*</span>
                </Label>
                <Input
                  id="passwordConfirm"
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="비밀번호 확인"
                  required
                  status={
                    passwordConfirm && formData.password !== passwordConfirm
                      ? 'error'
                      : undefined
                  }
                />
                {passwordConfirm && formData.password !== passwordConfirm && (
                  <p className="text-sm text-krds-danger-50">
                    비밀번호가 일치하지 않습니다.
                  </p>
                )}
              </div>

              {/* 비밀번호 힌트 */}
              <div className="space-y-2">
                <Label htmlFor="passwordHint">
                  비밀번호 힌트 <span className="text-krds-danger-50">*</span>
                </Label>
                <select
                  id="passwordHint"
                  name="passwordHint"
                  value={formData.passwordHint}
                  onChange={handleChange}
                  className="w-full h-12 px-4 border border-krds-gray-60 rounded-md bg-krds-white text-krds-gray-95 focus:outline-none focus:border-2 focus:border-krds-primary-50"
                  required
                >
                  <option value="">선택하세요</option>
                  {passwordHints.map((hint) => (
                    <option key={hint.code} value={hint.code}>
                      {hint.codeNm}
                    </option>
                  ))}
                </select>
              </div>

              {/* 비밀번호 힌트 답변 */}
              <div className="space-y-2">
                <Label htmlFor="passwordCnsr">
                  비밀번호 힌트 답변{' '}
                  <span className="text-krds-danger-50">*</span>
                </Label>
                <Input
                  id="passwordCnsr"
                  name="passwordCnsr"
                  value={formData.passwordCnsr}
                  onChange={handleChange}
                  placeholder="힌트에 대한 답변"
                  required
                />
              </div>

              {/* 이메일 */}
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
                  placeholder="example@email.com"
                  required
                />
              </div>

              {/* 성별 */}
              <div className="space-y-2">
                <Label htmlFor="sexdstnCode">
                  성별 <span className="text-krds-danger-50">*</span>
                </Label>
                <select
                  id="sexdstnCode"
                  name="sexdstnCode"
                  value={formData.sexdstnCode}
                  onChange={handleChange}
                  className="w-full h-12 px-4 border border-krds-gray-60 rounded-md bg-krds-white text-krds-gray-95 focus:outline-none focus:border-2 focus:border-krds-primary-50"
                  required
                >
                  <option value="">선택하세요</option>
                  {genderCodes.map((code) => (
                    <option key={code.code} value={code.code}>
                      {code.codeNm}
                    </option>
                  ))}
                </select>
              </div>

              {/* 휴대폰 번호 */}
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

              {/* 에러/성공 메시지 */}
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

              {/* 제출 버튼 */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full"
              >
                회원가입
              </Button>
            </CardBody>
          </form>

          <CardFooter className="justify-center border-t border-krds-gray-10 mt-6">
            <p className="text-krds-gray-60">
              이미 계정이 있으신가요?{' '}
              <Link
                href="/login"
                className="text-krds-primary-50 hover:underline font-medium"
              >
                로그인
              </Link>
            </p>
          </CardFooter>
        </Card>
      </Container>
    </Section>
  );
}
