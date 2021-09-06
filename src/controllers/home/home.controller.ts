import {
  Controller,
  Get,
  Param,
  Redirect,
  Render
} from '@nestjs/common'

import { ApiExcludeController } from '@nestjs/swagger'
import { AppService } from 'src/modules/config/services/app/app.service'
import { StorageService } from 'src/modules/config/services/storage/storage.service'

@ApiExcludeController()
@Controller()
export class HomeController {
  constructor(
    private readonly appService: AppService,
    private readonly storageService: StorageService
  ) {}

  @Get()
  @Redirect()
  indexAction() {
    return {
      url: '/app'
    }
  }

  @Get('app')
  @Render('app')
  async loginAction() {
    const apps = await this.appService.find()
    return {
      apps
    }
  }

  @Get('app-form')
  @Render('app-form')
  appFormCreateAction() {
    return {}
  }

  @Get('app-form/:id')
  @Render('app-form')
  async appFormEditAction(@Param('id') id: string) {
    const app = await this.appService.findOne(id)
    return {
      app
    }
  }

  @Get('storage')
  @Render('storage')
  async storageAction() {
    const storages = await this.storageService.find()
    return {
      storages
    }
  }

  @Get('storage-form')
  @Render('storage-form')
  storageFormCreateAction() {
    return {}
  }

  @Get('storage-form/:id')
  @Render('storage-form')
  async storageFormEditAction(@Param('id') id: string) {
    const storage = await this.storageService.findOne(id)
    return {
      storage
    }
  }
}
