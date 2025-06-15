import { Injectable } from '@nestjs/common';
import { Student } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../common/services/audit-log.service';
import { BaseService } from '../common/services/base.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentFilter } from '../common/interfaces/filter.interface';

@Injectable()
export class StudentsService extends BaseService<
  Student,
  CreateStudentDto,
  UpdateStudentDto
> {
  protected entityName = 'Student';
  protected prismaDelegate = this.prisma.student;

  constructor(
    protected readonly prisma: PrismaService,
    protected readonly auditLogService: AuditLogService,
  ) {
    super(prisma, auditLogService);
  }

  async findByMatricNumber(matricNumber: string): Promise<Student | null> {
    return this.prisma.student.findUnique({
      where: { matricNumber },
      include: this.getIncludeOptions(),
    });
  }

  async getStudentBorrowingHistory(studentId: number) {
    const student = await this.findById(studentId);

    return this.prisma.borrowedBook.findMany({
      where: { studentId },
      include: {
        book: true,
      },
      orderBy: { borrowDate: 'desc' },
    });
  }

  protected getIncludeOptions() {
    return {
      borrowedBooks: {
        include: {
          book: true,
        },
      },
    };
  }

  protected buildWhereClause(filters: StudentFilter): Record<string, any> {
    const where: Record<string, any> = {};

    if (filters.name) {
      where.name = { contains: filters.name, mode: 'insensitive' };
    }

    if (filters.matricNumber) {
      where.matricNumber = {
        contains: filters.matricNumber,
        mode: 'insensitive',
      };
    }

    if (filters.level) {
      where.level = filters.level;
    }

    if (filters.department) {
      where.department = { contains: filters.department, mode: 'insensitive' };
    }

    return where;
  }
}
