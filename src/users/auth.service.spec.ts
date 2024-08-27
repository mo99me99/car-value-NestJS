import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // Create a fake copy of the users service
    fakeUsersService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
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
    fakeUsersService.find = () =>
      Promise.resolve([
        {
          email: 'test@fake.com',
          password:
            '906fbe9c27307fab.64beb175f97ca3ce434842358da506ca28f34e9c4f5e5c399ecbf8da14dcb269',
        } as User,
      ]);
    const user = await service.signin('test@fake.com', 'password');
    expect(user).toBeDefined();
  });
});
