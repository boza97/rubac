import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { RuleEnum } from './enum/rule.enum';
import { RulesService } from './rules.service';

@Injectable()
export class RulesGuard implements CanActivate {
  constructor(private readonly rulesService: RulesService, private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const ruleId =
      this.reflector.get<RuleEnum>('rule', context.getClass()) ||
      this.reflector.get<RuleEnum>('rule', context.getHandler());
    if (!ruleId) return true;

    return this.rulesService.evaluate(ruleId, req, req.user as UserResponseDto);
  }
}
