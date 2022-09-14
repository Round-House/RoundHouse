import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class SocketioGateway
    implements OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    server: Server;

    //TODO: @UseGuards(AuthGuard)
    handleConnection(socket: Socket) {}

    handleDisconnect(socket: Socket) {
        socket.disconnect();
    }

    //Used when the chat room component is initalized on screen
    //TODO: Add auth like in handleConnection()
    @SubscribeMessage('enterRoom')
    handleEnterRoom(socket: Socket, room: string) {
        socket.join(room);
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
