import { Test, TestingModule } from '@nestjs/testing';
import { WeworkService } from './wework.service';

describe('WeworkService', () => {
  let service: WeworkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeworkService],
    }).compile();

    service = module.get<WeworkService>(WeworkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
