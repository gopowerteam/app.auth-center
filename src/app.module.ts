import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { WechatController } from './controllers/wechat/wechat.controller';
import { WechatService } from './services/wechat/wechat.service';
import { WeworkController } from './controllers/wework/wework.controller';
import configuration from './config/configuration';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  controllers: [WechatController, WeworkController],
  providers: [WechatService],
})
export class AppModule {}
