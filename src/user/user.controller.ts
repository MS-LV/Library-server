import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { IUserDto, IUserLoginDto, IUserResponse } from './dto/user.dto';
import { UserService } from './user.service';
import { JwtTokenService } from '../shared/services/jwt-token.service';
import { errorHandler } from '../utils/error.utils';
import { AdminGuard } from '../guards/admin/admin.guard';

@Controller('users')
export class UserController {
  constructor(
    private service: UserService,
    private JWTService: JwtTokenService,
  ) {}

  @Get()
  @UseGuards(AdminGuard)
  getAllUsers() {
    const projection = {
      name: 1,
      email: 1,
      createdAt: 1,
    };
    return this.service.getAllUsers({}, projection);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  deleteUser(@Param('id') id: string) {
    return this.service.deleteUserByID(id);
  }

  @Get('/verify')
  verifyUser(@Headers() headers: Headers | any) {
    try {
      const token = headers.authorization;
      const payload = this.JWTService.verifyToken(token);
      return !!payload;
    } catch (e) {
      return false;
    }
  }

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() body: IUserDto): Promise<IUserResponse | string> {
    try {
      const token = await this.JWTService.genAccessToken(body);
      const userInfo = await this.service.createUser(body);
      userInfo.password = undefined;
      return { token, userInfo };
    } catch (e) {
      return errorHandler(e);
    }
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async loginUser(
    @Body() body: IUserLoginDto,
  ): Promise<IUserResponse | string> {
    try {
      const userInfo = await this.service.verifyUser(body);
      const token = await this.JWTService.genAccessToken(body);
      return { token, userInfo };
    } catch (e) {
      return errorHandler(e);
    }
  }
}
