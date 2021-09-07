import { App } from 'src/entities/app.entity'

export interface IAppService {
  // js-config授权
  getJSConfig(
    app: App,
    url: string
  ): Promise<{ [key: string]: string | number }>

  // 扫码登录
  getQrConnectUrl(app: App): string

  // 网页授权
  getAuthorizeUrl(app: App): string
}
