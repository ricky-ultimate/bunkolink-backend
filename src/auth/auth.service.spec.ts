import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, PrismaService, JwtService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate a user with correct credentials', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce({
      id: 1,
      email: 'test@example.com',
      password: await bcrypt.hash('password', 10),
      role: Role.USER,
      studentId: null,
    });

    const user = await service.validateUser('test@example.com', 'password');
    expect(user).toHaveProperty('email', 'test@example.com');
  });

  it('should throw error for invalid credentials', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(null);
    await expect(
      service.validateUser('wrong@example.com', 'password'),
    ).rejects.toThrowError('Invalid credentials.');
  });

  it('should generate a valid JWT token on login', async () => {
    jest.spyOn(service, 'validateUser').mockResolvedValueOnce({
      id: 1,
      email: 'test@example.com',
      password: 'hashedPassword',
      role: Role.USER,
      studentId: null,
    });
    const jwtSignSpy = jest.spyOn(service['jwtService'], 'sign');
    await service.login('test@example.com', 'password');
    expect(jwtSignSpy).toHaveBeenCalled();
  });

  it('should register a new user successfully', async () => {
    jest.spyOn(prisma.user, 'create').mockResolvedValueOnce({
      id: 1,
      email: 'new@example.com',
      password: 'hashedPassword',
      role: Role.USER,
      studentId: null,
    });

    const user = await service.register(
      'new@example.com',
      'password',
      Role.USER,
    );
    expect(user).toHaveProperty('email', 'new@example.com');
  });
});
