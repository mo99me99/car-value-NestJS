import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
    // we don't use it and use create and then save method instead.
    // so Hooks will be executed this way.
    // return this.repo.save({email, password})
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.repo.findOneBy({ id: id });
  }

  find(email: string) {
    const users = this.repo.find({ where: { email: email } });
    return users;
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.repo.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.repo.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException('user not found!');
    }
    this.repo.remove(user);
  }
}
