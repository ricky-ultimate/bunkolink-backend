import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';

export function ApiLogin() {
  return applyDecorators(
    ApiOperation({ summary: 'User Login' }),
    ApiResponse({
      status: 200,
      description: 'User successfully logged in.',
    }),
    ApiUnauthorizedResponse({ description: 'Invalid credentials.' }),
  );
}

export function ApiRegister() {
  return applyDecorators(
    ApiOperation({ summary: 'User Signup' }),
    ApiCreatedResponse({ description: 'User successfully signed up.' }),
    ApiBadRequestResponse({ description: 'Invalid input.' }),
  );
}
