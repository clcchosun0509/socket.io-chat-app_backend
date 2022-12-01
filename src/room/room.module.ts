import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room, User } from '../entities';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([Room, User])],
  providers: [RoomService, AuthService],
  controllers: [RoomController],
})
export class RoomModule {}
