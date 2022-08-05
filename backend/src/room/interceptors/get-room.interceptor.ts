import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UserEntity } from 'src/user/models/user.entity';
import { RoomEntity } from '../models/room.entity';
import { RoomCrudService } from '../services/room-crud/room-crud.service';

@Injectable()
export class GetRoomInterceptor implements NestInterceptor {
    constructor(private roomCrudService: RoomCrudService) {}

    // Requires JWT and request.query.roomAddress
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const roomAddress: string = request.query.roomAddress;
        const user: UserEntity | undefined = request.body.user;

        delete request.body.room;
        delete request.body.member;

        return this.roomCrudService
            .getRoom(roomAddress, ['memberships', 'memberships.user', 'stream'])
            .pipe(
                switchMap((room: RoomEntity) => {
                    if (
                        typeof roomAddress !== null &&
                        room.roomAddress === roomAddress
                    ) {
                        if (user) {
                            const member = room.memberships.find(
                                (member) =>
                                    member.user.username === user.username,
                            );
                            if (room.memberships.includes(member)) {
                                request.body.member = member;
                            }
                        }
                        delete room.memberships;
                        request.body.room = room;
                        request.body.streamId = room.stream;
                        return next.handle().pipe(
                            map((flow) => {
                                return flow;
                            }),
                        );
                    }
                    throw new Error(`Room ${room.roomAddress} not found`);
                }),
            );
    }
}
