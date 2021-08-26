import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { QrConnectService } from './services/qr-connect/qr-connect.service';
import { AppController } from './controllers/app/app.controller';
import { AuthorizeService } from './services/authorize/authorize.service';
import { JssdkService } from './services/jssdk/jssdk.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  controllers: [AppController],
  providers: [QrConnectService, AuthorizeService, JssdkService],
})
export class AppModule {}
