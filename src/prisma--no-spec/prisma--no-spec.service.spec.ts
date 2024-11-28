import { Test, TestingModule } from '@nestjs/testing';
import { PrismaNoSpecService } from './prisma--no-spec.service';

describe('PrismaNoSpecService', () => {
  let service: PrismaNoSpecService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaNoSpecService],
    }).compile();

    service = module.get<PrismaNoSpecService>(PrismaNoSpecService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
