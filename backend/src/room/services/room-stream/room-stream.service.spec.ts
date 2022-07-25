import { Test, TestingModule } from '@nestjs/testing';
import { RoomStreamService } from './room-stream.service';

describe('RoomStreamService', () => {
    let service: RoomStreamService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RoomStreamService],
        }).compile();

        service = module.get<RoomStreamService>(RoomStreamService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
