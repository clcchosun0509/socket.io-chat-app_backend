import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { OnEvent } from '@nestjs/event-emitter';
import { Server } from 'socket.io';
import { Room } from '../entities';
import { AuthenticatedSocket } from '../types';
import { RoomDto } from './dtos/room.dto';
import { RoomService } from '../room/room.service';
import { AuthService } from '../auth/auth.service';
@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
  pingInterval: 10000,
  pingTimeout: 15000,
})
export class MessagingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly roomService: RoomService,
    private readonly authService: AuthService,
  ) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: AuthenticatedSocket, ...args: any[]) {
    client.join('room_lobby');
    // console.log("client", client);
  }
  handleDisconnect(client: AuthenticatedSocket) {
    // throw new Error('Method not implemented.');
  }

  @SubscribeMessage('onRoomJoin')
  async onRoomJoin(
    @MessageBody() data: RoomDto,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const room = await this.roomService.findOne(data.roomId);
    if (!room) return;
    await this.roomService.joinRoom(room.id, client.user.id);

    const roomId = `room_${data.roomId}`;
    client.rooms.clear();
    client.join(roomId);
    client.to(roomId).emit('userRoomJoin', { username: client.user.username });
  }

  @SubscribeMessage('onRoomLeave')
  async onRoomLeave(
    @MessageBody() data: RoomDto,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const room = await this.roomService.findOne(data.roomId);
    if (!room) return;
    await this.roomService.leaveRoom(room.id, client.user.id);

    const roomId = `room_${data.roomId}`;
    client.rooms.clear();
    client.join('room_lobby');
    client.to(roomId).emit('userRoomLeave', { username: client.user.username });
  }

  @OnEvent('room.create')
  handleRoomCreate(payload: Room[]) {
    console.log('room.create event', payload);
    this.server.to('room_lobby').emit('onRoomsUpdate', payload);
  }
}
