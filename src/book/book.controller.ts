import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import * as express from 'express';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Error } from 'mongoose';
import { errorHandler } from '../utils/error.utils';
import { IAddBookForm } from './book.interface';
import { BookService } from './book.service';
import { Book } from './schemas/book.schema';
import { AdminGuard } from '../guards/admin/admin.guard';
import { AuthGuard } from '../guards/auth/auth.guard';

const projection = {
  author: 1,
  bookGenres: 1,
  bookName: 1,
  country: 1,
  chapterLength: 1,
  createdAt: 1,
  images: 1,
  status: 1,
};
const limit = 9;

@Controller('books')
export class BookController {
  constructor(private service: BookService) {}

  @Get()
  @UseGuards(AuthGuard)
  getAllBooks(@Query('query') query: string) {
    try {
      let filter = {};
      if (query) {
        const pattern = query.slice(0, -1);
        const param = new RegExp(pattern, 'i');
        filter = { bookName: { $regex: param } };
      }
      return this.service.getAllBooks(filter, projection, limit);
    } catch (e) {
      return errorHandler(e);
    }
  }

  @Get('lazy')
  // @UseGuards(AuthGuard)
  getLazyList() {
    try {
      return this.service.getLazyBookList();
    } catch (e) {
      errorHandler(e);
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  getBook(@Param('id') id: string) {
    try {
      const moreProps = {
        alternate_name: 1,
        bookTags: 1,
        descriptionText: 1,
        released: 1,
        type: 1,
        translating: 1,
        'book.title': 1,
      };
      const projectionOne = Object.assign({}, projection, moreProps);
      return this.service.getBook(id, projectionOne);
    } catch (e) {
      return errorHandler(e);
    }
  }

  @Get(':id/:chapter')
  getChapter(@Param() params: { id: string; chapter: number }) {
    const bookID = params.id;
    const chapter = +params.chapter;
    const projectionMap = { bookName: 1 };
    return this.service.getBook(bookID, {
      book: { $slice: [chapter, 1] },
      ...projectionMap,
    });
  }

  @Post()
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: './sources/',
        filename(
          req: express.Request,
          file: Express.Multer.File,
          cb: (error: Error | null, filename: string) => void,
        ) {
          cb(null, generateRandomName(file));
        },
      }),
      limits: {
        fieldSize: 25 * 1024 * 1024,
      },
    }),
  )
  async createBook(
    @Body() body: IAddBookForm,
    @UploadedFiles() imagesList: Array<Express.Multer.File>,
  ): Promise<Book | string> {
    try {
      return await this.service.createBook(body, imagesList);
    } catch (e) {
      return errorHandler(e);
    }
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.deleteBook(id);
  }
}

function generateRandomName(file: Express.Multer.File): string {
  const originalName = file.originalname;
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const dateNow = Date.now();
  const extension = originalName.match(/\.\w+$/)[0];
  const randomWord = characters
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');

  let folder = '';
  if (!file.mimetype.match(/^image/g)) {
    folder = 'books/';
  } else {
    folder = 'book-images/';
  }
  return `${folder}/${dateNow}-${randomWord}${extension}`;
}

// @Get('image/:id')
// getImage(@Param('id') id: string, @Res() res: Response) {
//   const rootPath = `${process.cwd()}`;
//   const fileName =
//     '1702188750967-R6fnjF2HJD5k4IMgNqA8BVPyOELxmwtZlico9z3QeYCUGsTXvauhbK0rWpSd71.jpg';
//   const filePath = `${rootPath}/sources/book-images/${fileName}`;
//   const stat = fs.statSync(filePath);
//   console.log(path.join(process.cwd(), 'sources', 'book-images'));
//
//   res.setHeader('Content-Length', stat.size);
//   res.setHeader('Content-Type', 'application/octet-stream');
//   res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
//
//   const fileStream = fs.createReadStream(filePath);
//   fileStream.pipe(res);
// }
