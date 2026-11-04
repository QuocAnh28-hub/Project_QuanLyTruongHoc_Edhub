import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {StudentsRepository} from "../../students/repository/students.repository";
import {ImportStudentRequest, StudentImportResult} from "@gedu/transport/grpc/interfaces/student-import.interface";
  
@Controller('student.grpc')
export class StudentImportGrpcController {
  private readonly logger = new Logger(StudentImportGrpcController.name);
  constructor(
    private readonly studentsRepository: StudentsRepository,
  ) {}

  @GrpcMethod('StudentImportService', 'ImportStudents')
  async importStudents(request: ImportStudentRequest) {
    if (!request.students || request.students.length === 0) {
      this.logger.warn('No students to import');
      return {
        results: [],
        totalCount: 0,
        successCount: 0,
        failureCount: 0,
      };
    }
    let createdStudents;
    try {
      createdStudents = await this.studentsRepository.createMany(request);
    } catch (error) {
      // Log the error and return appropriate failure response
      this.logger.error(error);
      return {
        results: request.students.map(student => ({
          id: 0,
          success: false,
          message: `Failed to import student code: ${student.code}`,
        })),
        totalCount: request.students.length,
        successCount: 0,
        failureCount: request.students.length,
      };
    }
    const createdStudentsMap = new Map(
      createdStudents.map(student => [student.code, student])
    );
    const results: StudentImportResult[] = request.students.map((student) => {
      const result = createdStudentsMap.get(student.code);
      if (!result) {
        return {
          id: 0,
          success: false,
          message: `Student with code ${student.code} was not created successfully`,
        };
      }
      return {
        id: result.id,
        success: !result.error,
        message: result.error || 'ok',
      };
    });

    const { successCount, failureCount } = createdStudents.reduce(
      (counts, student) => ({
        successCount: counts.successCount + (student.error === null ? 1 : 0),
        failureCount: counts.failureCount + (student.error !== null ? 1 : 0),
      }),
      { successCount: 0, failureCount: 0 }
    );

    return {
      results,
      totalCount: request.students.length,
      successCount,
      failureCount,
    };
  }
}
