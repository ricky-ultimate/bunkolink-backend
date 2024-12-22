import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsISBN, Min, IsNotEmpty } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ description: 'Title of the book', example: 'The Great Gatsby' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Author of the book', example: 'F. Scott Fitzgerald' })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({ description: 'ISBN of the book', example: '978-0743273565' })
  @IsISBN()
  ISBN: string;

  @ApiProperty({ description: 'Number of copies available', example: 5, minimum: 1 })
  @IsInt()
  @Min(1)
  availableCopies: number;
}
