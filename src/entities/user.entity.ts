import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Message } from './message.entity';
import { Room } from './room.entity';

@Entity()
export class User {
  @PrimaryColumn({ unique: true })
  id: string;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  avatar: string;

  @OneToMany(() => Message, (message) => message.user)
  @JoinColumn()
  messages: Message[];

  @ManyToOne(() => Room, (room) => room.users)
  room: Room
}
