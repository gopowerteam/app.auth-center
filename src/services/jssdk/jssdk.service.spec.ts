import { Test, TestingModule } from '@nestjs/testing';
import { JssdkService } from './jssdk.service';

describe('JssdkService', () => {
  let service: JssdkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JssdkService],
    }).compile();

    service = module.get<JssdkService>(JssdkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
