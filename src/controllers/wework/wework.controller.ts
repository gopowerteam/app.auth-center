import { Controller, Get, Param, Redirect } from '@nestjs/common';
import { WechatService } from 'src/services/wechat/wechat.service';

@Controller('wework')
export class WeworkController {
  constructor(private readonly wechatService: WechatService) {}

  @Get('authorize/:app')
  @Redirect()
  async authorize(@Param('app') app: string) {
    const url = this.wechatService.getAuthorizeUrl(app);
    return { url };
  }

  @Get('qrlogin/:app')
  async qrlogin(@Param() { app }) {
    const url = this.wechatService.getWeworkQrConnectUrl(app);
    const image = await this.wechatService.getQrcodeImage(url);
    return { image };
  }
}
