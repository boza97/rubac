import { Body, Controller, Param, Patch } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, OmitType } from '@nestjs/swagger';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({
    description: 'The user role has been successfully updated.',
    type: OmitType(User, ['password'] as const),
  })
  @ApiNotFoundResponse({ description: 'The user was not found' })
  @Patch('/:id/role')
  updateUserRole(
    @Param('id') id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto
  ): Promise<Omit<User, 'password'>> {
    const { role } = updateUserRoleDto;
    return this.usersService.updateUserRole(id, role);
  }
}
