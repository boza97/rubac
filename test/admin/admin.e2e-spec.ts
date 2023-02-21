import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { AdminModule } from '../../src/admin/admin.module';
import { AuthService } from '../../src/auth/auth.service';
import { UserDto } from '../../src/users/dto/user.dto';

const configuration = () => ({
  JWT_SECRET: 'topSecret51',
});

describe('[Feature] Admin - /admin', () => {
  let app: INestApplication;
  let authService: AuthService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
          host: 'localhost',
          port: 5433,
          username: 'postgres',
          password: 'postgres',
          database: 'postgres',
        }),
        ConfigModule.forRoot({
          load: [configuration],
        }),
        AdminModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    authService = app.get(AuthService);
  });

  describe('/users (GET)', () => {
    it('should return HttpStatus.FORBIDDEN when user is not passing admin rules', async () => {
      const userDto: UserDto = {
        username: 'testAdmin',
        password: 'Test1234567.',
      };

      await authService.signUp(userDto);
      const jwtToken: { accessToken: string } = await authService.signin(userDto);

      return request(app.getHttpServer())
        .get('/admin/users')
        .set('Authorization', `Bearer ${jwtToken.accessToken}`)
        .send()
        .expect(HttpStatus.FORBIDDEN);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
