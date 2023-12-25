import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Admins, AdminsSchema } from './schemas/admin-auth.schema';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admins.name, schema: AdminsSchema }]),
    SharedModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [],
})
export class AdminModule {}
