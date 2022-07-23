import { Test, TestingModule } from '@nestjs/testing';
import { RoomMembershipService } from './room-membership.service';

describe('RoomMembershipService', () => {
    let service: RoomMembershipService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RoomMembershipService],
        }).compile();

        service = module.get<RoomMembershipService>(RoomMembershipService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
