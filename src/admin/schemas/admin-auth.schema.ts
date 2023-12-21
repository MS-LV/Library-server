import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AdminsDocument = HydratedDocument<Admins>;

@Schema({ timestamps: true })
export class Admins {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String, unique: true })
  email: string;

  @Prop({ type: String })
  password: string;
}

export const AdminsSchema = SchemaFactory.createForClass(Admins);
