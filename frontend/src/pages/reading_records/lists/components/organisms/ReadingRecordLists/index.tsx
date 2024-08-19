import { BaseButton } from '@/components/atoms/BaseButton';
import { BaseSnackbar } from '@/components/atoms/BaseSnackbar';
import { BookImage } from '@/pages/reading_records/components/atoms/BookImage';
import { BaseLayout } from '@/pages/reading_records/components/organisms/BaseLayout';
import { useReadingRecordContext } from '@/contexts/ReadingRecordContext';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NAVIGATION_PAGE } from '@/constants/navigation';

export default function ReadingRecordLists() {
  const { readingRecords, handleDeleteReadingRecord } = useReadingRecordContext();
  const navigate = useNavigate();

  const handleRouteToEditPage = (id: string) =>
    navigate(`${NAVIGATION_PAGE.readingRecords.edit}/${id}`);

  const [snackbarState, setSnackbarState] = useState<boolean>(false);

  const handleClose = () => {
    setSnackbarState(false);
  };

  const displayableReadingRecords = useMemo(() => readingRecords, [readingRecords]);

  const deleteReadingRecord = useCallback(
    async (id: string) => {
      if (!window.confirm('本当に削除しますか？')) return;

      await handleDeleteReadingRecord(id);
      setSnackbarState(true);
    },
    [handleDeleteReadingRecord],
  );

  return (
    <>
      <BaseLayout>
        <BaseSnackbar open={snackbarState} onClose={handleClose} message='deleted successfully!!' />

        {displayableReadingRecords.length ? (
          displayableReadingRecords.map((readingRecord) => (
            <div
              key={readingRecord.id}
              className='[&:not(:first-child)]:mt-8 border-2 border-gray-900 flex'
            >
              <BookImage
                src={readingRecord.bookImage || '/noimage.png'}
                alt={`${readingRecord.title}_書籍画像`}
                widthStyle='w-1/4'
                additionalImageStyle='md:w-36 md:h-48'
              />
              <div className='w-3/4 h-36 md:h-48 p-2'>
                <div className='text-sm md:text-xl lg:text-3xl break-words'>
                  {readingRecord.title}
                </div>
                <div className='mt-2 text-xs'>登録日: {readingRecord.createdAt}</div>
                <div className='sm:w-1/2 lg:w-2/5 mt-4 flex'>
                  <BaseButton
                    labelText='編集する'
                    color='green'
                    additionalStyle='text-xs lg:text-sm py-1 px-4'
                    onClick={() => handleRouteToEditPage(readingRecord.id)}
                  />
                  <BaseButton
                    labelText='削除する'
                    color='red'
                    additionalStyle='ml-4 text-xs lg:text-sm py-1 px-4'
                    onClick={() => deleteReadingRecord(readingRecord.id)}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className='mt-8'>まだ読書記録が未登録です。</div>
        )}
      </BaseLayout>
    </>
  );
}
