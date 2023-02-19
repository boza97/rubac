import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RuleEnum } from '../rules/enum/rule.enum';
import { Rule } from '../rules/rule.decorator';
import { RulesGuard } from '../rules/rules.guard';

@Controller('admin')
@Rule(RuleEnum.Workflow1)
@UseGuards(AuthGuard(), RulesGuard)
export class AdminController {
  @Get('/users')
  users() {
    return 'Admin Users';
  }
}
