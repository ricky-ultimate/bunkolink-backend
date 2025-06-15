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
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import {
  ApiCreateStudent,
  ApiGetStudents,
  ApiGetStudentById,
  ApiUpdateStudent,
} from './decorators/students.decorator';
import { StudentFilter } from '../common/interfaces/filter.interface';
import { PaginationOptions } from '../common/interfaces/base.interface';

@ApiTags('Students')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('v1/students')
export class StudentsController {
  constructor(private studentsService: StudentsService) {}

  @Roles('ADMIN', 'STUDENT_LIBRARIAN')
  @ApiCreateStudent()
  @Post()
  async createStudent(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Roles('ADMIN', 'STUDENT_LIBRARIAN', 'USER')
  @ApiGetStudents()
  @Get()
  async getAllStudents(
    @Query('name') name?: string,
    @Query('matricNumber') matricNumber?: string,
    @Query('level') level?: string,
    @Query('department') department?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    const filters: StudentFilter = { name, matricNumber, level, department };
    const pagination: PaginationOptions = page ? { page, limit } : undefined;

    return this.studentsService.findAll(filters, pagination);
  }

  @Roles('ADMIN', 'STUDENT_LIBRARIAN', 'USER')
  @ApiGetStudentById()
  @Get(':id')
  async getStudentById(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    return this.studentsService.findById(id, req.user.userId);
  }

  @Roles('ADMIN', 'STUDENT_LIBRARIAN')
  @ApiUpdateStudent()
  @Patch(':id')
  async updateStudent(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStudentDto: UpdateStudentDto,
    @Request() req: any,
  ) {
    return this.studentsService.update(id, updateStudentDto, req.user.userId);
  }

  @Roles('ADMIN', 'STUDENT_LIBRARIAN')
  @Delete(':id')
  async deleteStudent(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    return this.studentsService.delete(id, req.user.userId);
  }
}
