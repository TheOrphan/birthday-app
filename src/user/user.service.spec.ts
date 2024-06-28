import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './user.entity';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const user = await service.create({
      firstName: 'John',
      lastName: 'Doe',
      birthday: '01-01-2000',
      city: 'new york',
      email: 'john.doe@example.com',
    } as User);
    expect(user).toBeDefined();
    expect(user.firstName).toBe('John');
  });

  it('should find all users', async () => {
    await service.create({
      firstName: 'John',
      lastName: 'Doe',
      birthday: '01-01-2000',
      city: 'new york',
      email: 'john.doe@example.com',
    } as User);
    const users = await service.findAll();
    expect(users.length).toBeGreaterThan(0);
  });
});
