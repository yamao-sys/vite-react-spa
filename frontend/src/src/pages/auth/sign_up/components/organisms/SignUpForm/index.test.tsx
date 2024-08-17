import { render, screen } from '@testing-library/react';
import { SignUpForm } from '.';

const useSignUpContext = vi.hoisted(() =>
  vi.fn(() => ({
    signUpInput: {
      name: 'test_name',
      email: 'test@example.com',
      password: 'Passwor1',
      passwordConfirm: 'Passwor1',
    },
    updateSignUpInput: vi.fn(),
  })),
);
vi.mock('../../../contexts/SignUpContext', async (importOriginal) => {
  const mod = await importOriginal<typeof import('../../../contexts/SignUpContext')>();
  return {
    ...mod,
    useSignUpContext,
  };
});

describe('pages/auth/sign_up/components/organisms/SignUpForm', () => {
  describe('入力画面', () => {
    test('入力画面が表示できること', () => {
      render(<SignUpForm />);

      expect(screen.getByLabelText('ユーザ名')).toHaveDisplayValue('test_name');
      expect(screen.getByLabelText('メールアドレス')).toHaveDisplayValue('test@example.com');
      expect(screen.getByLabelText('パスワード')).toHaveDisplayValue('Passwor1');
      expect(screen.getByLabelText('パスワード確認用')).toHaveDisplayValue('Passwor1');

      expect(screen.getByRole('button', { name: '確認画面へ' })).toBeInTheDocument();
    });
  });
});
