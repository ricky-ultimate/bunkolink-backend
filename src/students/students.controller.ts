import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('Students')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('v1/students')
export class StudentsController {
  constructor(private studentsService: StudentsService) {}

  @Roles('ADMIN', 'STUDENT_LIBRARIAN')
  @ApiOperation({ summary: 'Create a new student', description: 'Adds a new student to the database.' })
  @ApiResponse({ status: 201, description: 'The student has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @Post()
  async createStudent(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.createStudent(
      createStudentDto.name,
      createStudentDto.matricNumber,
      createStudentDto.level,
      createStudentDto.department,
    );
  }

  @Roles('ADMIN', 'STUDENT_LIBRARIAN', 'USER')
  @ApiOperation({ summary: 'Get all students', description: 'Fetches a list of all students in the system.' })
  @ApiQuery({ name: 'name', required: false, description: 'Filter students by name' })
  @ApiQuery({ name: 'matricNumber', required: false, description: 'Filter students by matriculation number' })
  @ApiQuery({ name: 'level', required: false, description: 'Filter students by level' })
  @ApiQuery({ name: 'department', required: false, description: 'Filter students by department' })
  @ApiResponse({ status: 200, description: 'List of students.' })
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

  @Roles('ADMIN', 'STUDENT_LIBRARIAN', 'USER')
  @ApiOperation({ summary: 'Get a student by ID', description: 'Fetches a single student by their ID.' })
  @ApiResponse({ status: 200, description: 'Student details.' })
  @ApiResponse({ status: 404, description: 'Student not found.' })
  @Get(':id')
  async getStudentById(@Param('id') id: string) {
    return this.studentsService.getStudentById(+id);
  }

  @Roles('ADMIN', 'STUDENT_LIBRARIAN')
  @ApiOperation({ summary: 'Update a student', description: 'Updates the details of an existing student.' })
  @ApiResponse({ status: 200, description: 'The student has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Student not found.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @Patch(':id')
  async updateStudent(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentsService.updateStudent(+id, updateStudentDto);
  }

  @Roles('ADMIN', 'STUDENT_LIBRARIAN')
  @ApiOperation({ summary: 'Delete a student', description: 'Deletes a student by their ID.' })
  @ApiResponse({ status: 200, description: 'The student has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Student not found.' })
  @Delete(':id')
  async deleteStudent(@Param('id') id: string) {
    return this.studentsService.deleteStudent(+id);
  }
}
