import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { QrConnectService } from './services/qr-connect/qr-connect.service';
import { AppController } from './controllers/app/app.controller';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  controllers: [AppController],
  providers: [QrConnectService],
})
export class AppModule {}
