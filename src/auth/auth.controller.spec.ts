import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BadRequestException } from '@nestjs/common';
import { Role } from '@prisma/client';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call login method in AuthService', async () => {
    const loginSpy = jest.spyOn(service, 'login').mockResolvedValueOnce({
      accessToken: 'valid_jwt_token',
      user: { id: 1, email: 'test@example.com', role: Role.USER },
    });

    const response = await controller.login({
      email: 'test@example.com',
      password: 'password',
    });

    expect(loginSpy).toHaveBeenCalledWith('test@example.com', 'password');
    expect(response).toHaveProperty('accessToken', 'valid_jwt_token');
  });

  it('should call register method in AuthService', async () => {
    const registerSpy = jest.spyOn(service, 'register').mockResolvedValueOnce({
      id: 1,
      email: 'new@example.com',
      password: 'hashedPassword',
      role: Role.USER,
    });

    const response = await controller.register({
      email: 'new@example.com',
      password: 'password',
      role: 'USER',
    });

    expect(registerSpy).toHaveBeenCalledWith(
      'new@example.com',
      'password',
      'USER',
    );
    expect(response).toHaveProperty('email', 'new@example.com');
  });

  it('should throw BadRequestException for invalid role', async () => {
    await expect(
      controller.register({
        email: 'new@example.com',
        password: 'password',
        role: 'INVALID_ROLE',
      }),
    ).rejects.toThrowError(BadRequestException);
  });
});
