import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

export function ApiBorrowBook() {
  return applyDecorators(
    ApiOperation({ summary: 'Borrow a book' }),
    ApiResponse({ status: 201, description: 'Book borrowed successfully' }),
    ApiBadRequestResponse({
      description: 'Invalid input or no copies available',
    }),
    ApiNotFoundResponse({ description: 'Book or student not found' }),
  );
}

export function ApiReturnBook() {
  return applyDecorators(
    ApiOperation({ summary: 'Return a borrowed book' }),
    ApiParam({ name: 'id', description: 'Borrow record ID' }),
    ApiResponse({ status: 200, description: 'Book returned successfully' }),
    ApiNotFoundResponse({ description: 'Borrow record not found' }),
    ApiBadRequestResponse({ description: 'Book already returned' }),
  );
}

export function ApiGetBorrowedBooks() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all borrowed book records' }),
    ApiQuery({ name: 'borrowDate', required: false }),
    ApiQuery({ name: 'studentName', required: false }),
    ApiQuery({ name: 'studentMatricNo', required: false }),
    ApiResponse({ status: 200, description: 'List of borrowed book records.' }),
  );
}
