import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { Room, User } from '../entities';
import { RoomService } from '../room/room.service';
import { MessagingGateway } from './gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Room, User])],
  providers: [MessagingGateway, RoomService, AuthService],
})
export class GatewayModule {}
