import { validate } from 'class-validator';
import { UserRole } from '../enum/user-role.enum';
import { UserDto } from './user.dto';

describe('UserDto', () => {
  let userDto: UserDto;

  beforeEach(() => {
    userDto = new UserDto();
    userDto.username = 'test';
    userDto.password = 'Test123.';
  });
  describe('username', () => {
    it('should validate a valid username', async () => {
      userDto.username = 'test';
      const errors = await validate(userDto);
      expect(errors).toHaveLength(0);
    });

    it('should fail when username is too short', async () => {
      userDto.username = 'tes';
      const errors = await validate(userDto);
      expect(errors).toHaveLength(1);
    });

    it('should fail when username is too long', async () => {
      userDto.username = 'testtesttesttesttesttesttesttesttesttest';
      const errors = await validate(userDto);
      expect(errors).toHaveLength(1);
    });
  });

  describe('password', () => {
    it('should validate a valid password', async () => {
      userDto.password = 'Test123.';
      const errors = await validate(userDto);
      expect(errors).toHaveLength(0);
    });

    it('should fail when password is too short', async () => {
      userDto.password = 'testtes';
      const errors = await validate(userDto);
      expect(errors).toHaveLength(1);
    });

    it('should fail when password is too long', async () => {
      userDto.password =
        'testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest';
      const errors = await validate(userDto);
      expect(errors).toHaveLength(1);
    });

    it('should fail when password is not matching regex', async () => {
      userDto.password = 'test';
      const errors = await validate(userDto);
      expect(errors).toHaveLength(1);
    });
  });

  describe('role', () => {
    it('should validate a valid role', async () => {
      userDto.role = UserRole.ADMIN;
      const errors = await validate(userDto);
      expect(errors).toHaveLength(0);
    });

    it('should fail when role is invalid', async () => {
      userDto.role = 'INVALID_ROLE' as UserRole;
      const errors = await validate(userDto);
      expect(errors).toHaveLength(1);
    });
  });
});
