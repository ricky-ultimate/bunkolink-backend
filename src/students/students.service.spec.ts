import { Test, TestingModule } from '@nestjs/testing';
import { StudentsService } from './students.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../common/services/audit-log.service';

describe('StudentsService', () => {
  let service: StudentsService;
  let prisma: PrismaService;
  let auditLogService: AuditLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        PrismaService,
        {
          provide: AuditLogService,
          useValue: {
            logAction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StudentsService>(StudentsService);
    prisma = module.get<PrismaService>(PrismaService);
    auditLogService = module.get<AuditLogService>(AuditLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a student', async () => {
    const createStudentSpy = jest
      .spyOn(prisma.student, 'create')
      .mockResolvedValue({
        id: 1,
        name: 'John Doe',
        matricNumber: 'MT20231001',
        level: '300',
        department: 'Computer Science',
        userId: 2
      });

    const auditLogSpy = jest
      .spyOn(auditLogService, 'logAction')
      .mockResolvedValue(undefined);

    const result = await service.createStudent(
      'John Doe',
      'MT20231001',
      '300',
      'Computer Science',
      2,
    );

    expect(createStudentSpy).toHaveBeenCalledTimes(1);
    expect(createStudentSpy).toHaveBeenCalledWith({
      data: {
        name: 'John Doe',
        matricNumber: 'MT20231001',
        level: '300',
        department: 'Computer Science',
        userId: 2,
      },
    });

    expect(auditLogSpy).toHaveBeenCalledWith(
      'CREATE',
      'Student',
      1,
      'Student created with matric number: MT20231001',
    );
    expect(result.name).toEqual('John Doe');
    expect(result.userId).toEqual(2);
  });

  it('should update a student', async () => {
    const updateStudentSpy = jest
      .spyOn(prisma.student, 'update')
      .mockResolvedValue({
        id: 1,
        name: 'John Doe',
        matricNumber: 'MT20231001',
        level: '400',
        department: 'Computer Science',
        userId: 2
      });

    const auditLogSpy = jest
      .spyOn(auditLogService, 'logAction')
      .mockResolvedValue(undefined);

    const result = await service.updateStudent(1, {
      level: '400',
    });

    expect(updateStudentSpy).toHaveBeenCalledTimes(1);
    expect(updateStudentSpy).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { level: '400' },
    });

    expect(auditLogSpy).toHaveBeenCalledWith(
      'UPDATE',
      'Student',
      1,
      'Student with ID: 1 updated',
    );
    expect(result.level).toEqual('400');
  });

  it('should find a student by ID', async () => {
    const findStudentSpy = jest
      .spyOn(prisma.student, 'findUnique')
      .mockResolvedValue({
        id: 1,
        name: 'John Doe',
        matricNumber: 'MT20231001',
        level: '300',
        department: 'Computer Science',
        userId: 2,
      });

    const auditLogSpy = jest
      .spyOn(auditLogService, 'logAction')
      .mockResolvedValue(undefined);

    const result = await service.getStudentById(1);

    expect(findStudentSpy).toHaveBeenCalledTimes(1);
    expect(findStudentSpy).toHaveBeenCalledWith({
      where: { id: 1 },
    });

    expect(auditLogSpy).toHaveBeenCalledWith(
      'FETCH',
      'Student',
      1,
      'Fetched student with ID: 1',
    );
    expect(result.name).toEqual('John Doe');
    expect(result.matricNumber).toEqual('MT20231001');
  });

  it('should delete a student', async () => {
    const deleteStudentSpy = jest
      .spyOn(prisma.student, 'delete')
      .mockResolvedValue({
        id: 1,
        name: 'John Doe',
        matricNumber: 'MT20231001',
        level: '300',
        department: 'Computer Science',
        userId: 2
      });

    const auditLogSpy = jest
      .spyOn(auditLogService, 'logAction')
      .mockResolvedValue(undefined);

    const result = await service.deleteStudent(1);

    expect(deleteStudentSpy).toHaveBeenCalledTimes(1);
    expect(deleteStudentSpy).toHaveBeenCalledWith({
      where: { id: 1 },
    });

    expect(auditLogSpy).toHaveBeenCalledWith(
      'DELETE',
      'Student',
      1,
      'Student with ID: 1 deleted',
    );
    expect(result.name).toEqual('John Doe');
    expect(result.id).toEqual(1);
  });
});
