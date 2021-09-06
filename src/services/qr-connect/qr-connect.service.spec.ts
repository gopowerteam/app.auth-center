import { Test, TestingModule } from '@nestjs/testing'
import { QrConnectService } from './qr-connect.service'

describe('QrConnectService', () => {
  let service: QrConnectService

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [QrConnectService]
      }).compile()

    service = module.get<QrConnectService>(QrConnectService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
