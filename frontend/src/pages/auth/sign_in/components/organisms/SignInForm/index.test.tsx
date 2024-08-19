import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import SignInForm from './index.tsx';

// userのセットアップ
const user = userEvent.setup();

const navigate = vi.hoisted(() => vi.fn());
vi.mock('react-router-dom', async () => {
  const reactRouterDom = await vi.importActual('react-router-dom');
  return {
    ...reactRouterDom,
    useNavigate: navigate,
  };
});

const postSignIn = vi.hoisted(() => vi.fn(() => ({ errors: [''] })));
vi.mock('@/apis/authApi', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@/apis/authApi')>();
  return {
    ...mod,
    postSignIn,
  };
});

describe('pages/auth/sign_in/SignInForm', () => {
  test('フォームが表示されること', () => {
    render(<SignInForm />);

    expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument();
    expect(screen.getByLabelText('パスワード')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'ログインする' })).toBeInTheDocument();
  });

  describe('バリデーションエラーがない場合', () => {
    beforeEach(() => {
      postSignIn.mockResolvedValue({
        errors: [],
      });
    });

    test('ログインリダイレクトされる', async () => {
      render(<SignInForm />);

      // フォーム入力
      const emailInput = screen.getByLabelText('メールアドレス');
      await user.type(emailInput, 'test@example.com');

      const passwordInput = screen.getByLabelText('パスワード');
      await user.type(passwordInput, 'Passwor1');

      const submitButtonElement = screen.getByRole('button');
      await user.click(submitButtonElement);

      expect(navigate).toHaveBeenCalled();
    });
  });

  describe('バリデーションエラーがある場合', () => {
    beforeEach(() => {
      postSignIn.mockResolvedValue({
        errors: ['メールアドレス、またはパスワードが異なります。'],
      });
    });

    test('確認画面へ遷移せず、パリデーションエラーが表示される', async () => {
      render(<SignInForm />);

      const submitButtonElement = screen.getByRole('button');

      await user.click(submitButtonElement);
      expect(
        screen.getByText('メールアドレス、またはパスワードが異なります。'),
      ).toBeInTheDocument();
    });
  });
});
