import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Redirect,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { AppConfig } from 'src/models/app-config';
import { QrConnectService } from 'src/services/qr-connect/qr-connect.service';

@Controller()
export class AppController {
  constructor(
    private readonly configService: ConfigService,
    private readonly qrConnectService: QrConnectService,
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

  /**
   * 扫码登录
   * @param app
   * @returns
   */
  @Get('qrConnect/:app')
  async qrlogin(@Param('app') app: string) {
    // 获取应用配置
    const config = await this.getAppConfig(app);
    // 获取扫码登录图片地址
    const image = await this.qrConnectService.getQrcodeImage(config);

    return {
      image,
    };
  }
}
