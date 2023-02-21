import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { UserRole } from '../enum/user-role.enum';

export class UserDto {
  @ApiProperty({ description: 'The username of a user' })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @ApiProperty({ description: 'The password of a user' })
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must contain at least 1 upper case letter, 1 lower case letter, 1 number or special cgaracter',
  })
  password: string;

  @ApiProperty({ description: 'The role of a user' })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
