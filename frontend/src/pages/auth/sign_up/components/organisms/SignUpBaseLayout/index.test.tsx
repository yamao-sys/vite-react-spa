import { render, screen } from '@testing-library/react';
import { SignUpBaseLayout } from '.';

describe('pages/auth/sign_up/components/organisms/SignUpBaseLayout', () => {
  test('フェーズが表示されること', () => {
    render(
      <SignUpBaseLayout phase='form'>
        <div>test</div>
      </SignUpBaseLayout>,
    );

    screen.getByText('登録情報の入力');
    screen.getByText('登録情報の確認');
    screen.getByText('登録完了');
  });

  it('子要素が表示されること', () => {
    render(
      <SignUpBaseLayout phase='form'>
        <div>test</div>
      </SignUpBaseLayout>,
    );

    screen.getByText('test');
  });
});
