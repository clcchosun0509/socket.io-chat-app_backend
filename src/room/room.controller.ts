import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthService } from '../auth/auth.service';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from '../entities';
import { CreateRoomDto } from './dtos/create-room.dto';
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
    const foundRooms = await this.roomService.findByUser(user);
    if (foundRooms.length > 0) {
      await this.authService.update(user.id, { room: null });
      await this.roomService.remove(foundRooms[0].id);
    }
    const room = await this.roomService.create(body.title, user);
    const rooms = await this.roomService.findAll();
    this.eventEmitter.emit('room.create', rooms);
    return room;
  }

  @Get()
  @UseGuards(AuthGuard)
  getRooms() {
    return this.roomService.findAll()
  }
}
