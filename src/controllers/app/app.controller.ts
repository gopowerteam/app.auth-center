import {
  Controller,
  Get,
  Param,
  Redirect,
  Render,
  Res
} from '@nestjs/common'
import { Response } from 'express'

import { ConfigService } from '@nestjs/config'
import { DingtalkService } from 'src/services/dingtalk/dingtalk.service'
import { WechatService } from 'src/services/wechat/wechat.service'
import { WeworkService } from 'src/services/wework/wework.service'
import { ApiExcludeController } from '@nestjs/swagger'
import { AppService } from 'src/modules/config/services/app/app.service'

@ApiExcludeController()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Redirect()
  indexAction() {
    return {
      url: '/login'
    }
  }

  @Get('login')
  @Render('login')
  async loginAction() {
    const apps = await this.appService.find()
    return {
      apps
    }
  }

  @Get('file')
  @Render('file')
  fileAction() {
    return {
      a: Math.random()
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
}
