import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { Users } from './schemas/user.schema';
import { IUserDto, IUserLoginDto } from './dto/user.dto';
import { MessageConstants } from '../constants/request-message.constants';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Users.name) private usersModel: Model<Users>,
    private config: ConfigService,
  ) {}

  async createUser(userDto: IUserDto): Promise<Users> {
    userDto.password = await this.hashPassword(userDto.password);
    const createUser = new this.usersModel(userDto);
    return createUser.save();
  }

  async verifyUser(userDto: IUserLoginDto): Promise<Users> {
    const user = await this.usersModel.findOne({ email: userDto.email });
    if (!user) {
      throw new Error(MessageConstants.incorrectEmail);
      // throw new Error(MessageConstants.incorrectEmail);
    }
    const isEqualPass = await this.comparePassword(
      userDto.password,
      user.password,
    );
    if (!isEqualPass) {
      throw new Error(MessageConstants.incorrectPassword);
    }
    user.password = undefined;
    return user;
  }

  getAllUsers(filter: object = {}, projection: object = {}): Promise<Users[]> {
    return this.usersModel.find(filter, projection).exec();
  }

  getUserByID(id: string, projection: object = {}) {
    return this.usersModel.findById(id, projection);
  }

  deleteUserByID(id: string) {
    return this.usersModel.findByIdAndDelete(id, { new: true });
  }

  private comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  private hashPassword(password: string): Promise<string> {
    const hashSalt = this.config.get('hashSalt');
    return bcrypt.hash(password, hashSalt);
  }
}
