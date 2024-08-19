import { ReactNode } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import ReadingRecordLists from '.';

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
    readingRecords: [
      {
        id: '1',
        title: 'test_title_1',
        author: 'test_author_1',
        bookImage: 'https://emample.com/test_1.png',
        learnedContent: 'test_learned_content_1',
        impression: 'test_impression_1',
        createdAt: '2024-07-02',
      },
      {
        id: '2',
        title: 'test_title_2',
        author: 'test_author_2',
        bookImage: 'https://emample.com/test_2.png',
        learnedContent: 'test_learned_content_2',
        impression: 'test_impression_2',
        createdAt: '2024-07-01',
      },
    ],
    handleDeleteReadingRecord: vi.fn(() => ({ result: true })),
  })),
);
vi.mock('@/contexts/ReadingRecordContext', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@/contexts/ReadingRecordContext')>();
  return {
    ...mod,
    useReadingRecordContext,
  };
});

describe('pages/reading_records/lists/components/organisms/ReadingRecordLists', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('propsで受け取った読書記録が表示されること', () => {
    render(<ReadingRecordLists />);

    // 書籍画像
    expect(screen.getByAltText('test_title_1_書籍画像')).toHaveAttribute(
      'src',
      'https://emample.com/test_1.png',
    );
    // 書籍タイトル
    expect(screen.getByText('test_title_1')).toBeInTheDocument();
    // 登録日
    expect(screen.getByText(/2024-07-02/)).toBeInTheDocument();
  });

  test('編集画面のボタンを押下すると、画面遷移されること', async () => {
    render(<ReadingRecordLists />);

    const editButton = screen.getAllByRole('button', { name: '編集する' });
    await user.click(editButton[0]);

    expect(navigate).toHaveBeenCalled();
  });

  describe('削除ボタンの押下', () => {
    beforeEach(() => {
      // NOTE: window.confirmのモック化
      vi.spyOn(window, 'confirm').mockImplementation(() => true);
    });

    test('確認ダイアログが表示されること', async () => {
      render(<ReadingRecordLists />);

      const editButton = screen.getAllByRole('button', { name: '削除する' });
      await user.click(editButton[0]);

      waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeVisible();
      });
    });

    test('削除された読書記録が表示されなくなること', async () => {
      render(<ReadingRecordLists />);

      const editButton = screen.getAllByRole('button', { name: '削除する' });
      await user.click(editButton[0]);

      waitFor(() => {
        expect(screen.getByText('test_title_1')).not.toBeInTheDocument();
      });
    });

    test('削除成功のスナックバーが表示されること', async () => {
      render(<ReadingRecordLists />);

      const editButton = screen.getAllByRole('button', { name: '削除する' });
      await user.click(editButton[0]);

      waitFor(() => {
        expect(screen.getByText('deleted successfully!!')).not.toBeInTheDocument();
      });
    });
  });
});
