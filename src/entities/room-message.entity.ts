import { Entity, ManyToOne } from 'typeorm';
import { Message } from './message.entity';
import { Room } from './room.entity';

@Entity({ name: 'room_messages' })
export class RoomMessage extends Message {
  @ManyToOne(() => Room, (room) => room.messages)
  room: Room;
}
