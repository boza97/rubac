import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { RulesService } from '../rules/rules.service';
import { AdminControllerV1 } from './admin.v1.controller';

describe('AdminControllerV1', () => {
  let controller: AdminControllerV1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminControllerV1],
      imports: [
        PassportModule.register({
          defaultStrategy: 'jwt',
        }),
      ],
      providers: [RulesService],
    }).compile();

    controller = module.get<AdminControllerV1>(AdminControllerV1);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
