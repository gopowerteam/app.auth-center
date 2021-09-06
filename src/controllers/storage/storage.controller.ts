import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'
import { StorageType } from 'src/config/enum.config'
import { Storage } from 'src/entities/storage.entity'
import { IStorageService } from 'src/interfaces/storage-service.interface'
import { StorageService } from 'src/modules/config/services/storage/storage.service'
import { CosService } from 'src/services/cos/cos.service'

@ApiTags('storage')
@Controller('storage')
export class StorageController {
  constructor(
    private readonly storageService: StorageService,
    private readonly cosService: CosService
  ) {}

  /**
   * 获取存储配置
   * @param name
   * @returns
   */
  private async getStorageConfig(name): Promise<Storage> {
    const storage = await this.storageService.findOne({
      name
    })

    if (!storage) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: '未找到指定存储'
        },
        HttpStatus.NOT_FOUND
      )
    }

    if (storage) {
      const object = plainToClass(Storage, storage)
      const errors = await validate(object)

      if (errors.length > 0) {
        console.error(errors)

        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: '存储配置异常'
          },
          HttpStatus.NOT_FOUND
        )
      }
    }

    return storage
  }

  private getStorageService(
    storage: StorageType
  ): IStorageService {
    const services = {
      [StorageType.cos]: this.cosService
    }

    return services[storage]
  }

  /**
   * 获取文件存储授权
   * @param app
   * @returns
   */
  @ApiOperation({
    operationId: 'getStorageCredential',
    summary: '获取文件存储授权'
  })
  @Get('storage-credential/:storage')
  async getStorageCredential(
    @Param('storage') name: string
  ) {
    const storage = await this.getStorageConfig(name)
    const service = this.getStorageService(storage.type)

    return await service.getCredential(storage)
  }
}
