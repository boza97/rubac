import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UserDto } from './dto/user.dto';
import { UserRole } from './enum/user-role.enum';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const createMockUsersService = (): Partial<Record<keyof UsersService, jest.Mock>> => ({
  create: jest.fn(),
  updateUserRole: jest.fn(),
});

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: createMockUsersService() }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call UsersService.create with the given UserDto', async () => {
      const userDto: UserDto = { username: 'testuser', password: 'testpassword' };
      await controller.create(userDto);

      expect(usersService.create).toHaveBeenCalledWith(userDto);
    });
  });

  describe('updateTaskStatus', () => {
    it('should call UsersService.updateUserRole with the given id and role', async () => {
      const updateUserRoleDto: UpdateUserRoleDto = { role: UserRole.ADMIN };
      const expectedUser: Omit<User, 'password'> = {
        id: '1',
        username: 'test',
        role: UserRole.ADMIN,
      };
      jest.spyOn(usersService, 'updateUserRole').mockResolvedValueOnce(expectedUser);

      const actualUser = await controller.updateUserRole('1', updateUserRoleDto);

      expect(usersService.updateUserRole).toHaveBeenCalledWith('1', UserRole.ADMIN);
      expect(actualUser).toEqual(expectedUser);
    });
  });
});
