import { PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class UpdateUserRoleDto extends PickType(UserDto, ['role']) {}
