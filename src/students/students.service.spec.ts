import { Test, TestingModule } from '@nestjs/testing';
import { StudentsService } from './students.service';
import { PrismaService } from '../prisma/prisma.service';

describe('StudentsService', () => {
  let service: StudentsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentsService, PrismaService],
    }).compile();

    service = module.get<StudentsService>(StudentsService);
    prisma = module.get<PrismaService>(PrismaService);
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
      });

    const result = await service.createStudent({
      name: 'John Doe',
      matricNumber: 'MT20231001',
      level: '300',
      department: 'Computer Science',
    });

    expect(createStudentSpy).toHaveBeenCalledTimes(1);
    expect(result.name).toEqual('John Doe');
  });

  it('should update a student', async () => {
    const updateStudentSpy = jest
      .spyOn(prisma.student, 'update')
      .mockResolvedValue({
        id: 1,
        name: 'John Doe',
        matricNumber: 'MT20231001',
        level: '400', // Changed level for the update
        department: 'Computer Science',
      });

    const result = await service.updateStudent(1, {
      level: '400',
    });

    expect(updateStudentSpy).toHaveBeenCalledTimes(1);
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
      });

    const result = await service.getStudentById(1);

    expect(findStudentSpy).toHaveBeenCalledTimes(1);
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
      });

    const result = await service.deleteStudent(1);

    expect(deleteStudentSpy).toHaveBeenCalledTimes(1);
    expect(result.name).toEqual('John Doe');
    expect(result.id).toEqual(1);

    // Check if student is actually deleted
    const findStudentSpy = jest
      .spyOn(prisma.student, 'findUnique')
      .mockResolvedValue(null);

    // const deletedStudent = await service.getStudentById(1);
    // expect(findStudentSpy).toHaveBeenCalledTimes(1);
    // expect(deletedStudent).toBeNull(); // Ensure that student no longer exists
    await expect(service.getStudentById(1)).rejects.toThrow(
      'Student with ID 1 not found.',
    );
  });
});
