import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsAlphanumeric } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({ description: 'Name of the student', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Matric number of the student', example: 'BGH012345678' })
  @IsString()
  @IsAlphanumeric()
  matricNumber: string;

  @ApiProperty({ description: 'The student\'s level in the university', example: '300' })
  @IsString()
  @IsNotEmpty()
  level: string;

  @ApiProperty({description: 'Department of the student', example: 'Computer Science and Mathematics' })
  @IsString()
  @IsNotEmpty()
  department: string;
}
