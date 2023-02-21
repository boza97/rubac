import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { RulesModule } from '../rules/rules.module';
import { AdminController } from './admin.controller';

@Module({
  controllers: [AdminController],
  imports: [AuthModule, RulesModule],
})
export class AdminModule {}
