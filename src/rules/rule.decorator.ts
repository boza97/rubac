import { SetMetadata } from '@nestjs/common';
import { RuleEnum } from './enum/rule.enum';

export const Rule = (ruleId: RuleEnum) => SetMetadata('rule', ruleId);
