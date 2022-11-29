import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoomMessage } from './room-message.entity';
import { User } from './user.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @OneToMany(() => User, (user) => user.room)
  users: User[];

  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn()
  owner: User;

  @OneToMany(() => RoomMessage, (message) => message.room, {
    cascade: ['insert', 'remove', 'update'],
  })
  @JoinColumn()
  messages: RoomMessage[];;

  @UpdateDateColumn({ name: 'updated_at'})
  updatedAt: Date;
}
