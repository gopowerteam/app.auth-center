import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as qs from 'qs';
import * as puppeteer from 'puppeteer';

@Injectable()
export class WechatService {
  constructor(private readonly configService: ConfigService) {}

  public getAuthorizeUrl(appName: string) {
    const authorizeUrl = this.configService.get('wechat.authorize_url');
    const apps: any[] = this.configService.get('apps');

    const app = apps.find((x) => x.name === appName);

    if (!app) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: '未找到指定应用',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const query = qs.stringify({
      appid: app.appid,
      redirect_uri: app.redirect_uri,
      response_type: app.response_type,
      scope: app.scope,
      state: Date.now(),
    });

    return `${authorizeUrl}?${query}#wechat_redirect`;
  }

  public getWeworkQrConnectUrl(appName: string) {
    const apps: any[] = this.configService.get('apps');

    const app = apps.find((x) => x.name === appName);
    const qrConnectUrl = this.configService.get('wework.qrconnect_url');

    const query = qs.stringify({
      appid: app.appid,
      agentid: app.agentid,
      redirect_uri: app.redirect_uri,
      state: Date.now(),
    });

    return `${qrConnectUrl}?${query}`;
  }

  public async getQrcodeImage(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // 跳转授权网站
    await page.goto(url, {
      waitUntil: 'networkidle2',
    });

    // 获取二维码图片
    const imageUrl = await page.evaluate(
      (el) => el.src,
      await page.$('.wrp_code img'),
    );

    await browser.close();

    return imageUrl;
  }
}
