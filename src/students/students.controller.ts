import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller('v1/students')
export class StudentsController {
  constructor(private studentsService: StudentsService) {}

  @Post()
  async createStudent(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.createStudent(
      createStudentDto.name,
      createStudentDto.matricNumber,
      createStudentDto.level,
      createStudentDto.department,
    );
  }

  @Get()
  async getAllStudents(
    @Query('name') name?: string,
    @Query('matricNumber') matricNumber?: string,
    @Query('level') level?: string,
    @Query('department') department?: string,
  ) {
    return this.studentsService.getAllStudents({
      name,
      matricNumber,
      level,
      department,
    });
  }

  @Get(':id')
  async getStudentById(@Param('id') id: string) {
    return this.studentsService.getStudentById(+id);
  }

  @Patch(':id')
  async updateStudent(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentsService.updateStudent(+id, updateStudentDto);
  }

  @Delete(':id')
  async deleteStudent(@Param('id') id: string) {
    return this.studentsService.deleteStudent(+id);
  }
}
