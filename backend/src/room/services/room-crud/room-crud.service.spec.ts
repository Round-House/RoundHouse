import { Test, TestingModule } from '@nestjs/testing';
import { RoomCrudService } from './room-crud.service';

describe('RoomCrudService', () => {
  let service: RoomCrudService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomCrudService],
    }).compile();

    service = module.get<RoomCrudService>(RoomCrudService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
