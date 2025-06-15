import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

export function ApiCreateBook() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new book' }),
    ApiResponse({ status: 201, description: 'Book created successfully' }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
    ApiConflictResponse({
      description: 'Book with this ISBN already exists',
    }),
  );
}

export function ApiGetBooks() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all books with optional filtering and pagination',
    }),
    ApiQuery({ name: 'title', required: false }),
    ApiQuery({ name: 'author', required: false }),
    ApiQuery({ name: 'ISBN', required: false }),
    ApiQuery({ name: 'isAvailable', required: false, type: Boolean }),
    ApiQuery({ name: 'page', required: false, type: Number }),
    ApiQuery({ name: 'limit', required: false, type: Number }),
  );
}

export function ApiGetBookById() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a book by ID' }),
    ApiParam({ name: 'id', description: 'Book ID' }),
    ApiResponse({ status: 200, description: 'Book found' }),
    ApiNotFoundResponse({ description: 'Book not found' }),
  );
}

export function ApiUpdateBook() {
  return applyDecorators(
    ApiOperation({ summary: 'Update a book' }),
    ApiParam({ name: 'id', description: 'Book ID' }),
    ApiResponse({ status: 200, description: 'Book updated successfully' }),
    ApiNotFoundResponse({ description: 'Book not found' }),
  );
}

export function ApiDeleteBook() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a book' }),
    ApiParam({ name: 'id', description: 'Book ID' }),
    ApiResponse({ status: 200, description: 'Book deleted successfully' }),
    ApiNotFoundResponse({ description: 'Book not found' }),
  );
}
