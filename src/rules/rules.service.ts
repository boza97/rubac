import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Request } from 'express';
import { readFileSync } from 'fs';
import * as ip from 'ip';
import * as net from 'net';
import * as path from 'path';
import { Script } from 'vm';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { RuleEnum } from './enum/rule.enum';
import { Workflow } from './workflow';

@Injectable()
export class RulesService {
  private workflows: Workflow[];

  constructor() {
    const data = readFileSync(path.resolve(__dirname, '../resources/workflows.json'), 'utf-8');
    this.workflows = JSON.parse(data);
  }

  evaluate(workflowId: RuleEnum, request: Request, user: UserResponseDto): boolean {
    const workflow = this.workflows.find((w) => w.WorkflowID === workflowId);
    if (!workflow) {
      throw new InternalServerErrorException(`Workflow with ID ${workflowId} not found`);
    }

    if (!request.path.match(workflow.Path)) {
      return true;
    }

    const context: any = {
      $request: {
        getIpAddress: this.convertIp(request.ip),
      },
      $user: {
        getRole: user.role,
      },
      $in: (value: string, ...options: string[]) => {
        return options.some((option) => value === option);
      },
      $ip_range: (ipAddress: string, range: string) => {
        return ip.cidrSubnet(range).contains(ipAddress);
      },
    };

    for (const param of workflow.Params) {
      const script = new Script(param.Expression);
      context[`$${param.Name}`] = script.runInNewContext(context);
    }

    for (const rule of workflow.Rules) {
      const script = new Script(rule.Expression);
      const result = script.runInNewContext(context);
      if (!result) {
        return false;
      }
    }

    return true;
  }

  private convertIp(ipAddress: string): string {
    if (ipAddress === '::1') return '127.0.0.1';
    if (!ip.isV4Format(ipAddress) && net.isIP(ipAddress) !== 0) {
      return ip.toBuffer(ipAddress).slice(12, 16).join('.');
    }
    return ipAddress;
  }
}
