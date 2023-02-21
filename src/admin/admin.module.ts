import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { RulesModule } from '../rules/rules.module';
import { AdminControllerV1 } from './admin.v1.controller';
import { AdminControllerV2 } from './admin.v2.controller';

@Module({
  controllers: [AdminControllerV1, AdminControllerV2],
  imports: [AuthModule, RulesModule],
})
export class AdminModule {}
