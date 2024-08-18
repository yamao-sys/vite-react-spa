import { render, screen } from '@testing-library/react';
import { BookImage } from '.';

describe('pages/reading_records/components/atoms/BookImage', () => {
  test('Propsで渡された内容で画像が表示できること(必須部分のみ)', () => {
    render(<BookImage src='https://example.com/test.jpg' alt='テスト画像' widthStyle='w-full' />);

    expect(screen.getByAltText('テスト画像')).toHaveAttribute(
      'src',
      'https://example.com/test.jpg',
    );
  });

  test('Propsで渡された内容で画像が表示できること(任意項目あり)', () => {
    render(
      <BookImage
        src='https://example.com/test.jpg'
        alt='テスト画像'
        widthStyle='w-full'
        additionalImageStyle='md:w-36 md:h-48'
      />,
    );

    expect(screen.getByAltText('テスト画像')).toHaveAttribute(
      'src',
      'https://example.com/test.jpg',
    );
  });
});
