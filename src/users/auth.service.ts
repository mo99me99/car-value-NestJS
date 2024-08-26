import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { User } from './user.entity';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  
  async signup(email: string, password: string) {
    // see if email is in use
    const inUse = await this.usersService.find(email);
    if (inUse.length) {
      throw new BadRequestException('email in use.');
    }
    // hash the user's password
    // Generate a salt
    const salt = randomBytes(8).toString('hex');
    console.log('salt : ', salt);
    // Hash the salt and the password togrther
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    // Join the hashed result and store it in db
    const result = salt + '.' + hash.toString('hex');
    // create a new user and save it
    const user = await this.usersService.create(email, result);
    // return user
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('No user with such email!');
    }
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Password is not correct!');
    }
    return user;
  }
}
