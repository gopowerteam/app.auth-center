import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class QrConnectService {
  /**
   * 获取扫码登录图片
   */
  public async getQrImageUrl(url: string, selector: string, iframe = false) {
    const browser = await puppeteer.launch({
      defaultViewport: {
        width: 1920,
        height: 1080,
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
}
