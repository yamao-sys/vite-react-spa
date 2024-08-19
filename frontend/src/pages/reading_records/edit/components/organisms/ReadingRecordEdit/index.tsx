import { BaseFormBox } from '@/components/atoms/BaseFormBox';
import { BaseSnackbar } from '@/components/atoms/BaseSnackbar';
import { InputForm } from '@/components/atoms/InputForm';
import { TextAreaForm } from '@/components/atoms/TextAreaForm';
import { SubmitButton } from '@/components/molecules/SubmitButton';
import { NAVIGATION_PAGE } from '@/constants/navigation';
import { useReadingRecordContext } from '@/contexts/ReadingRecordContext';
import { ReadingRecordDto, UpdateReadingRecordDto } from '@/generated/reading_records/@types';
import { BookImage } from '@/pages/reading_records/components/atoms/BookImage';
import { BaseFormLayout } from '@/pages/reading_records/components/organisms/BaseFormLayout';
import { BaseLayout } from '@/pages/reading_records/components/organisms/BaseLayout';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const ReadingRecordEdit = () => {
  const { readingRecords, handleUpdateReadingRecord } = useReadingRecordContext();

  const urlParams = useParams();
  const targetId = useMemo(() => urlParams.id, [urlParams]);
  if (!targetId) throw new Error('Invalid Param');

  const targetReadingRecord = useMemo(
    () => readingRecords.find((readingRecord) => readingRecord.id === Number(targetId)),
    [readingRecords, targetId],
  );
  if (!targetReadingRecord) throw new Error('Not Found Reading Record');

  const [inputReadingRecord, setInputReadingRecord] =
    useState<ReadingRecordDto>(targetReadingRecord);

  const updateInputReadingRecord = (params: Partial<UpdateReadingRecordDto>) => {
    setInputReadingRecord({ ...inputReadingRecord, ...params });
  };

  const hundleSubmit = async () => {
    await handleUpdateReadingRecord(targetId, {
      title: inputReadingRecord.title,
      author: inputReadingRecord.author,
      learnedContent: inputReadingRecord.learnedContent,
      impression: inputReadingRecord.impression,
    });
    setSnackbarState(true);
  };

  const [snackbarState, setSnackbarState] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleClose = () => {
    setSnackbarState(false);
    navigate(NAVIGATION_PAGE.readingRecords.list);
  };

  const bookImg = useMemo(() => {
    if (inputReadingRecord.bookImage) return inputReadingRecord.bookImage;

    return '/noimage.png';
  }, [inputReadingRecord]);

  return (
    <>
      <BaseLayout>
        <BaseSnackbar open={snackbarState} onClose={handleClose} message='saved successfully!!' />

        <BaseFormLayout additionalStyle='z-10'>
          <BaseFormBox>
            <BookImage src={bookImg} alt='書籍画像' widthStyle='w-full' />
          </BaseFormBox>

          <BaseFormBox>
            <InputForm
              labelId='title'
              labelText='本のタイトル'
              value={inputReadingRecord.title}
              onChange={(e) => updateInputReadingRecord({ title: e.target.value })}
            />
          </BaseFormBox>

          <BaseFormBox>
            <InputForm
              labelId='author'
              labelText='著者'
              value={inputReadingRecord.author ?? ''}
              onChange={(e) => updateInputReadingRecord({ author: e.target.value })}
            />
          </BaseFormBox>

          <BaseFormBox>
            <TextAreaForm
              labelId='learned-content'
              labelText='学んだこと'
              value={inputReadingRecord.learnedContent ?? ''}
              onChange={(e) => updateInputReadingRecord({ learnedContent: e.target.value })}
            />
          </BaseFormBox>

          <BaseFormBox>
            <TextAreaForm
              labelId='impression'
              labelText='感想'
              value={inputReadingRecord.impression ?? ''}
              onChange={(e) => updateInputReadingRecord({ impression: e.target.value })}
            />
          </BaseFormBox>

          <SubmitButton labelText='保存する' color='green' onClick={hundleSubmit} />
        </BaseFormLayout>
      </BaseLayout>
    </>
  );
};
