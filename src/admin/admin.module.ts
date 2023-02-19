import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { RulesModule } from 'src/rules/rules.module';
import { AdminController } from './admin.controller';

@Module({
  controllers: [AdminController],
  imports: [AuthModule, RulesModule],
})
export class AdminModule {}
