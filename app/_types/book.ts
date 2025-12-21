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
  title: string;
  categoryId: SelectOpt;
  subCategoryId: SelectOpt;
  publisherId: SelectOpt;
  price: string;
  point: string;
  publishedDate: string;
  description: string;
  imageUrl: string;
  authorId: SelectOpt[];
};

export type SelectOpt = {
  value: string;
  label: string;
};
