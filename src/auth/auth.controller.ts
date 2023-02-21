import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@ApiTags('rubac')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({ description: 'You have successfully signup' })
  @ApiConflictResponse({ description: 'Username already exist' })
  @Post('/signup')
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @ApiCreatedResponse({
    description: 'You have successfully signin',
    type: AuthResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Please check your auth credentials' })
  @Post('/signin')
  signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<AuthResponseDto> {
    return this.authService.signin(authCredentialsDto);
  }
}
