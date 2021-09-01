import { App } from 'src/entities/app.entity'

export interface IService {
  // js-config授权
  getJSConfig(
    app: App,
    url: string
  ): Promise<{ [key: string]: string | number }>

  // 扫码登录
  getQrConnectImage(app: App): Promise<string>

  // 网页授权
  getAuthorizeUrl(app: App): string
}
