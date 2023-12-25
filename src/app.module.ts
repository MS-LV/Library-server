import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RootConfigs } from '../configs/root-configs';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { BookController } from './book/book.controller';
import { BookModule } from './book/book.module';
import * as path from 'path';
import * as process from 'process';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Делает конфигурацию глобальной
      load: [RootConfigs],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('databaseURL'), // Получение URL из конфигурации
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'sources'),
    }),
    UserModule,
    AdminModule,
    BookModule,
  ],
  controllers: [AppController, BookController],
  providers: [AppService],
})
export class AppModule {}
