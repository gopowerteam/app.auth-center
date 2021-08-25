import { Controller, Get, Param, Redirect } from '@nestjs/common';
import { WechatService } from 'src/services/wechat/wechat.service';

@Controller('wechat')
export class WechatController {
  constructor(private readonly wechatService: WechatService) {}

  @Get('authorize/:app')
  @Redirect()
  authorize(@Param('app') app: string) {
    const url = this.wechatService.getAuthorizeUrl(app);
    return { url };
  }

  @Get('qrlogin/:app')
  @Redirect()
  qrlogin(@Param() { app }) {
    return { url: 'http://baidu.com' };
  }
}
