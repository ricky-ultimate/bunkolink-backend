import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async createStudent(data: {
    name: string;
    matricNumber: string;
    level: string;
    department: string;
  }) {
    try {
      return this.prisma.student.create({
        data,
      });
    } catch (error) {
      throw new BadRequestException('Error creating the student.');
    }
  }

  async getAllStudents() {
    return this.prisma.student.findMany();
  }

  async getStudentById(id: number) {
    const student = await this.prisma.student.findUnique({
      where: { id },
    });
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found.`);
    }
    return student;
  }

  async updateStudent(
    id: number,
    data: Partial<{
      name: string;
      matricNumber: string;
      level: string;
      department: string;
    }>,
  ) {
    try {
      return this.prisma.student.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException(
        `Unable to update. Student with ID ${id} not found.`,
      );
    }
  }

  async deleteStudent(id: number) {
    try {
      return this.prisma.student.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(
        `Unable to delete. Student with ID ${id} not found.`,
      );
    }
  }
}
