import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    // Create a fake copy of the users service
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 1000),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = service.signup('email@test', 'password');
    expect((await user).password).not.toEqual('password');
    const [salt, hash] = (await user).password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);

    await expect(service.signup('test@fake.com', 'password')).rejects.toThrow();
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signin('nonUsedEmail@fake.com', 'password'),
    ).rejects.toThrow();
  });

  it('throws if an invalid password is provided', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        { email: 'test@fake.com', password: 'password' } as User,
      ]);

    await expect(service.signin('email@gmail.com', 'pswd')).rejects.toThrow();
  });

  it('returns a user if correct password provided.', async () => {
    await service.signup('test@fake.com', 'password')
    const user = await service.signin('test@fake.com', 'password');
    expect(user).toBeDefined();
  });
});
