import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(public usersService: UsersService) {
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session;
    if (userId) {
      const user = await this.usersService.findOne(userId);
      request.currentUser = user;
    }

    return request.session.userId;
  }
}
