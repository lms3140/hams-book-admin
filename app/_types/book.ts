export type Book = {
  bookId: number;
  title: string;
  subCategoryId: string;
  publisherId: string;
  price: number;
  point?: string;
  publishedDate: Date;
  description?: string;
  authors: string[];
  translators?: string[];
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type RequestBookInfo = {
  bookId?: string;
  title: string;
  category: SelectOpt;
  subCategory: SelectOpt;
  publisher: SelectOpt;
  price: string;
  point: string;
  publishedDate: string;
  description: string;
  imageUrl: string;
  author: SelectOpt[];
};

export type RespBookUpdateData = {
  bookId?: string;
  title: string;
  category: string;
  subCategory: string;
  publisher: string;
  price: string;
  point: string;
  publishedDate: string;
  description: string;
  imageUrl: string;
  author: string[];
};

export type SelectOpt = {
  value: string;
  label: string;
};
