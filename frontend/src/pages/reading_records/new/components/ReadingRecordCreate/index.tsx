import { searchBooks } from '@/apis/searchBooksApi';
import { BaseFormBox } from '@/components/atoms/BaseFormBox';
import { BaseSnackbar } from '@/components/atoms/BaseSnackbar';
import { InputForm } from '@/components/atoms/InputForm';
import { TextAreaForm } from '@/components/atoms/TextAreaForm';
import { SubmitButton } from '@/components/molecules/SubmitButton';
import { NAVIGATION_PAGE } from '@/constants/navigation';
import { useReadingRecordContext } from '@/contexts/ReadingRecordContext';
import { CreateReadingRecordDto } from '@/generated/reading_records/@types';
import { SearchBooksResponseDto, SearchBooksResultDto } from '@/generated/search_books/@types';
import { BookImage } from '@/pages/reading_records/components/atoms/BookImage';
import { BaseFormLayout } from '@/pages/reading_records/components/organisms/BaseFormLayout';
import { BaseLayout } from '@/pages/reading_records/components/organisms/BaseLayout';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'react-use';

export default function ReadingRecordCreate() {
  const { handleCreateReadingRecord } = useReadingRecordContext();

  const [inputReadingRecord, setInputReadingRecord] = useState<CreateReadingRecordDto>({
    title: '',
    author: null,
    learnedContent: null,
    bookImage: null,
    impression: null,
  });

  const updateInputReadingRecord = (params: Partial<CreateReadingRecordDto>) => {
    setInputReadingRecord({ ...inputReadingRecord, ...params });
  };

  const [inputSearchBooks, setInputSearchBooks] = useState<string>('');
  const [suggestions, setSuggestions] = useState<SearchBooksResponseDto>([]);

  useDebounce(
    async () => {
      if (!inputSearchBooks) return;

      const res = await searchBooks(inputSearchBooks);
      setSuggestions(res);
    },
    500,
    [inputSearchBooks],
  );

  const setBookInfo = (suggestion: SearchBooksResultDto) => {
    updateInputReadingRecord({
      title: suggestion.title,
      author: suggestion.author,
      bookImage: suggestion.bookImageUrl,
    });
    setSuggestions([]);
  };

  const hundleSubmit = async () => {
    await handleCreateReadingRecord(inputReadingRecord);
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
          <div className='relative'>
            <InputForm
              labelId='search-books'
              labelText='書籍検索'
              value={inputSearchBooks}
              onChange={(e) => setInputSearchBooks(e.target.value)}
            />
            {!!suggestions.length && (
              <ul className='absolute bg-white w-full z-10'>
                {suggestions.map((suggestion, i) => (
                  <li key={i} onClick={() => setBookInfo(suggestion)}>
                    {suggestion.title}
                  </li>
                ))}
              </ul>
            )}
          </div>

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
}
