import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async createStudent(data: { name: string; metricNumber: string; level: string; department: string }) {
    return this.prisma.student.create({
      data,
    });
  }

  async getAllStudents() {
    return this.prisma.student.findMany();
  }

  async getStudentById(id: number) {
    return this.prisma.student.findUnique({
      where: { id },
    });
  }

  async updateStudent(id: number, data: Partial<{ name: string; metricNumber: string; level: string; department: string }>) {
    return this.prisma.student.update({
      where: { id },
      data,
    });
  }

  async deleteStudent(id: number) {
    return this.prisma.student.delete({
      where: { id },
    });
  }
}
