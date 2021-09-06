import { Injectable } from '@nestjs/common'
import * as sts from 'qcloud-cos-sts'
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
      region: storage.region
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
        function (err, credential) {
          if (err) {
            reject()
          } else {
            resolve({
              bucket: storage.bucket,
              region: storage.region,
              ...credential
            })
          }
        }
      )
    })
  }
}
