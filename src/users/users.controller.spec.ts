import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersSrvice: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersSrvice = {
      findOne(id: number) {
        return Promise.resolve({
          id,
          email: 'test@fake.com',
          password: 'password',
        } as User);
      },

      find(email: string) {
        return Promise.resolve([
          { id: 1, email, password: 'password' } as User,
        ]);
      },
      // remove(id) {},
      // update(id, attrs) {},
    };
    fakeAuthService = {
      // signup(email, password) {},
      signin(email: string, password: string) {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersSrvice },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email.', async () => {
    const users = await controller.findAllUsers('test@fake.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('test@fake.com');
  });

  it('findUser returns a single user with a given ID', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with given ID is not found.', async () => {
    fakeUsersSrvice.findOne = () => null;
    expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('signin updates session object and returns user', async () => {
    const session = {userId:-1};
    const user = await controller.signin(
      { email: 'test@fake.com', password: 'password' },
      session,
    );
    expect(user.id).toEqual(1);
    expect(session).toBeDefined();
  });
});
