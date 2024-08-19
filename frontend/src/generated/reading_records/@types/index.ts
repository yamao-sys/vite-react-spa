/* eslint-disable */
/** 読書記録のDTO */
export type ReadingRecordDto = {
  id: number;
  title: string;
  author: string | null;
  bookImage: string | null;
  learnedContent: string | null;
  impression: string | null;
  createdAt: string;
};

/** 読書記録作成のrequest DTO */
export type CreateReadingRecordDto = {
  title: string;
  author?: string | null | undefined;
  bookImage?: string | null | undefined;
  learnedContent?: string | null | undefined;
  impression?: string | null | undefined;
};

/** 読書記録のDTO */
export type CreateReadingRecordResponseDto = {
  id: number;
  title: string;
  author: string | null;
  bookImage: string | null;
  learnedContent: string | null;
  impression: string | null;
  createdAt: string;
};

/** 読書記録の作成のレスポンスDTO */
export type FetchAllReadingRecordResponseDto = {
  id: number;
  title: string;
  author: string | null;
  bookImage: string | null;
  learnedContent: string | null;
  impression: string | null;
  createdAt: string;
}[];

/** 読書記録のDTO */
export type FetchReadingRecordResponseDto = {
  id: number;
  title: string;
  author: string | null;
  bookImage: string | null;
  learnedContent: string | null;
  impression: string | null;
  createdAt: string;
};

/** 読書記録更新のrequest DTO */
export type UpdateReadingRecordDto = {
  title: string;
  author: string | null;
  learnedContent: string | null;
  impression: string | null;
};

/** 読書記録のDTO */
export type UpdateReadingRecordResponseDto = {
  id: number;
  title: string;
  author: string | null;
  bookImage: string | null;
  learnedContent: string | null;
  impression: string | null;
  createdAt: string;
};

/** 読書記録の削除のレスポンスDTO */
export type DeleteReadingRecordResponseDto = {
  result: boolean;
};
