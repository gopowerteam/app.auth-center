import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
  Redirect,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiProperty } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { IService } from 'src/interfaces/service.interface';
import { AppConfig, AppType } from 'src/models/app-config';
import { DingtalkService } from 'src/services/dingtalk/dingtalk.service';
import { WechatService } from 'src/services/wechat/wechat.service';
import { WeworkService } from 'src/services/wework/wework.service';

@Controller()
export class AppController {
  constructor(
    private readonly configService: ConfigService,
    private readonly wechatService: WechatService,
    private readonly weworkService: WeworkService,
    private readonly dingtalkService: DingtalkService,
  ) {}

  /**
   * 获取应用配置
   * @param name
   * @returns
   */
  private async getAppConfig(name): Promise<AppConfig> {
    const apps: any[] = this.configService.get('apps');
    const app = apps.find((x) => x.name === name);

    if (!app) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: '未找到指定应用',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (app) {
      const object = plainToClass(AppConfig, app);
      const errors = await validate(object);

      if (errors.length > 0) {
        console.error(errors);

        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: '应用配置异常',
          },
          HttpStatus.NOT_FOUND,
        );
      }
    }

    return app;
  }

  private getAppService(app: AppType): IService {
    const services = {
      [AppType.wechat]: this.wechatService,
      [AppType.wework]: this.weworkService,
      [AppType.dingtalk]: this.dingtalkService,
    };

    return services[app];
  }

  /**
   * 扫码登录
   * @param app
   * @returns
   */
  @ApiOperation({ description: '获取扫码登录图片' })
  @Get('qrConnect/:app')
  async qrConnect(@Param('app') name: string) {
    // 获取应用配置
    const app = await this.getAppConfig(name);
    // 获取应用服务
    const service = this.getAppService(app.type);
    // 获取扫码登录图片地址

    try {
      const image = await service.getQrConnectImage(app);

      return {
        image,
      };
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: '扫码登录配置授权异常',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  /**
   * 扫码登录
   * @param app
   * @returns
   */
  @ApiOperation({ description: '获取授权路径' })
  @Get('authorize/:app')
  @Redirect()
  async authorize(@Param('app') name: string) {
    // 获取应用配置
    const app = await this.getAppConfig(name);
    // 获取应用服务
    const service = this.getAppService(app.type);

    return {
      url: service.getAuthorizeUrl(app),
    };
  }

  /**
   * 获JSSDK授权
   * @param app
   * @returns
   */
  @ApiOperation({ description: '获取JSConfig配置' })
  @Get('js-config/:app')
  async JSConfig(@Param('app') name: string, @Query('url') url: string) {
    const app = await this.getAppConfig(name);
    const service = this.getAppService(app.type);

    return await service.getJSConfig(app, url);
  }
}
