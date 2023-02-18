import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UserDto } from './dto/user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() userDto: UserDto): Promise<void> {
    return this.usersService.create(userDto);
  }

  @Patch('/:id/role')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto
  ): Promise<Omit<User, 'password'>> {
    const { role } = updateUserRoleDto;
    return this.usersService.updateUserRole(id, role);
  }
}
