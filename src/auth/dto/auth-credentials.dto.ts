import { PickType } from '@nestjs/swagger';
import { UserDto } from '../../users/dto/user.dto';

export class AuthCredentialsDto extends PickType(UserDto, [
  'username',
  'password',
]) {}
