import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async validate(user: User) {
    const { id } = user;
    const foundUser = await this.repo.findOneBy({ id });
    if (foundUser) {
      await this.repo.update({ id }, user);
      console.log('Updated');
      return user;
    }
    return this.create(user);
  }

  create(user: User) {
    const createdUser = this.repo.create(user);
    return this.repo.save(createdUser);
  }

  findOne(id: string): Promise<User | null> {
    return this.repo.findOneBy({ id });
  }

  async update(id: string, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }
}
