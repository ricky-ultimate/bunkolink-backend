import { IsString, IsNotEmpty, IsAlphanumeric } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsAlphanumeric()
  matricNumber: string;

  @IsString()
  @IsNotEmpty()
  level: string;

  @IsString()
  @IsNotEmpty()
  department: string;
}
