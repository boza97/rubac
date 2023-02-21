import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserDto } from './dto/user.dto';
import { UserErrors } from './enum/user-errors.enum';
import { UserRole } from './enum/user-role.enum';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

const createMockUsersRepository = (): Partial<Record<keyof UsersRepository, jest.Mock>> => ({
  createUser: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: createMockUsersRepository() },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userDto: UserDto = { username: 'test', password: 'Test123.' };
      await service.create(userDto);

      expect(usersRepository.createUser).toHaveBeenCalledWith(userDto);
    });

    it('should throw ConflictException when the username already exists', async () => {
      const userDto: UserDto = { username: 'test', password: 'Test123.' };
      jest
        .spyOn(usersRepository, 'createUser')
        .mockRejectedValueOnce({ code: UserErrors.DUPLICATE_KEY });

      await expect(service.create(userDto)).rejects.toThrow(ConflictException);
    });

    it('should throw InternalServerErrorException when an error occurs', async () => {
      const userDto: UserDto = { username: 'test', password: 'Test123.' };
      jest.spyOn(usersRepository, 'createUser').mockRejectedValueOnce({});

      await expect(service.create(userDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('getUserByUsername', () => {
    it('should return a user by their username', async () => {
      const user: User = {
        id: '1',
        username: 'test',
        password: 'Test123.',
        role: UserRole.DEFAULT,
      };
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(user);
      const result = await service.getUserByUsername('test');

      expect(result).toEqual(user);
    });

    it('should throw a NotFoundException if the user is not found', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.getUserByUsername('test')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateUserRole', () => {
    it('should update the user role', async () => {
      const user: User = {
        id: '1',
        username: 'test',
        password: 'Test123.',
        role: UserRole.DEFAULT,
      };
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(user);
      const result = await service.updateUserRole('1', UserRole.ADMIN);

      expect(usersRepository.save).toHaveBeenCalledWith({ ...user, role: UserRole.ADMIN });
      expect(result).toEqual({ id: '1', username: 'test', role: UserRole.ADMIN });
    });

    it('should throw a NotFoundException if the user is not found', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.updateUserRole('1', UserRole.ADMIN)).rejects.toThrow(NotFoundException);
    });
  });
});
