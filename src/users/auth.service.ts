import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email:string, password:string){
    // see if email is in use
    const inUse = await this.usersService.find(email);
    console.log(inUse)
    if(inUse.length){
      throw new BadRequestException('email in use.')
    }

    // hash the user's password
    // Generate a salt
    const salt = randomBytes(8).toString('hex');
    console.log('salt : ', salt)

    // Hash the salt and the password togrther
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    

    // Join the hashed result and store it in db
    const result = salt + '.' + hash.toString('hex')

    // create a new user and save it
    const user = await this.usersService.create(email, result);
    // return user
    return user;
  }

  signin(){

  }
}
