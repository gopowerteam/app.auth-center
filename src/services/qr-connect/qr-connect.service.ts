import { Injectable } from '@nestjs/common';
import * as qs from 'qs';
import * as puppeteer from 'puppeteer';
import * as R from 'ramda';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/models/app-config';

@Injectable()
export class QrConnectService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * 获取登录二维码图片地址
   * @param app
   * @returns
   */
  public async getQrcodeImage(app: AppConfig): Promise<string> {
    const action = {
      // 企业微信
      wework: R.pipe(this.getWeworkQrConnectUrl, this.getWeworkQrImageUrl),
      // 微信开放平台
      wechat: R.pipe(this.getWechatQrConnectUrl, this.getWechatQrImageUrl),
      // 钉钉
      dingtalk: R.pipe(
        this.getDingTalkQrConnectUrl,
        this.getDingTalkQrImageUrl,
      ),
    };

    return action[app.type].bind(this)(app);
  }

  /**
   * 获取企业微信扫码登录地址
   * @param appName
   * @returns
   */
  public getWeworkQrConnectUrl(app: AppConfig) {
    // 获取企业微信扫码认证地址
    const qrConnectUrl = this.configService.get('wework.qrconnect_url');
    // 获取请求参数
    const query = qs.stringify({
      appid: app.appid,
      agentid: app.agentid,
      redirect_uri: app.redirect_uri,
      state: Date.now(),
    });

    return `${qrConnectUrl}?${query}`;
  }

  /**
   * 获取微信扫码登录地址
   * @param app
   * @returns
   */
  public getWechatQrConnectUrl(app: AppConfig) {
    // 获取企业微信扫码认证地址
    const qrConnectUrl = this.configService.get('wechat.qrconnect_url');
    // 获取请求参数
    const query = qs.stringify({
      appid: app.appid,
      redirect_uri: app.redirect_uri,
      response_type: app.response_type,
      scope: app.scope,
      state: Date.now(),
    });

    return `${qrConnectUrl}?${query}#wechat_redirect`;
  }

  /**
   * 获取钉钉扫码登录地址
   * @param app
   * @returns
   */
  public getDingTalkQrConnectUrl(app: AppConfig) {
    // 获取企业微信扫码认证地址
    const qrConnectUrl = this.configService.get('dingtalk.qrconnect_url');
    // 获取请求参数
    const query = qs.stringify({
      appid: app.appid,
      redirect_uri: app.redirect_uri,
      response_type: app.response_type,
      scope: app.scope,
      state: Date.now(),
    });

    return `${qrConnectUrl}?${query}`;
  }

  /**
   * 获取扫码登录图片
   */
  public async getQrImageUrl(url: string, selector: string, iframe = false) {
    const browser = await puppeteer.launch({
      defaultViewport: {
        width: 1920,
        height: 937,
      },
    });

    const page = await browser.newPage();

    // 跳转授权网站
    await page.goto(url, {
      waitUntil: 'networkidle2',
    });

    // 获取内容区域
    const getContent = async () => {
      if (iframe) {
        const frameHandle = await page.$('iframe');
        return await frameHandle.contentFrame();
      } else {
        return page;
      }
    };

    const content = await getContent();

    // 获取二维码图片
    const imageUrl = await content.evaluate(
      (el) => el.src,
      await content.$(selector),
    );

    await browser.close();

    return imageUrl;
  }

  /**
   * 获取企业微信扫码图片
   */
  public async getWeworkQrImageUrl(url: string) {
    return await this.getQrImageUrl(url, '.wrp_code img');
  }

  /**
   * 获取微信开放平台扫码图片
   */
  public async getWechatQrImageUrl(url: string) {
    return await this.getQrImageUrl(url, '.wrp_code img');
  }

  /**
   * 获取钉钉扫码图片
   */
  public async getDingTalkQrImageUrl(url: string) {
    return await this.getQrImageUrl(url, '.login_qrcode_content img', true);
  }
}
