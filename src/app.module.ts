import { ConfigModule as NestConfigModule } from '@nestjs/config'
import configuration from './config/configuration'
import { CacheModule, Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { QrConnectService } from './services/qr-connect/qr-connect.service'
import { AppController } from './controllers/app/app.controller'
import { WechatService } from './services/wechat/wechat.service'
import { WeworkService } from './services/wework/wework.service'
import { DingtalkService } from './services/dingtalk/dingtalk.service'
import { ApiController } from './controllers/api/api.controller'
import { ConfigModule } from './modules/config/config.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { App } from './entities/app.entity'

@Module({
  imports: [
    HttpModule,
    CacheModule.register(),
    NestConfigModule.forRoot({
      load: [configuration]
    }),
    ConfigModule,
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: './.data/database.sqlite',
      logging: true,
      synchronize: true,
      entities: [App]
    })
  ],
  controllers: [AppController, ApiController],
  providers: [
    QrConnectService,
    WechatService,
    WeworkService,
    DingtalkService
  ]
})
export class AppModule {}
