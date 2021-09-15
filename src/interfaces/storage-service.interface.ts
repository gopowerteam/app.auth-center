import { Storage } from 'src/entities/storage.entity'

export interface IStorageService {
  // 获取授权
  getCredential(storage: Storage): any

  // 获取配置
  getConfig(storage: Storage): any

  getObjectUrl(
    storage: Storage,
    key: string
  ): Promise<string>
}
