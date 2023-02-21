import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { UserDto } from './user.dto';

export class UserResponseDto extends OmitType(UserDto, ['password']) {
  @ApiProperty()
  @IsUUID()
  id: string;
}
