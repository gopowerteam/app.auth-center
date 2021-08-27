import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { CacheModule, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { QrConnectService } from './services/qr-connect/qr-connect.service';
import { AppController } from './controllers/app/app.controller';
import { WechatService } from './services/wechat/wechat.service';
import { WeworkService } from './services/wework/wework.service';
import { DingtalkService } from './services/dingtalk/dingtalk.service';

@Module({
  imports: [
    HttpModule,
    CacheModule.register(),
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  controllers: [AppController],
  providers: [QrConnectService, WechatService, WeworkService, DingtalkService],
})
export class AppModule {}
