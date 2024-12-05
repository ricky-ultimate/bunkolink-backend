import { IsInt, Min } from 'class-validator';

export class BorrowBookDto {
  @IsInt()
  @Min(1)
  bookId: number;

  @IsInt()
  @Min(1)
  studentId: number;
}
