import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { User } from 'src/user/models/user.interface';
import { Room } from '../models/room.interface';
import { RoomCrudService } from '../services/room-crud/room-crud.service';

@Injectable()
export class GetRoomInterceptor implements NestInterceptor {
    constructor(private roomCrudService: RoomCrudService) {}

    // Requires JWT and request.query.roomAddress
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const roomAddress: string = request.query.roomAddress;
        const user: User = request.body.user;

        return this.roomCrudService
            .getRoom(roomAddress, ['memberships', 'memberships.user', 'stream'])
            .pipe(
                switchMap((room: Room) => {
                    if (room.roomAddress === roomAddress && roomAddress) {
                        if (
                            room.memberships.includes(
                                room.memberships.find(
                                    (membership) =>
                                        membership.user.username ===
                                        user.username,
                                ),
                            )
                        ) {
                            delete room.memberships;
                            request.body.room = room;
                            return next.handle().pipe(
                                map((flow) => {
                                    return flow;
                                }),
                            );
                        }
                        throw new Error('User not in room');
                    }
                    throw new Error('Room not found');
                }),
            );
    }
}
