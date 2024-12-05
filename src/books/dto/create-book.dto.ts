import { IsString, IsInt, IsISBN, Min, IsNotEmpty } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsISBN()
  ISBN: string;

  @IsInt()
  @Min(1)
  availableCopies: number;
}
