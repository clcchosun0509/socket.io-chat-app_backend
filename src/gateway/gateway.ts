import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { plainToInstance } from 'class-transformer';
import { OnEvent } from '@nestjs/event-emitter';
import { Server } from 'socket.io';
import { Room } from '../entities';
import { AuthenticatedSocket } from '../types';
import { RoomDto } from '../room/dtos/room.dto';
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
  }
  async handleDisconnect(client: AuthenticatedSocket) {
    const room = await this.roomService.findByUser(client.user);
    
    if (room) {
      this.onRoomLeave({ roomId: room.id }, client);
    }
  }

  @SubscribeMessage('onRoomJoin')
  async onRoomJoin(
    @MessageBody() data: any,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const prevRoom = await this.roomService.findOne(data.roomId);
    if (!prevRoom) return;
    
    const newRoom = await this.roomService.joinRoom(
      prevRoom.id,
      client.user.id,
    );
    if (!newRoom) return;

    const roomId = `room_${data.roomId}`;
    client.rooms.clear();
    client.join(roomId);
    client
      .to(roomId)
      .emit('userRoomJoin', {
        username: client.user.username,
        numOfUsers: newRoom.users.length,
      });
  }

  @SubscribeMessage('onRoomLeave')
  async onRoomLeave(
    @MessageBody() data: any,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const prevRoom = await this.roomService.findOne(data.roomId);
    if (!prevRoom) return;
    
    const newRoom = await this.roomService.leaveRoom(
      prevRoom.id,
      client.user.id,
    );
    if (!newRoom) return;

    const roomId = `room_${data.roomId}`;
    client.rooms.clear();
    client.join('room_lobby');

    client
      .to(roomId)
      .emit('userRoomLeave', {
        username: client.user.username,
        numOfUsers: newRoom.users.length,
      });
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const roomId = `room_${data.roomId}`;
    client
      .to(roomId)
      .emit('getMessage', {
        username: client.user.username,
        avatar: client.user.avatar,
        message: data.message,
      });
  }

  @OnEvent('room.create')
  handleRoomCreate(payload: Room[]) {
    const result = plainToInstance(RoomDto, payload, {
      excludeExtraneousValues: true,
    });
    this.server.to('room_lobby').emit('onRoomsUpdate', result);
  }
}
