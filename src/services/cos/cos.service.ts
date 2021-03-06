import { Injectable } from '@nestjs/common'
import * as COS from 'cos-nodejs-sdk-v5'
import * as sts from 'qcloud-cos-sts'
import { StorageType } from 'src/config/enum.config'
import { Storage } from 'src/entities/storage.entity'

@Injectable()
export class CosService {
  /**
   * 获取配置
   * @param storage
   * @returns
   */
  public getConfig(storage: Storage) {
    return {
      bucket: storage.bucket,
      region: storage.region,
      type: StorageType.cos
    }
  }

  public getCredential(storage: Storage) {
    const policy = sts.getPolicy([
      {
        action: storage.action.split(';').filter(x => !!x),
        bucket: storage.bucket,
        region: storage.region,
        prefix: storage.prefix
      }
    ])

    return new Promise((resolve, reject) => {
      sts.getCredential(
        {
          secretId: storage.secretId,
          secretKey: storage.secretKey,
          policy: policy,
          durationSeconds: 3600
        },
        (err, credential) => {
          if (err) {
            reject()
          } else {
            resolve(credential)
          }
        }
      )
    })
  }

  public getObjectUrl(storage: Storage, key: string) {
    const cos = new COS({
      SecretId: storage.secretId,
      SecretKey: storage.secretKey
    })

    return new Promise((resolve, reject) =>
      cos.getObjectUrl(
        {
          Bucket: storage.bucket,
          Region: storage.region,
          Key: key,
          Sign: true,
          Expires: 1800
        },
        (err, data) => {
          if (err) {
            reject()
          } else {
            resolve(data.Url)
          }
        }
      )
    )
  }
}
