export interface Book {
  title: string;
  author: string;
  publisher: string;
  price: number;
}

export interface BookApiResponseItem {
  title: string;
  author: string;
  mediumImageUrl: string;
}

export interface BookItem {
  title: string;
  author: string;
  bookImageUrl: string;
}

export interface BookApiResponse {
  Items: {
    Item: BookApiResponseItem;
  }[];
}
