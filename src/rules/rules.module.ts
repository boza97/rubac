import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { RulesService } from './rules.service';

@Module({
  providers: [RulesService],
  imports: [AuthModule],
  exports: [RulesService],
})
export class RulesModule {}
