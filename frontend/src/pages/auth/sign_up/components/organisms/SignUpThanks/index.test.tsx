import { render, screen } from '@testing-library/react';
import { SignUpThanks } from '.';

describe('pages/auth/components/organisms/SignUpThanks', () => {
  test('フォームが表示されること', () => {
    render(<SignUpThanks />);

    screen.getByText('会員登録が完了しました。');
  });
});
