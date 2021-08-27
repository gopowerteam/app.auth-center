import { Test, TestingModule } from '@nestjs/testing';
import { DingtalkService } from './dingtalk.service';

describe('DingtalkService', () => {
  let service: DingtalkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DingtalkService],
    }).compile();

    service = module.get<DingtalkService>(DingtalkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
