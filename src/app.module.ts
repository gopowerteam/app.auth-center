import { ConfigModule as NestConfigModule } from '@nestjs/config'
import configuration from './config/configuration'
import { CacheModule, Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { AppController } from './controllers/app/app.controller'
import { WechatService } from './services/wechat/wechat.service'
import { WeworkService } from './services/wework/wework.service'
import { DingtalkService } from './services/dingtalk/dingtalk.service'
import { ConfigModule } from './modules/config/config.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { App } from './entities/app.entity'
import { Storage } from './entities/storage.entity'
import { CosService } from './services/cos/cos.service'
import { HomeController } from './controllers/home/home.controller'
import { StorageController } from './controllers/storage/storage.controller'

@Module({
  imports: [
    HttpModule,
    CacheModule.register(),
    NestConfigModule.forRoot({
      load: [configuration]
    }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: './.data/database.sqlite',
      logging: true,
      synchronize: true,
      entities: [App, Storage]
    }),
    ConfigModule
  ],
  controllers: [
    HomeController,
    AppController,
    StorageController
  ],
  providers: [
    WechatService,
    WeworkService,
    DingtalkService,
    CosService
  ]
})
export class AppModule {}
