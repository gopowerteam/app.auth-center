import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { App } from 'src/entities/app.entity'

@Injectable()
export class AppService extends TypeOrmCrudService<App> {
  constructor(@InjectRepository(App) repo) {
    super(repo)
  }
}
