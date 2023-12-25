import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { IAdminDto, IAdminLogDto } from './dto/admin.dto';
import { JwtTokenService } from '../shared/services/jwt-token.service';
import { AdminService } from './admin.service';
import { errorHandler } from '../utils/error.utils';

@Controller('admin')
export class AdminController {
  constructor(
    private service: AdminService,
    private JWTService: JwtTokenService,
  ) {}

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async createAdmin(@Body() body: IAdminDto) {
    try {
      const adminInfo = await this.service.createAdmin(body);
      adminInfo.password = body.password = undefined;
      const token = await this.JWTService.genAdminAccessToken(body);
      return { token, adminInfo };
    } catch (e) {
      return errorHandler(e);
    }
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async loginAdmin(@Body() body: IAdminLogDto) {
    try {
      const adminInfo = await this.service.verifyAdmin(body);
      adminInfo.password = body.password = undefined;
      const token = await this.JWTService.genAdminAccessToken(body);
      return { adminInfo, token };
    } catch (e) {
      return errorHandler(e);
    }
  }

  @Get('/verify')
  @HttpCode(HttpStatus.OK)
  verifyAdmin(@Headers() headers: any) {
    try {
      const token = headers.authorization;
      const payload = this.JWTService.verifyAdminToken(token);
      return !!payload;
    } catch (e) {
      return errorHandler(e);
    }
  }

  @Get('')
  isWorked() {
    return 'Admin route working';
  }
}
