import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { Room, User } from '../entities';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private repo: Repository<Room>,
    private readonly authService: AuthService,
  ) {}

  create(title: string, creator: User) {
    const room = this.repo.create({ title, users: [], owner: creator });
    return this.repo.save(room);
  }

  findAll() {
    return this.repo.find({ order: { updatedAt: 'DESC' } });
  }

  findOne(id: string): Promise<Room | null> {
    if (!id) {
      return null;
    }
    return this.repo.findOneBy({ id });
  }

  findOwnerRoomByUser(user: User) {
    return this.repo.find({ where: { owner: { id: user.id } } });
  }

  async findByUser(user: User) {
    return await this.repo
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.users', 'user')
      .where("user.id = :id", {id: user.id})
      .leftJoinAndSelect('room.users', 'users')
      .leftJoinAndSelect('room.owner', 'owner')
      .leftJoinAndSelect('room.messages', 'message')
      .getOne()
  }

  async remove(id: string) {
    const room = await this.findOne(id);
    if (!room) {
      throw new NotFoundException('room not found');
    }
    return this.repo.remove(room);
  }

  async joinRoom(roomId: string, userId: string) {
    const room = await this.findOne(roomId);
    if (!room) {
      throw new NotFoundException('room not found');
    }
    const foundUser = room.users.find((roomUser) => roomUser.id === userId);
    if (foundUser) {
      return;
    }
    const user = await this.authService.findOne(userId);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    await this.authService.update(user.id, { room });
    room.users.push(user);
    return this.repo.save(room);
  }

  async leaveRoom(roomId: string, userId: string) {
    const room = await this.findOne(roomId);
    if (!room) {
      throw new NotFoundException('room not found');
    }
    const foundUser = room.users.find((roomUser) => roomUser.id === userId);
    if (!foundUser) {
      return;
    }
    await this.authService.update(userId, { room: null });
    room.users = room.users.filter((user) => user.id !== userId);
    return this.repo.save(room);
  }
}
