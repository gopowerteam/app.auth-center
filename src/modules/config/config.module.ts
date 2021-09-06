import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './controllers/app/app.controller'
import { AppService } from './services/app/app.service'
import { StorageController } from './controllers/storage/storage.controller'
import { StorageService } from './services/storage/storage.service'
import { App } from 'src/entities/app.entity'
import { Storage } from 'src/entities/storage.entity'

@Module({
  imports: [TypeOrmModule.forFeature([App, Storage])],
  controllers: [AppController, StorageController],
  providers: [AppService, StorageService],
  exports: [AppService, StorageService, TypeOrmModule]
})
export class ConfigModule {}
