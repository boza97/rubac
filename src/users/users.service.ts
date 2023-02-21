import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserResponseDto } from './dto/user-response.dto';
import { UserDto } from './dto/user.dto';
import { UserErrors } from './enum/user-errors.enum';
import { UserRole } from './enum/user-role.enum';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(userDto: UserDto): Promise<void> {
    try {
      await this.usersRepository.createUser(userDto);
    } catch (error) {
      if (error.code == UserErrors.DUPLICATE_KEY) {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getUserByUsername(username: string): Promise<User> {
    const found = await this.usersRepository.findOne({ where: { username } });
    if (!found) {
      throw new NotFoundException('User not found');
    }

    return found;
  }

  async updateUserRole(id: string, role: UserRole): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.role = role;
    await this.usersRepository.save(user);
    const { password, ...value } = user;

    return value;
  }
}
