import { IsString, IsEnum, IsInt, IsOptional } from 'class-validator';

export enum AppType {
  wechat = 'wechat',
  wework = 'wework',
  dingtalk = 'dingtalk',
}

export class AppConfig {
  @IsString()
  name: string;

  @IsEnum(AppType)
  type: AppType;

  @IsString()
  appid: string;

  @IsString()
  response_type: 'code';

  @IsString()
  scope: 'snsapi_base';

  @IsString()
  redirect_uri: string;

  @IsInt()
  @IsOptional()
  agentid: string; // 企业微信
}
