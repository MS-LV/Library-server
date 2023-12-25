import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { IBookChapter } from '../book.interface';

export type AddBookDocument = HydratedDocument<Book>;

@Schema({ timestamps: true })
export class Book {
  @Prop({ type: String, required: true })
  author: string;

  @Prop({ type: String })
  alternate_name: string;

  @Prop([{ type: Object }])
  book: IBookChapter[];

  @Prop({ type: [String] })
  bookGenres: string[];

  @Prop({ type: String, required: true, unique: true })
  bookName: string;

  @Prop({ type: [String] })
  bookTags: string[];

  @Prop({ type: Number })
  chapterLength: number;

  @Prop({ type: String, required: true })
  country: string;

  @Prop({ type: String, required: true })
  descriptionText: string;

  @Prop({ type: [String], required: true })
  file: string[];

  @Prop({ type: [String] })
  images: string[];

  @Prop({ type: Date, required: true })
  released: Date;

  @Prop({ type: String, required: true })
  status: string;

  @Prop({ type: String, required: true })
  translating: string;

  @Prop({ type: String, required: true })
  type: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);
