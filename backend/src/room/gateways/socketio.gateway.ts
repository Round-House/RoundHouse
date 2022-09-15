import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { map, switchMap } from 'rxjs';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/service/auth.service';
import { UserEntity } from 'src/user/models/user.entity';
import { RoomMembershipService } from '../services/room-membership/room-membership.service';

@WebSocketGateway()
export class SocketioGateway
    implements OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    server: Server;

    constructor(
        private authService: AuthService,
        private roomMembershipService: RoomMembershipService,
    ) {}

    handleConnection(socket: Socket) {
        return this.authService
            .verifyJwt(socket.handshake.headers.authorization)
            .pipe(
                switchMap((decodedToken: any) => {
                    return this.authService
                        .getUser(decodedToken.user.username)
                        .pipe(
                            map((user: UserEntity) => {
                                if (user === undefined) {
                                    return socket.disconnect();
                                }
                                socket.data.user = user;
                            }),
                        );
                }),
            );
    }

    handleDisconnect(socket: Socket) {
        socket.disconnect();
    }

    //Used when the chat room component is initalized on screen
    @SubscribeMessage('enterRoom')
    handleEnterRoom(socket: Socket, roomAddress: string) {
        return this.roomMembershipService
            .isInRoom(socket.data.user, roomAddress)
            .pipe(
                map((inRoom: boolean) => {
                    if (inRoom) {
                        socket.join(roomAddress);
                    } else {
                        throw new Error('User is not in room');
                    }
                }),
            );
    }

    //Used when the chat room component is destoryed on screen
    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(socket: Socket, room: string) {
        socket.leave(room);
    }

    @SubscribeMessage('sendMessage')
    handleSendMessage(socket: Socket, room: string, message: any) {
        this.server.to(room).emit(message);
        return message;
    }
}
