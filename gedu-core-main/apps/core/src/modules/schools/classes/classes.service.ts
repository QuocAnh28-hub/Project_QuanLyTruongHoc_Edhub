import { StudentsRepository } from './../../students/repository/students.repository';
import { PrismaService } from '@gedu/prisma';
import { AppError, AppException, AppValidationException } from '@gedu/shared';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CurriculumRepository } from '../../curriculums/repository/curriculums.repository';
import { SchoolYearsRepository } from '../../school-years/repository/school-years.repository';
import { StaffRepository } from '../../staff/repository/school-staff.repository';
import {
  CreateClassGroupDto,
  GetClassesRequestDto,
  UpdateClassDto,
  UpdateClassesInfoDto,
} from './dto/classes.request.dto';
import {
  GetClassDetailResponseDto,
  GetClassesResponseDto,
  GetStudentByClassIdResponseDto,
} from './dto/classes.response.dto';
import { ClassesRepository } from './repository/classes.repository';
import { GetStudentByClassIdDto } from '../../students/contact-student/dto/contact-student.request.dto';

@Injectable()
export class ClassesService {
  constructor(
    private readonly classesRepository: ClassesRepository,
    private readonly schoolYearsRepository: SchoolYearsRepository,
    private readonly curriculumRepository: CurriculumRepository,
    private readonly staffRepository: StaffRepository,
    private readonly studentsRepository: StudentsRepository,
    private prisma: PrismaService,
  ) {}

  async createClasses(orgId: number, request: CreateClassGroupDto) {
    const schoolYear = await this.schoolYearsRepository.findByIdAndOrgId(
      orgId,
      request.schoolYearId,
    );

    if (!schoolYear) {
      throw new AppError(AppException.SCHOOL_YEAR_NOT_FOUND_OR_ACCESS_DENIED);
    }

    const findErrorClass = request.classes.findIndex(
      (cls) => !cls.name || !cls.curriculumId,
    );

    if (findErrorClass !== -1) {
      throw new AppError(AppValidationException.INVALID_CLASS_ARRAY);
    }

    return await this.classesRepository.createClasses(orgId, request);
  }

  async getClasses(orgId: number, query: GetClassesRequestDto) {
    const { items, total } =
      await this.classesRepository.findAllAndCountClasses(orgId, query);
    return [plainToInstance(GetClassesResponseDto, items), total];
  }

  async getClassById(orgId: number, classId: number) {
    const clazz = await this.classesRepository.findDetailsByIdAndOrgId(
      orgId,
      classId,
    );

    if (!clazz) {
      throw new AppError(AppException.CLASS_ID_INVALID);
    }

    return plainToInstance(GetClassDetailResponseDto, clazz);
  }

  async updateInfoClasses(
    orgId: number,
    classId: number,
    updateClassesDto: UpdateClassesInfoDto,
  ) {
    const clazz = await this.classesRepository.findByIdAndOrgId(orgId, classId);

    if (!clazz) {
      throw new AppError(AppException.CLASS_NOT_FOUND);
    }

    if (updateClassesDto.name) {
      const duplicateExists = await this.prisma.class.count({
        where: {
          orgId: clazz.orgId,
          schoolYearId: clazz.schoolYearId,
          name: updateClassesDto.name,
          id: { not: classId },
        },
      });

      if (duplicateExists) {
        throw new AppError(AppValidationException.INVALID_CLASS_NAME_DUPLICATE);
      }
    }

    if (updateClassesDto.curriculumId) {
      const curriculum =
        await this.curriculumRepository.findCurriculumByOrgIdAndId(
          orgId,
          updateClassesDto.curriculumId,
        );

      if (!curriculum.canApply) {
        throw new AppError(
          AppValidationException.INVALID_CLASS_CURRICULUM_CAN_NOT_APPLY,
        );
      }
    }

    if (updateClassesDto.homeroomTeacherId) {
      const teacherExists =
        await this.staffRepository.findHomeroomTeacherByStaffId(
          orgId,
          updateClassesDto.homeroomTeacherId,
        );

      if (!teacherExists) {
        throw new AppError(
          AppValidationException.INVALID_CLASS_HOME_ROOM_TEACHER_NOT_EXISTS,
        );
      }
    }

    return await this.classesRepository.updateInfoClass(
      classId,
      orgId,
      updateClassesDto,
    );
  }

  async updateClasses(orgId: number, classId: number, request: UpdateClassDto) {
    const clazz = await this.classesRepository.findByIdAndOrgId(orgId, classId);

    if (!clazz) {
      throw new AppError(AppException.CLASS_NOT_FOUND);
    }

    return await this.classesRepository.updateClass(orgId, classId, request);
  }

  async getStudentsInClass(
    orgId: number,
    classId: number,
    request: GetStudentByClassIdDto,
  ) {
    const clazz = await this.classesRepository.findByIdAndOrgId(orgId, classId);

    if (!clazz) {
      throw new AppError(AppException.CLASS_NOT_FOUND);
    }

    const { studentClass, count } =
      await this.studentsRepository.findStudentInClassPaginate(
        orgId,
        classId,
        request,
      );

    return [
      plainToInstance(GetStudentByClassIdResponseDto, studentClass),
      count,
    ];
  }
}
