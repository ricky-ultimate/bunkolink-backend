import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BorrowBookDto {
  @ApiProperty({ description: 'The ID of the desired book', example: '5' })
  @IsInt()
  @Min(1)
  bookId: number;

  @ApiProperty({description: 'The ID of the borrowing student', example: '8'})
  @IsInt()
  @Min(1)
  studentId: number;
}
