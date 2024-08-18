import { ReactNode } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import ReadingRecordCreate from '.';

// userのセットアップ
const user = userEvent.setup();

const navigate = vi.hoisted(() => vi.fn(() => vi.fn()));
type linkProps = {
  children: ReactNode;
  to: string;
};
vi.mock('react-router-dom', async () => {
  const reactRouterDom = await vi.importActual('react-router-dom');
  return {
    ...reactRouterDom,
    useNavigate: navigate,
    Link: ({ children, to }: linkProps) => <a href={to}>{children}</a>,
  };
});

const useReadingRecordContext = vi.hoisted(() =>
  vi.fn(() => ({
    readingRecords: [],
    handleCreateReadingRecord: vi.fn(),
    handleDeleteReadingRecord: vi.fn(),
  })),
);
vi.mock('@/contexts/ReadingRecordContext', async (importOriginal) => {
  const mod = importOriginal<typeof import('@/contexts/ReadingRecordContext')>();
  return {
    ...mod,
    useReadingRecordContext,
  };
});

const searchBooks = vi.hoisted(() =>
  vi.fn(() => [
    {
      title: 'test_title',
      author: 'test_author',
      bookImageUrl: 'https://example.com/test.jpg',
    },
  ]),
);
vi.mock('@/apis/searchBooksApi', async (importOriginal) => {
  const mod = importOriginal<typeof import('@/apis/searchBooksApi')>();
  return {
    ...mod,
    searchBooks,
  };
});

describe('pages/reading_records/new/components/ReadingRecordCreate', () => {
  test('フォームが表示されること', () => {
    render(<ReadingRecordCreate />);

    expect(screen.getByLabelText('書籍検索')).toBeInTheDocument();
    expect(screen.getByLabelText('本のタイトル')).toBeInTheDocument();
    expect(screen.getByLabelText('著者')).toBeInTheDocument();
    expect(screen.getByLabelText('学んだこと')).toBeInTheDocument();
    expect(screen.getByLabelText('感想')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: '保存する' })).toBeInTheDocument();
  });

  test('フォームに入力が反映されること', async () => {
    render(<ReadingRecordCreate />);

    const titleInput = screen.getByLabelText('本のタイトル');
    await user.type(titleInput, 'test_title');
    expect(screen.getByLabelText('本のタイトル')).toHaveDisplayValue('test_title');

    const authorInput = screen.getByLabelText('著者');
    await user.type(authorInput, 'test_author');
    expect(screen.getByLabelText('著者')).toHaveDisplayValue('test_author');

    const learnedContentInput = screen.getByLabelText('学んだこと');
    await user.type(learnedContentInput, 'test_learned_content');
    expect(screen.getByLabelText('学んだこと')).toHaveDisplayValue('test_learned_content');

    const impressionInput = screen.getByLabelText('感想');
    await user.type(impressionInput, 'test_impression');
    expect(screen.getByLabelText('感想')).toHaveDisplayValue('test_impression');
  });

  describe('書籍検索', () => {
    test('書籍検索ができ、その内容でフォームが入力できること', async () => {
      render(<ReadingRecordCreate />);

      const searchBooksInput = screen.getByLabelText('書籍検索');
      await user.type(searchBooksInput, 'test_');
      expect(screen.getByLabelText('書籍検索')).toHaveDisplayValue('test_');

      // NOTE: 検索結果が表示される、それを選択するとフォームに反映されること
      await waitFor(async () => {
        await user.click(screen.getByText('test_title'));
      });
      expect(screen.getByLabelText('本のタイトル')).toHaveDisplayValue('test_title');
      expect(screen.getByLabelText('著者')).toHaveDisplayValue('test_author');
      expect(screen.getByAltText('書籍画像')).toHaveAttribute(
        'src',
        'https://example.com/test.jpg',
      );
    });
  });

  describe('読書記録の保存', () => {
    test('フォームに入力した内容で読書記録を登録できること', async () => {
      render(<ReadingRecordCreate />);

      const titleInput = screen.getByLabelText('本のタイトル');
      await user.type(titleInput, 'test_title');

      const authorInput = screen.getByLabelText('著者');
      await user.type(authorInput, 'test_author');

      const learnedContentInput = screen.getByLabelText('学んだこと');
      await user.type(learnedContentInput, 'test_learned_content');

      const impressionInput = screen.getByLabelText('感想');
      await user.type(impressionInput, 'test_impression');

      const submitButton = screen.getByRole('button', { name: '保存する' });
      await user.click(submitButton);
      await waitFor(() => {
        expect(screen.getByText('saved successfully!!')).toBeInTheDocument();
      });
    });

    test('書籍検索で入力された内容で保存ボタンを押下すると、保存に成功し画面遷移されること', async () => {
      render(<ReadingRecordCreate />);

      const searchBooksInput = screen.getByLabelText('書籍検索');
      await user.type(searchBooksInput, 'test_');

      // NOTE: 検索結果が表示される、それを選択するとフォームに反映されること
      await waitFor(async () => {
        await user.click(screen.getByText('test_title'));
      });
      expect(screen.getByLabelText('本のタイトル')).toHaveDisplayValue('test_title');
      expect(screen.getByLabelText('著者')).toHaveDisplayValue('test_author');
      expect(screen.getByAltText('書籍画像')).toHaveAttribute(
        'src',
        'https://example.com/test.jpg',
      );

      const learnedContentInput = screen.getByLabelText('学んだこと');
      await user.type(learnedContentInput, 'test_learned_content');

      const impressionInput = screen.getByLabelText('感想');
      await user.type(impressionInput, 'test_impression');

      const submitButton = screen.getByRole('button', { name: '保存する' });
      await user.click(submitButton);
      await waitFor(() => {
        expect(screen.getByText('saved successfully!!')).toBeInTheDocument();
      });
    });
  });
});
