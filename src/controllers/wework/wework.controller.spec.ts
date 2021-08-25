import { Test, TestingModule } from '@nestjs/testing';
import { WeworkController } from './wework.controller';

describe('WeworkController', () => {
  let controller: WeworkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeworkController],
    }).compile();

    controller = module.get<WeworkController>(WeworkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
