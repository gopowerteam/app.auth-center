import { Controller } from '@nestjs/common'
import { Crud, CrudController } from '@nestjsx/crud'
import { App } from 'src/entities/app.entity'
import { AppService } from '../../services/app/app.service'
import { ApiExcludeController } from '@nestjs/swagger'

// @ApiExcludeController()
@Crud({
  model: {
    type: App
  }
})
@Controller('config/app')
export class AppController implements CrudController<App> {
  constructor(public service: AppService) {}
}
