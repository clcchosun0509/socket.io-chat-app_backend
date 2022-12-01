import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthService } from '../auth/auth.service';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from '../entities';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CreateRoomDto } from './dtos/create-room.dto';
import { RoomDto } from './dtos/room.dto';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly authService: AuthService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async createRoom(@AuthUser() user: User, @Body() body: CreateRoomDto) {
    const foundRooms = await this.roomService.findOwnerRoomByUser(user);
    if (foundRooms.length > 0) {
      await this.authService.update(user.id, { room: null });
      await this.roomService.remove(foundRooms[0].id);
    }
    const room = await this.roomService.create(body.title, user);
    const rooms = await this.roomService.findAll();
    this.eventEmitter.emit('room.create', rooms);
    return room;
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  @Serialize(RoomDto)
  async getRoom(@Param('id') id: string) {
    if (!isUUID(id))
      throw new BadRequestException(
        `Invalid id, UUID format expected but received ${id}`,
      );
    const room = await this.roomService.findOne(id);
    if (!room) {
      throw new NotFoundException('room not found');
    }
    return room;
  }

  @Get()
  @UseGuards(AuthGuard)
  @Serialize(RoomDto)
  getRooms() {
    return this.roomService.findAll();
  }
}
