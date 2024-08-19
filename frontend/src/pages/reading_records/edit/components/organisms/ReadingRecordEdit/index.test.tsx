import { ReactNode } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ReadingRecordEdit } from '.';

// userのセットアップ
const user = userEvent.setup();

const useReadingRecordContext = vi.hoisted(() =>
  vi.fn(() => ({
    readingRecords: [
      {
        id: 1,
        title: 'test_title_1',
        author: 'test_author_1',
        bookImage: 'https://emample.com/test_1.png',
        learnedContent: 'test_learned_content_1',
        impression: 'test_impression_1',
        createdAt: '2024-07-02',
      },
    ],
    handleUpdateReadingRecord: vi.fn(),
  })),
);
vi.mock('@/contexts/ReadingRecordContext', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@/contexts/ReadingRecordContext')>();
  return {
    ...mod,
    useReadingRecordContext,
  };
});

const useParams = vi.hoisted(() => vi.fn(() => ({ id: '1' })));
const navigate = vi.hoisted(() => vi.fn(() => vi.fn()));
type linkProps = {
  children: ReactNode;
  to: string;
};
vi.mock('react-router-dom', async () => {
  const reactRouterDom = await vi.importActual('react-router-dom');
  return {
    ...reactRouterDom,
    useParams,
    useNavigate: navigate,
    Link: ({ children, to }: linkProps) => <a href={to}>{children}</a>,
  };
});

describe('pages/reading_records/edit/components/organisms/ReadingRecordEdit', () => {
  test('フォームが表示されること', () => {
    render(<ReadingRecordEdit />);

    // NOTE: 編集画面に書籍検索はない
    expect(screen.queryByLabelText('書籍検索')).not.toBeInTheDocument();

    expect(screen.getByLabelText('本のタイトル')).toBeInTheDocument();
    expect(screen.getByLabelText('著者')).toBeInTheDocument();
    expect(screen.getByLabelText('学んだこと')).toBeInTheDocument();
    expect(screen.getByLabelText('感想')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: '保存する' })).toBeInTheDocument();
  });

  test('フォームに入力が反映されること', async () => {
    render(<ReadingRecordEdit />);

    const titleInput = screen.getByLabelText('本のタイトル');
    await user.type(titleInput, '_edited');
    expect(screen.getByLabelText('本のタイトル')).toHaveDisplayValue('test_title_1_edited');

    const authorInput = screen.getByLabelText('著者');
    await user.type(authorInput, '_edited');
    expect(screen.getByLabelText('著者')).toHaveDisplayValue('test_author_1_edited');

    const learnedContentInput = screen.getByLabelText('学んだこと');
    await user.type(learnedContentInput, '_edited');
    expect(screen.getByLabelText('学んだこと')).toHaveDisplayValue('test_learned_content_1_edited');

    const impressionInput = screen.getByLabelText('感想');
    await user.type(impressionInput, '_edited');
    expect(screen.getByLabelText('感想')).toHaveDisplayValue('test_impression_1_edited');
  });

  test('フォームに入力した内容で読書記録を登録できること', async () => {
    render(<ReadingRecordEdit />);

    const titleInput = screen.getByLabelText('本のタイトル');
    await user.type(titleInput, '_edited');

    const authorInput = screen.getByLabelText('著者');
    await user.type(authorInput, '_edited');

    const learnedContentInput = screen.getByLabelText('学んだこと');
    await user.type(learnedContentInput, '_edited');

    const impressionInput = screen.getByLabelText('感想');
    await user.type(impressionInput, '_edited');

    const submitButton = screen.getByRole('button', { name: '保存する' });
    await user.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText('saved successfully!!')).toBeInTheDocument();
    });
  });
});
