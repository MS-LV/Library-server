import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './schemas/book.schema';
import { Model } from 'mongoose';
import { IAddBookBody, IAddBookDto } from './book.interface';

@Injectable()
export class BookService {
  constructor(@InjectModel(Book.name) private bookModel: Model<Book>) {}

  createBook(body: any, images: Array<Express.Multer.File>): Promise<Book> {
    const addBookDto = this.normalizeBody(body, images);
    const createBook = new this.bookModel(addBookDto);
    return createBook.save();
  }

  getAllBooks(
    filter: object = {},
    projection: object = {},
    limit: number = Infinity,
  ): Promise<Book[]> {
    return this.bookModel.find(filter, projection).limit(limit).exec();
  }

  getBook(id: string, projection: object = {}): Promise<Book> {
    return this.bookModel.findById(id, projection);
  }

  deleteBook(id: string) {
    return this.bookModel.findByIdAndDelete(id);
  }

  private normalizeBody(
    body: IAddBookBody,
    images: Array<Express.Multer.File>,
  ): IAddBookDto {
    const book = JSON.parse(body.book);
    const {
      alternate_name,
      author,
      bookGenres,
      bookName,
      bookTags,
      country,
      descriptionText,
      released,
      status,
      type,
      translating,
    } = body;
    const addBookDto: IAddBookDto = {
      alternate_name,
      author,
      book,
      bookGenres: bookGenres.split(',').map((genre: string) => genre.trim()),
      bookName,
      bookTags: bookTags.split(',').map((tag: string) => tag.trim()),
      chapterLength: book.length,
      country,
      descriptionText,
      file: this.filterFiles(images, 'file'),
      released,
      status,
      type,
      translating,
      images: this.filterFiles(images, 'img-'),
    };
    return addBookDto;
  }

  private filterFiles(files: Express.Multer.File[], patter: string) {
    const regex = new RegExp(`^${patter}`, 'gi');
    const filter = files.filter((file) => file.fieldname.match(regex));
    return this.getNameFiles(filter);
  }

  private getNameFiles(files: Express.Multer.File[]): string[] {
    return files.map((file) => file.filename.split('/').at(-1));
  }
}
