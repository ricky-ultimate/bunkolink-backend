import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Role } from '@prisma/client';
import { ApiLogin, ApiRegister } from './decorators/auth.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiLogin()
  @Post('login')
  async login(
    @Body() { email, password }: { email: string; password: string },
  ) {
    return this.authService.login(email, password);
  }

  @ApiRegister()
  @Post('register')
  async register(
    @Body()
    {
      email,
      password,
      role,
      studentId,
    }: {
      email: string;
      password: string;
      role: string;
      studentId?: number;
    },
  ) {
    if (!Object.values(Role).includes(role as Role)) {
      throw new BadRequestException(`Invalid role: ${role}`);
    }
    return this.authService.register(email, password, role as Role, studentId);
  }
}
