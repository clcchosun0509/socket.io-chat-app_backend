import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Message } from './message.entity';
import { User } from './user.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @OneToMany(() => User, (user) => user.room, { eager: true })
  users: User[];

  @OneToOne(() => User, { eager: true })
  @JoinColumn()
  owner: User;

  @OneToMany(() => Message, (message) => message.room, {
    cascade: ['insert', 'remove', 'update'],
    eager: true
  })
  @JoinColumn()
  messages: Message[];

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
