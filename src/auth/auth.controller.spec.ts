import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

const createMockAuthService = (): Partial<Record<keyof AuthService, jest.Mock>> => ({
  signUp: jest.fn(),
  signin: jest.fn(),
});

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: createMockAuthService() }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    it('should call signUp method of authService with the correct credentials', async () => {
      const authCredentialsDto: AuthCredentialsDto = {
        username: 'test',
        password: 'Test123.',
      };
      const signUpSpy = jest.spyOn(authService, 'signUp').mockResolvedValue(undefined);

      await controller.signUp(authCredentialsDto);

      expect(signUpSpy).toHaveBeenCalledWith(authCredentialsDto);
    });
  });

  describe('signIn', () => {
    it('should call signIn method of authService with the correct credentials and return the access token', async () => {
      const authCredentialsDto: AuthCredentialsDto = {
        username: 'test',
        password: 'Test123.',
      };
      const accessToken = 'access-token';
      const signInSpy = jest.spyOn(authService, 'signin').mockResolvedValue({ accessToken });

      const result = await controller.signIn(authCredentialsDto);

      expect(signInSpy).toHaveBeenCalledWith(authCredentialsDto);
      expect(result).toEqual({ accessToken });
    });
  });
});
