import { Body, Controller, Param, Patch } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';

@ApiTags('rubac')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({
    description: 'The user role has been successfully updated.',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({ description: 'The user was not found' })
  @ApiParam({ name: 'id', type: 'uuid' })
  @Patch('/:id/role')
  updateUserRole(
    @Param('id') id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto
  ): Promise<UserResponseDto> {
    const { role } = updateUserRoleDto;
    return this.usersService.updateUserRole(id, role);
  }
}
