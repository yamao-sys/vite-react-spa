import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { SignUpConfirmation } from '.';

// userのセットアップ
const user = userEvent.setup();

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

const postSignUp = vi.hoisted(() => vi.fn(() => true));
vi.mock('@/apis/authApi', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@/apis/authApi')>();
  return {
    ...mod,
    postSignUp,
  };
});

const togglePhase = vi.fn();

describe('pages/auth/sign_up/components/organisms/SignUpConfirmation', () => {
  test('フォームが表示されること', () => {
    render(<SignUpConfirmation togglePhase={togglePhase} />);

    screen.getByText('test_name');
    screen.getByText('test@example.com');
    screen.getByText('********');

    screen.getByRole('button', { name: '入力へ戻る' });
    screen.getByRole('button', { name: '登録する' });
  });

  test('サンクス画面へ遷移できる', async () => {
    render(<SignUpConfirmation togglePhase={togglePhase} />);

    const submitButtonElement = screen.getByRole('button', {
      name: '登録する',
    });
    await user.click(submitButtonElement);

    expect(togglePhase).toHaveBeenCalled();
  });

  test('入力画面へ遷移できる', async () => {
    render(<SignUpConfirmation togglePhase={togglePhase} />);

    const submitButtonElement = screen.getByRole('button', {
      name: '入力へ戻る',
    });
    await user.click(submitButtonElement);

    expect(togglePhase).toHaveBeenCalled();
  });
});
