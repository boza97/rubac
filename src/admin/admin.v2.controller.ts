import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RulesGuard } from '../rules/rules.guard';

@ApiTags('rubac')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiForbiddenResponse({ description: 'Access Forbidden' })
@Controller({ path: 'admin', version: '2' })
@UseGuards(AuthGuard(), RulesGuard)
export class AdminControllerV2 {
  @Get('/users')
  users() {
    return 'Admin Users V2';
  }
}
