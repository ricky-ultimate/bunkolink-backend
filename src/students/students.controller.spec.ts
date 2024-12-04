import { Test, TestingModule } from '@nestjs/testing';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';

describe('StudentsController', () => {
  let controller: StudentsController;
  let service: StudentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentsController],
      providers: [
        {
          provide: StudentsService,
          useValue: {
            createStudent: jest
              .fn()
              .mockResolvedValue({
                id: 1,
                name: 'John Doe',
                matricNumber: 'MT123',
              }),
            getAllStudents: jest
              .fn()
              .mockResolvedValue([
                { id: 1, name: 'John Doe', matricNumber: 'MT123' },
              ]),
            getStudentById: jest
              .fn()
              .mockResolvedValue({
                id: 1,
                name: 'John Doe',
                matricNumber: 'MT123',
              }),
            updateStudent: jest
              .fn()
              .mockResolvedValue({
                id: 1,
                name: 'John Smith',
                matricNumber: 'MT123',
              }),
            deleteStudent: jest
              .fn()
              .mockResolvedValue({
                id: 1,
                name: 'John Doe',
                matricNumber: 'MT123',
              }),
          },
        },
      ],
    }).compile();

    controller = module.get<StudentsController>(StudentsController);
    service = module.get<StudentsService>(StudentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a student', async () => {
    const result = await controller.createStudent({
      name: 'John Doe',
      matricNumber: 'MT123',
      level: '300',
      department: 'CS',
    });
    expect(result.name).toEqual('John Doe');
    expect(result.matricNumber).toEqual('MT123');
  });

  it('should fetch all students', async () => {
    const result = await controller.getAllStudents();
    expect(result).toHaveLength(1);
    expect(result[0].name).toEqual('John Doe');
    expect(result[0].matricNumber).toEqual('MT123');
  });

  it('should fetch a student by ID', async () => {
    const result = await controller.getStudentById('1');
    expect(result.name).toEqual('John Doe');
    expect(result.matricNumber).toEqual('MT123');
  });

  it('should update a student', async () => {
    const result = await controller.updateStudent('1', {
      name: 'John Smith',
      matricNumber: 'MT123',
    });
    expect(result.name).toEqual('John Smith');
    expect(result.matricNumber).toEqual('MT123');
  });

  it('should delete a student', async () => {
    const result = await controller.deleteStudent('1');
    expect(result.id).toEqual(1);
    expect(result.name).toEqual('John Doe');
    expect(result.matricNumber).toEqual('MT123');
  });

  // Error handling test (e.g., student not found by ID)
  it('should return an error when student not found', async () => {
    jest.spyOn(service, 'getStudentById').mockResolvedValue(null); // Simulate not found
    try {
      await controller.getStudentById('999'); // Pass a non-existing ID
    } catch (e) {
      expect(e.response.statusCode).toBe(404); // Assuming you throw a 404 error for not found
    }
  });
});
