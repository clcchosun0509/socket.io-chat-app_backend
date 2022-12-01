import { IsString } from 'class-validator';

export class RoomDto {
  @IsString()
  roomId: string;
}
