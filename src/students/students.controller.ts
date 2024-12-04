import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { StudentsService } from './students.service';

@Controller('v1/students')
export class StudentsController {
  constructor(private studentsService: StudentsService) {}

  @Post()
  async createStudent(
    @Body()
    body: {
      name: string;
      matricNumber: string;
      level: string;
      department: string;
    },
  ) {
    return this.studentsService.createStudent(body);
  }

  @Get()
  async getAllStudents() {
    return this.studentsService.getAllStudents();
  }

  @Get(':id')
  async getStudentById(@Param('id') id: string) {
    return this.studentsService.getStudentById(+id);
  }

  @Patch(':id')
  async updateStudent(
    @Param('id') id: string,
    @Body()
    body: Partial<{
      name: string;
      matricNumber: string;
      level: string;
      department: string;
    }>,
  ) {
    return this.studentsService.updateStudent(+id, body);
  }

  @Delete(':id')
  async deleteStudent(@Param('id') id: string) {
    return this.studentsService.deleteStudent(+id);
  }
}
