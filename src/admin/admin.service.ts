import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admins } from './schemas/admin-auth.schema';
import { IAdminDto, IAdminLogDto } from './dto/admin.dto';
import { MessageConstants } from '../constants/request-message.constants';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admins.name) private adminsModel: Model<Admins>,
    private config: ConfigService,
  ) {}

  async createAdmin(adminDto: IAdminDto): Promise<Admins> {
    const accessKey = this.config.get('adminAccessKey');
    if (accessKey !== adminDto.accessKey) {
      throw new Error('Вы указали неправильный ключ доступа !');
    }
    adminDto.password = await this.hashPassword(adminDto.password);
    const createAdmin = new this.adminsModel(adminDto);
    return createAdmin.save();
  }

  async verifyAdmin(adminDto: IAdminLogDto) {
    const admin = await this.adminsModel.findOne({ email: adminDto.email });
    if (!admin) {
      throw new Error(MessageConstants.incorrectEmail);
    }
    const isEqualPass = await this.comparePassword(adminDto.password, admin.password);
    if (!isEqualPass) {
      throw new Error(MessageConstants.incorrectPassword);
    }
    admin.password = undefined;
    return admin;
  }

  private hashPassword(password: string): Promise<string> {
    const hashSalt = this.config.get('hashSalt');
    return bcrypt.hash(password, hashSalt);
  }

  private comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
