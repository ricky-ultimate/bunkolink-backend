import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../common/services/audit-log.service';

@Injectable()
export class StudentsService {
  constructor(
    private prisma: PrismaService,
    private auditLogService: AuditLogService,
  ) {}

  async createStudent(
    name: string,
    matricNumber: string,
    level: string,
    department: string,
  ) {
    try {
      const student = await this.prisma.student.create({
        data: { name, matricNumber, level, department },
      });
      await this.auditLogService.logAction(
        'CREATE',
        'Student',
        student.id,
        `Student created with matric number: ${matricNumber}`,
      );
      return student;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          `Duplicate student creation attempted: Matric Number ${matricNumber}`,
        );
      }
      throw new BadRequestException(
        `Failed to create student with Matric Number ${matricNumber}`,
      );
    }
  }

  async getAllStudents() {
    const students = this.prisma.student.findMany();
    await this.auditLogService.logAction(
      'FETCH_ALL',
      'Student',
      0,
      'Fetched all students',
    );
  }

  async getStudentById(id: number) {
    const student = await this.prisma.student.findUnique({
      where: { id },
    });
    if (!student) {
      throw new NotFoundException(
        `Unable to fetch. Student with ID ${id} not found.`,
      );
    }
    await this.auditLogService.logAction(
      'FETCH',
      'Student',
      id,
      `Fetched student with ID: ${id}`,
    );
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
      const updatedStudent = await this.prisma.student.update({
        where: { id },
        data,
      });
      await this.auditLogService.logAction(
        'UPDATE',
        'Student',
        id,
        `Student with ID: ${id} updated`,
      );
      return updatedStudent;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Unable to update. Student with ID ${id} not found.`,
        );
      }
      throw new BadRequestException(`Failed to update student with ID ${id}`);
    }
  }

  async deleteStudent(id: number) {
    try {
      const deletedStudent = await this.prisma.student.delete({
        where: { id },
      });
      await this.auditLogService.logAction(
        'DELETE',
        'Student',
        id,
        `Student with ID: ${id} deleted`,
      );
      return deletedStudent;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Unable to delete. Student with ID ${id} not found.`,
        );
      }
      throw new BadRequestException(`Failed to delete student with ID ${id}`);
    }
  }
}
