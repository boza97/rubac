import { Controller, Get } from '@nestjs/common';

@Controller('admin')
export class AdminController {
  @Get('/users')
  users() {
    return 'Admin Users';
  }
}
