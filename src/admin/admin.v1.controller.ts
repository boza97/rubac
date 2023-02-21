import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { RuleEnum } from '../rules/enum/rule.enum';
import { Rule } from '../rules/rule.decorator';
import { RulesGuard } from '../rules/rules.guard';

@ApiBearerAuth()
@ApiTags('AdminControllerV1')
@ApiHeader({ name: 'Accept', required: true, example: 'application/json;v=1' })
@Controller({ path: 'admin', version: '1' })
@Rule(RuleEnum.Workflow1)
@UseGuards(AuthGuard(), RulesGuard)
export class AdminControllerV1 {
  @Get('/users')
  users() {
    return 'Admin Users V1';
  }
}
