import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { RulesGuard } from '../rules/rules.guard';

@ApiBearerAuth()
@ApiTags('AdminControllerV2')
@ApiHeader({ name: 'Accept', required: true, example: 'application/json;v=2' })
@Controller({ path: 'admin', version: '2' })
@UseGuards(AuthGuard(), RulesGuard)
export class AdminControllerV2 {
  @Get('/users')
  users() {
    return 'Admin Users V2';
  }
}
