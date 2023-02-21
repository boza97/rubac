import { Body, Controller, Param, Patch } from '@nestjs/common';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('/:id/role')
  updateUserRole(
    @Param('id') id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto
  ): Promise<Omit<User, 'password'>> {
    const { role } = updateUserRoleDto;
    return this.usersService.updateUserRole(id, role);
  }
}
