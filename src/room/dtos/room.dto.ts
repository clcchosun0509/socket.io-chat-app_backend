import { Expose, Transform } from 'class-transformer';
import { Message, User } from '../../entities';

export class RoomDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  @Transform(({ obj }) => obj.users.length)
  numOfUsers: number;

  @Expose()
  @Transform(({ obj }) => obj.owner.username)
  ownerUsername: string;

  @Expose()
  @Transform(({ obj }) => obj.owner.avatar)
  ownerAvatar: string;

  @Expose()
  messages: Message[];

  @Expose()
  updatedAt: Date;
}