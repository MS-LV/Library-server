export interface IAddBookForm {
  author: string;
  bookGenres: string[];
  bookTags: string[];
  descriptionText: string;
  alternate_name: string;
  published: string;
  country: string[];
  files: FormData;
}

export interface IBookLine {
  dir: string;
  str: string;
}

export type IBookPage = IBookLine[];

export interface IBookChapter {
  startPage: number;
  endPage: number;
  title: string;
  content: IBookPage[];
}

export interface IAddBookDto {
  alternate_name: string;
  author: string;
  book: IBookChapter;
  bookGenres: string[];
  bookTags: string[];
  bookName: string;
  chapterLength: number;
  country: string;
  file: string[];
  descriptionText: string;
  images: string[];
  released: Date;
  status: string;
  type: string;
  translating: string;
}

export interface IAddBookBody {
  alternate_name: string;
  author: string;
  book: string;
  bookGenres: string;
  bookName: string;
  bookTags: string;
  country: string;
  descriptionText: string;
  released: Date;
  status: string;
  translating: string;
  type: string;
}
