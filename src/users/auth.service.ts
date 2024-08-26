import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email:string, password:string){
    // see if email is in use
    const inUse = await this.usersService.find(email);
    if(inUse){
      throw new BadRequestException('email in use.')
    }

    // hash the user's password
    
    // create a new user and save it
    // return user
  }

  signin(){

  }
}
