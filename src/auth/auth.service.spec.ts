import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../users/enum/user-role.enum';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

const createMockUsersService = (): Partial<Record<keyof UsersService, jest.Mock>> => ({
  create: jest.fn(),
  getUserByUsername: jest.fn(),
});

const createMockJwtService = (): Partial<Record<keyof JwtService, jest.Mock>> => ({
  sign: jest.fn(() => 'access-token'),
});

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: createMockUsersService() },
        { provide: JwtService, useValue: createMockJwtService() },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('should call create method of usersService with the correct credentials', async () => {
      const authCredentialsDto: AuthCredentialsDto = {
        username: 'test',
        password: 'Test123.',
      };

      await service.signUp(authCredentialsDto);

      expect(usersService.create).toHaveBeenCalledWith(authCredentialsDto);
    });
  });

  describe('signin', () => {
    const authCredentialsDto: AuthCredentialsDto = {
      username: 'test',
      password: 'Test123.',
    };

    const user = {
      id: '1',
      username: 'test',
      password: 'Test123.',
      role: UserRole.DEFAULT,
    };

    beforeEach(() => {
      jest.spyOn(usersService, 'getUserByUsername').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);
    });

    it('should return access token when credentials are valid', async () => {
      const result = await service.signin(authCredentialsDto);

      expect(result).toEqual({ accessToken: 'access-token' });
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: 'test',
        role: UserRole.DEFAULT,
      });
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => false);

      await expect(service.signin(authCredentialsDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      jest.spyOn(usersService, 'getUserByUsername').mockResolvedValue(null);

      await expect(service.signin(authCredentialsDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
