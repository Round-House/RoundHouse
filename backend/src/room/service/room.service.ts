import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable, switchMap, map, catchError, throwError } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateRoomDto } from '../models';
import { RoomEntity } from '../models/room.entity';
import { Room } from '../models/room.interface';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/user/models/user.entity';
import { User } from 'src/user/models/user.interface';
import { StreamEntity } from 'src/stream/models/stream.entity';

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(RoomEntity)
        private readonly roomRepository: Repository<RoomEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService,
    ) {}

    findAll(): Observable<Room[]> {
        return from(this.roomRepository.find());
    }

    createRoom(roomDto: CreateRoomDto, user: any): Observable<Room> {
        const newRoom = new RoomEntity();
        newRoom.name = roomDto.name;
        newRoom.description = roomDto.description;
        newRoom.roomAddress =
            (roomDto.parentRoomAddress ? roomDto.name + '.' : '') +
            roomDto.name;
        newRoom.stream = new StreamEntity();

        return from(
            this.roomRepository.findOne({
                where: { roomAddress: roomDto.parentRoomAddress },
            }),
        ).pipe(
            switchMap((parent: Room) => {
                newRoom.parentRoom = parent;

                return from(
                    this.userRepository.findOne({
                        where: { username: user.username },
                    }),
                ).pipe(
                    switchMap((owner: User) => {
                        newRoom.Owner = owner;

                        return from(this.roomRepository.save(newRoom)).pipe(
                            map((room: Room) => {
                                return room;
                            }),
                            catchError((err) => throwError(() => err)),
                        );
                    }),
                );
            }),
        );
    }
}
