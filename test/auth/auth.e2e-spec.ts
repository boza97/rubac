import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { AuthModule } from '../../src/auth/auth.module';
import { UserDto } from '../../src/users/dto/user.dto';
import { UserRole } from '../../src/users/enum/user-role.enum';
import { UsersService } from '../../src/users/users.service';

const configuration = () => ({
  JWT_SECRET: 'topSecret51',
});

describe('[Feature] Auth - /auth', () => {
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
        ConfigModule.forRoot({
          load: [configuration],
        }),
        AuthModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    usersService = app.get(UsersService);
  });

  describe('/signup (POST)', () => {
    it('should create a new user and return HttpStatus.CREATED', async () => {
      const userDto: UserDto = {
        username: 'testSignup',
        password: 'Test123.',
      };

      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(userDto)
        .expect(HttpStatus.CREATED)
        .then(async () => {
          const dbUser = await usersService.getUserByUsername(userDto.username);
          expect(dbUser.username).toBe(userDto.username);
          expect(dbUser.role).toBe(UserRole.DEFAULT);
        });
    });

    it('should return HttpStatus.CONFLICT when user with given username already exist in db', async () => {
      const userDto: UserDto = {
        username: 'testSignupConflict',
        password: 'Test1234.',
      };

      await usersService.create(userDto);

      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(userDto)
        .expect(HttpStatus.CONFLICT);
    });
  });

  describe('/signin (POST)', () => {
    it('should return an access token when valid credentials are provided and HttpStatus.CREATED', async () => {
      const userDto: UserDto = {
        username: 'testSignin',
        password: 'Test12345.',
      };

      await usersService.create(userDto);

      return request(app.getHttpServer())
        .post('/auth/signin')
        .send(userDto)
        .expect(HttpStatus.CREATED)
        .then(({ body }) => {
          expect(body.accessToken).toBeTruthy();
        });
    });

    it('should return HttpStatus.NOT_FOUND when user does not exist in db', () => {
      const userDto: UserDto = {
        username: 'UserNotFound',
        password: 'Test12345.',
      };

      return request(app.getHttpServer())
        .post('/auth/signin')
        .send(userDto)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should return HttpStatus.UNAUTHORIZED when invalid password is provided', async () => {
      const userDto: UserDto = {
        username: 'WrongPassword',
        password: 'Test123456.',
      };

      await usersService.create(userDto);

      return request(app.getHttpServer())
        .post('/auth/signin')
        .send({ username: userDto.username, password: 'Bad1234.' })
        .expect(HttpStatus.UNAUTHORIZED)
        .then(({ body }) => {
          expect(body.message).toEqual('Please check your auth credentials.');
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
