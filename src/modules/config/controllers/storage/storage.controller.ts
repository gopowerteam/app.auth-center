import { Controller } from '@nestjs/common'
import { Crud, CrudController } from '@nestjsx/crud'
import { ApiExcludeController } from '@nestjs/swagger'

import { Storage } from 'src/entities/storage.entity'
import { StorageService } from '../../services/storage/storage.service'

@ApiExcludeController()
@Crud({
  model: {
    type: Storage
  }
})
@Controller('config/storage')
export class StorageController
  implements CrudController<Storage>
{
  constructor(public service: StorageService) {}
}
