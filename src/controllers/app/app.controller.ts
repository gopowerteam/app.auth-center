import {
  Controller,
  Get,
  Render,
  Res
} from '@nestjs/common'
import { Response } from 'express'

import { ConfigService } from '@nestjs/config'
import { DingtalkService } from 'src/services/dingtalk/dingtalk.service'
import { WechatService } from 'src/services/wechat/wechat.service'
import { WeworkService } from 'src/services/wework/wework.service'

@Controller()
export class AppController {
  @Get()
  @Render('index')
  index() {
    return {
      a: Math.random()
    }
  }
}
