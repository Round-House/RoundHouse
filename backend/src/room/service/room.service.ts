import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable, switchMap, map } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateRoomDto } from '../models';
import { RoomEntity } from '../models/room.entity';
import { Room } from '../models/room.interface';
import { ExtractJwt } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/user/models/user.entity';

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

    createRoom(roomDto: CreateRoomDto): Observable<Room> {
        const newRoom = new RoomEntity();
        newRoom.name = roomDto.name;
        newRoom.description = roomDto.description;
        newRoom.roomAddress = roomDto.name + '.' + roomDto.parentRoomAddress;
        
        return from(this.roomRepository.findOne({
            where: { roomAddress: roomDto.parentRoomAddress },
        })).pipe(
            map((parent: Room) => {
                newRoom.parentRoom = parent;

                return newRoom;
                /*
                from(this.userRepository.findOne({
                    where: { username: this.jwtService.decode(ExtractJwt.fromAuthHeaderAsBearerToken().username },
                })).pipe(
                    switchMap((owner: User) => {
                        newRoom.Owner = owner;
                        
                    })
                )
                */
            })
        )
    }
}
