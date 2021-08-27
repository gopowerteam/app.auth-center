import { AppConfig } from 'src/models/app-config';

export interface IService {
  // js-config授权
  getJSConfig(
    app: AppConfig,
    url: string,
  ): Promise<{ [key: string]: string | number }>;

  // 扫码登录
  getQrConnectImage(app: AppConfig): Promise<string>;

  // 网页授权
  getAuthorizeUrl(app: AppConfig): string;
}
