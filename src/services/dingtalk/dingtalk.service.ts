import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { AppConfig } from 'src/models/app-config';
import { IService } from 'src/interfaces/service.interface';
import * as R from 'ramda';
import * as crypto from 'crypto';
import * as qs from 'qs';
import { from, iif, lastValueFrom, map, of, switchMap } from 'rxjs';
import { tap } from 'rxjs';
import { QrConnectService } from '../qr-connect/qr-connect.service';

type AccessTokenResponse = {
  data: { access_token: string; expires_in: number };
};

type TicketResponse = {
  data: { ticket: string; expires_in: number };
};

const ACCESS_TOKEN_KEY = 'dingtalk_access_token';
const TICKET_KEY = 'dingtalk_ticket';

@Injectable()
export class DingtalkService implements IService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly qrConnectService: QrConnectService,
  ) {}

  /**
   * 获取JSAPI配置
   * @param app
   * @returns
   */
  public async getJSConfig(app: AppConfig, url: string) {
    // 获取JSAPI_TICKET
    const jsapi_ticket = await lastValueFrom(
      this.getAccessToken(app).pipe(switchMap(this.getTicket.bind(this))),
    );

    const noncestr = Math.random().toString(36).substr(2); // 随机字符串
    const timestamp = Math.floor(Date.now() / 1000); // 获取时间戳，数值类型

    // 获取签名
    const signature = this.getSignature(
      qs.stringify({
        jsapi_ticket,
        noncestr,
        timestamp,
        url,
      }),
    );

    return {
      nonceStr: noncestr,
      timeStamp: timestamp,
      signature,
    };
  }

  /**
   * 获取扫码登录图片
   * @param app
   * @returns
   */
  public async getQrConnectImage(app: AppConfig) {
    return await this.qrConnectService.getQrImageUrl(
      this.getQrConnectUrl(app),
      '.login_qrcode_content img',
      true,
    );
  }

  /**
   * 获取企业微信授权地址
   * @param app
   * @returns
   */
  public getAuthorizeUrl(app: AppConfig) {
    // 授权地址
    const authorizeUrl = this.configService.get('dingtalk.authorize_url');
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

  /**
   * 获取微信扫码登录地址
   * @param app
   * @returns
   */
  private getQrConnectUrl(app: AppConfig) {
    // 获取钉钉扫码认证地址
    const qrConnectUrl = this.configService.get('dingtalk.qrconnect_url');
    // 获取请求参数
    const query = qs.stringify({
      appid: app.appid,
      redirect_uri: app.redirect_uri,
      response_type: app.response_type,
      scope: 'snsapi_login',
      state: Date.now(),
    });

    return `${qrConnectUrl}?${query}`;
  }

  /**
   * 获取签名
   * @returns
   */
  private getSignature(str) {
    return crypto.createHash('sha256').update(str).digest('hex');
  }

  /**
   * 获取API Ticket
   * @param accessToken
   * @returns
   */
  private getTicket(accessToken: string) {
    const ticketUrl = this.configService.get('dingtalk.ticket_url');

    // 从缓存获取AccessToken
    const getTicketFromCache = from(this.cacheManager.get<string>(TICKET_KEY));

    // 从网络获取AccessToken
    const getTicketFromHttp = () =>
      this.httpService
        .get(ticketUrl, {
          params: {
            access_token: accessToken,
          },
        })
        .pipe(
          // 更新缓存
          tap(({ data: { ticket, expires_in } }: TicketResponse) => {
            this.cacheManager.set(TICKET_KEY, ticket, expires_in);
          }),
          // 返回AccessToken
          map(({ data: { ticket } }: TicketResponse) => ticket),
        );

    // 获取AccessToken
    return getTicketFromCache.pipe(
      switchMap((ticket) =>
        // 缓存AccessToken不存在的情况下从网络获取
        iif(() => R.isEmpty(ticket), getTicketFromHttp(), of(ticket)),
      ),
    );
  }

  /**
   * 获取AccessToken
   * @param app
   */
  private getAccessToken(app: AppConfig) {
    // 获取TokenUrl地址
    const tokenUrl = this.configService.get('dingtalk.token_url');

    // 从缓存获取AccessToken
    const getAccessTokenFromCache = from(
      this.cacheManager.get<string>(ACCESS_TOKEN_KEY),
    );

    // 从网络获取AccessToken
    const getAccessTokenFromHttp = () =>
      this.httpService
        .get(tokenUrl, {
          params: {
            appkey: app.appid,
            appsecret: app.secret,
          },
        })
        .pipe(
          // 更新缓存
          tap(({ data: { access_token, expires_in } }: AccessTokenResponse) => {
            this.cacheManager.set(ACCESS_TOKEN_KEY, access_token, expires_in);
          }),
          // 返回AccessToken
          map(
            ({ data: { access_token } }: AccessTokenResponse) => access_token,
          ),
        );

    // 获取AccessToken
    return getAccessTokenFromCache.pipe(
      switchMap((accessToken) =>
        // 缓存AccessToken不存在的情况下从网络获取
        iif(
          () => R.isEmpty(accessToken),
          getAccessTokenFromHttp(),
          of(accessToken),
        ),
      ),
    );
  }
}
