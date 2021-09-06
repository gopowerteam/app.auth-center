import { Storage } from 'src/entities/storage.entity'

export interface IStorageService {
  // 存储授权
  getCredential(storage: Storage): any
}
