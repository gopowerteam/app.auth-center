import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Storage } from 'src/entities/storage.entity'

@Injectable()
export class StorageService extends TypeOrmCrudService<Storage> {
  constructor(@InjectRepository(Storage) repo) {
    super(repo)
  }
}
