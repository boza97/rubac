import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RuleEnum } from '../rules/enum/rule.enum';
import { Rule } from '../rules/rule.decorator';
import { RulesGuard } from '../rules/rules.guard';

@Controller({ path: 'admin', version: '2' })
@Rule(RuleEnum.Workflow2)
@UseGuards(AuthGuard(), RulesGuard)
export class AdminControllerV2 {
  @Get('/users')
  users() {
    return 'Admin Users V2';
  }
}
