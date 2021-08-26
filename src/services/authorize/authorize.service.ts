import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as qs from 'qs';
import { AppConfig } from 'src/models/app-config';

@Injectable()
export class AuthorizeService {
  constructor(private readonly configSerivce: ConfigService) {}

  /**
   *  获取授权地址
   * @param app
   * @returns
   */
  public getAuthorizeUrl(app: AppConfig): string {
    const action = {
      // 企业微信
      wework: this.getWeworkAuthorizeUrl,
      // 微信
      wechat: this.getWechatAuthorizeUrl,
      // 钉钉
      dingtalk: this.getDingTalkAuthorizeUrl,
    };

    return action[app.type].bind(this)(app);
  }

  /**
   *  获取企业微信授权地址
   * @param app
   * @returns
   */
  private getWechatAuthorizeUrl(app: AppConfig) {
    // 授权地址
    const authorizeUrl = this.configSerivce.get('wechat.authorize_url');
    // 授权参数
    const query = qs.stringify({
      appid: app.appid,
      redirect_uri: app.redirect_uri,
      response_type: app.response_type,
      scope: app.scope,
      state: Date.now(),
    });

    return `${authorizeUrl}?${query}#wechat_redirect`;
  }

  /**
   *  获取企业微信授权地址
   * @param app
   * @returns
   */
  private getWeworkAuthorizeUrl(app: AppConfig) {
    // 授权地址
    const authorizeUrl = this.configSerivce.get('wework.authorize_url');
    // 授权参数
    const query = qs.stringify({
      appid: app.appid,
      redirect_uri: app.redirect_uri,
      response_type: app.response_type,
      scope: app.scope,
      state: Date.now(),
    });

    return `${authorizeUrl}?${query}#wechat_redirect`;
  }

  /**
   *  获取钉钉授权地址
   * @param app
   * @returns
   */
  private getDingTalkAuthorizeUrl(app: AppConfig) {
    // 授权地址
    const authorizeUrl = this.configSerivce.get('dingtalk.authorize_url');
    // 授权参数
    const query = qs.stringify({
      appid: app.appid,
      redirect_uri: app.redirect_uri,
      response_type: app.response_type,
      scope: app.scope,
      state: Date.now(),
    });

    return `${authorizeUrl}?${query}`;
  }
}
