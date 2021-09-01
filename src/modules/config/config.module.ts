import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { App } from 'src/entities/app.entity'
import { AppController } from './controllers/app/app.controller'
import { AppService } from './services/app/app.service'

@Module({
  imports: [TypeOrmModule.forFeature([App])],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService, TypeOrmModule]
})
export class ConfigModule {}
