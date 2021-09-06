import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
  Redirect
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'
import { AppType } from 'src/config/enum.config'
import { App } from 'src/entities/app.entity'
import { IAppService } from 'src/interfaces/app-service.interface'
import { AppService } from 'src/modules/config/services/app/app.service'
import { DingtalkService } from 'src/services/dingtalk/dingtalk.service'
import { WechatService } from 'src/services/wechat/wechat.service'
import { WeworkService } from 'src/services/wework/wework.service'

@Controller('/app')
@ApiTags('app')
export class AppController {
  constructor(
    private readonly wechatService: WechatService,
    private readonly weworkService: WeworkService,
    private readonly dingtalkService: DingtalkService,
    private readonly appService: AppService
  ) {}

  /**
   * 获取应用配置
   * @param name
   * @returns
   */
  private async getApp(name): Promise<App> {
    const app = await this.appService.findOne({
      name
    })

    if (!app) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: '未找到指定应用'
        },
        HttpStatus.NOT_FOUND
      )
    }

    if (app) {
      const object = plainToClass(App, app)
      const errors = await validate(object)

      if (errors.length > 0) {
        console.error(errors)

        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: '应用配置异常'
          },
          HttpStatus.NOT_FOUND
        )
      }
    }

    return app
  }

  private getAppService(app: AppType): IAppService {
    const services = {
      [AppType.wechat]: this.wechatService,
      [AppType.wework]: this.weworkService,
      [AppType.dingtalk]: this.dingtalkService
    }

    return services[app]
  }

  /**
   * 扫码登录
   * @param app
   * @returns
   */
  @ApiOperation({
    operationId: 'qrConnect',
    summary: '获取扫码登录图片'
  })
  @Get('qrConnect/:app')
  async qrConnect(@Param('app') name: string) {
    // 获取应用配置
    const app = await this.getApp(name)
    // 获取应用服务
    const service = this.getAppService(app.type)
    // 获取扫码登录图片地址

    try {
      const image = await service.getQrConnectImage(app)

      return {
        image
      }
    } catch (ex) {
      console.error(ex)

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: '扫码登录配置授权异常'
        },
        HttpStatus.NOT_FOUND
      )
    }
  }

  /**
   * 扫码登录
   * @param app
   * @returns
   */
  @ApiOperation({
    operationId: 'authorize',
    summary: '获取授权路径'
  })
  @Get('authorize/:app')
  @Redirect()
  async authorize(@Param('app') name: string) {
    // 获取应用配置
    const app = await this.getApp(name)
    // 获取应用服务
    const service = this.getAppService(app.type)

    return {
      url: service.getAuthorizeUrl(app)
    }
  }

  /**
   * 获JSSDK授权
   * @param app
   * @returns
   */
  @ApiOperation({
    operationId: 'jsConfig',
    summary: '获取JSConfig配置'
  })
  @Get('js-config/:app')
  async JSConfig(
    @Param('app') name: string,
    @Query('url') url: string
  ) {
    const app = await this.getApp(name)
    const service = this.getAppService(app.type)

    return await service.getJSConfig(app, url)
  }
}
