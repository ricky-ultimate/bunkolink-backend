import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async createStudent(
    name: string,
    matricNumber: string,
    level: string,
    department: string,
  ) {
    try {
      return await this.prisma.student.create({
        data: {name, matricNumber, level, department}
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          `Duplicate student creation attempted: Matric Number ${matricNumber}`,
        );
      }
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
      throw new NotFoundException(`Unable to fetch. Student with ID ${id} not found.`);
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
      return await this.prisma.student.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Unable to update. Student with ID ${id} not found.`,
        );
      }
      throw new BadRequestException('Error updating the student.');
    }
  }

  async deleteStudent(id: number) {
    try {
      return await this.prisma.student.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Unable to delete. Student with ID ${id} not found.`,
        );
      }
      throw new BadRequestException('Error deleting the student.');
    }
  }
}
