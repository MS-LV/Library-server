import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  // app.use(
  //   fileUpload({
  //     useTempFiles: true,
  //     tempFileDir: path.resolve('book_images'),
  //     safeFileNames: true,
  //   }),
  // );
  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT');
  const IP = configService.get('IP');
  await app.listen(PORT, IP);
  console.log(`http://${IP}:${PORT}`);
}

bootstrap();
