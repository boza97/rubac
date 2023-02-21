import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { UserRole } from '../users/enum/user-role.enum';
import { User } from '../users/user.entity';
import { RuleEnum } from './enum/rule.enum';
import { RulesModule } from './rules.module';
import { RulesService } from './rules.service';

describe('RulesService', () => {
  let service: RulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RulesModule],
    }).compile();

    service = module.get<RulesService>(RulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('evaluate', () => {
    let request: Request;
    let user: Omit<User, 'password'>;
    const workflows = [1, 2];

    beforeEach(() => {
      request = {
        ip: '100.100.100.100',
        path: '/admin/users',
      } as Request;
      user = {
        id: '1',
        username: 'admin',
        role: 'ADMIN',
      } as Omit<User, 'password'>;
    });

    it('should evaluate to true when all rules are satisfied', () => {
      workflows.forEach((workflowId) => {
        if (workflowId === RuleEnum.Workflow2) {
          request.ip = '100.100.100.2';
        }

        const result = service.evaluate(workflowId, request, user);

        expect(result).toBe(true);
      });
    });

    it('should evaluate to true when workflow path is not match', () => {
      request.path = 'path';
      workflows.forEach((workflowId) => {
        const result = service.evaluate(workflowId, request, user);

        expect(result).toBe(true);
      });
    });

    it('should evaluate to false when workflow rules are not satisfied', () => {
      workflows.forEach((workflowId) => {
        request.ip = '127.0.0.1';
        let result;

        result = service.evaluate(workflowId, request, user);

        expect(result).toBe(false);

        request.ip = workflowId === RuleEnum.Workflow1 ? '100.100.100.100' : '100.100.100.2';
        user.role = UserRole.DEFAULT;

        result = service.evaluate(workflowId, request, user);

        expect(result).toBe(false);
      });
    });

    it('should throw InternalServerErrorException when workflowId is invalid', () => {
      try {
        service.evaluate(null, request, user);
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerErrorException);
        expect(err.message).toEqual(`Workflow with ID null not found`);
      }
    });
  });
});
