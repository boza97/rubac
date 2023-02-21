import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { UserDto } from '../../src/users/dto/user.dto';
import { UserRole } from '../../src/users/enum/user-role.enum';
import { UsersModule } from '../../src/users/users.module';
import { UsersService } from '../../src/users/users.service';

describe('[Feature] Users - /users', () => {
  let app: INestApplication;
  let usersService: UsersService;

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
        UsersModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    usersService = app.get(UsersService);
  });

  describe('/:id/role (PATCH)', () => {
    it('should update a user role and return HttpStatus.OK', async () => {
      const userDto: UserDto = {
        username: 'testPatch',
        password: 'Test123.',
      };

      await usersService.create(userDto);
      const dbUser = await usersService.getUserByUsername(userDto.username);

      expect(dbUser.role).toBe(UserRole.DEFAULT);

      const updateDto = { role: UserRole.ADMIN };

      return request(app.getHttpServer())
        .patch(`/users/${dbUser.id}/role`)
        .send(updateDto)
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          expect(body).toMatchObject({
            username: userDto.username,
            role: updateDto.role,
          });
        });
    });

    it('should return HttpStatus.NOT_FOUND when user does not exist in db', () => {
      return request(app.getHttpServer())
        .patch(`/users/cf89ab2c-e43f-bbbb-aaaa-b7f55418ab84/role`)
        .send({ role: UserRole.ADMIN })
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
