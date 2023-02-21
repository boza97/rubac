import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { RulesService } from '../rules/rules.service';
import { AdminControllerV2 } from './admin.v2.controller';

describe('AdminControllerV2', () => {
  let controller: AdminControllerV2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminControllerV2],
      imports: [
        PassportModule.register({
          defaultStrategy: 'jwt',
        }),
      ],
      providers: [RulesService],
    }).compile();

    controller = module.get<AdminControllerV2>(AdminControllerV2);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
