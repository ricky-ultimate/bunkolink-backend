import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

export function ApiCreateStudent() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new student' }),
    ApiResponse({ status: 201, description: 'Student created successfully' }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
  );
}

export function ApiGetStudents() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all students' }),
    ApiQuery({ name: 'name', required: false }),
    ApiQuery({ name: 'matricNumber', required: false }),
    ApiQuery({ name: 'level', required: false }),
    ApiQuery({ name: 'department', required: false }),
  );
}

export function ApiGetStudentById() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a student by ID' }),
    ApiParam({ name: 'id', description: 'Student ID' }),
    ApiResponse({ status: 200, description: 'Student found' }),
    ApiNotFoundResponse({ description: 'Student not found' }),
  );
}

export function ApiUpdateStudent() {
  return applyDecorators(
    ApiOperation({ summary: 'Update a student' }),
    ApiParam({ name: 'id', description: 'Student ID' }),
    ApiResponse({ status: 200, description: 'Student Updated' }),
    ApiNotFoundResponse({ description: 'Student not found.' }),
    ApiBadRequestResponse({ description: 'Invalid input data.' }),
  );
}

export function ApiDeleteStudent() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a student' }),
    ApiParam({ name: 'id', description: 'Student ID' }),
    ApiResponse({ status: 200, description: 'Student Deleted' }),
    ApiNotFoundResponse({ description: 'Student not found.' }),
  );
}
