import {
  AppError,
  AppException,
  AppExceptionDetail,
  CONTACT_RELATION,
  CONTACT_STATUS,
  SCHOOL_YEAR_STATUS,
  STUDENT_CLASS_STATUS,
  cryptString,
} from '@gedu/shared';
import {
  ArrangeBatchStudentClassDto,
  ArrangeStudentClassDto,
  CreateContactDto,
  CreateStudentRequestDto,
  TransferStudentClassDto,
  UpdateContactDto,
  UpdateGrantContactAccessDto,
  UpdateMedicalInfoRequestDto,
  UpdatePriorityPoliciesDto,
  UpdateStudentContactsDto,
  UpdateStudentRequestDto,
} from './dto/students.request.dto';
import { Injectable, Logger } from '@nestjs/common';
import { Prisma, PrismaService } from '@gedu/prisma';
import {
  UpdateStudentContactsResponseDto,
  UpdateStudentPoliciesResponseDto,
} from './dto/students.response.dto';

import { ContactStudentRepository } from './contact-student/repository/contact-student.repository';
import { GetStudentsDto } from './dto/get-students.dto';
import { SchoolRepository } from '../schools/repository/school.repository';
import { StudentMedicalInfoRepository } from './repository/student-medical-info.repository';
import { StudentsContactRepository } from './repository/students-contact.repository';
import { StudentsRepository } from './repository/students.repository';
import { UserRepository } from '../users/repository/user.repository';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class StudentsService {
  private readonly STUDENT_CONTACT_ORG_ID = 2;

  private readonly logger = new Logger(StudentsService.name);
  constructor(
    private readonly studentRepository: StudentsRepository,
    private readonly schoolRepository: SchoolRepository,
    private readonly contactStudentRepository: ContactStudentRepository,
    private readonly studentMedicalInfoRepository: StudentMedicalInfoRepository,
    private readonly studentsContactRepository: StudentsContactRepository,
    private readonly userRepository: UserRepository,
    private readonly prisma: PrismaService,
  ) {}

  async getStudentById(orgId: number, studentId: number) {
    if (!orgId) {
      throw new AppError(AppException.MISSING_ORGANIZATION_ID);
    }

    const student = await this.studentRepository.findStudentDetailById(
      orgId,
      studentId,
    );
    const studentMedicalInfo =
      await this.studentMedicalInfoRepository.getStudentMedicalInfo(studentId);

    if (!student) {
      throw new AppError(AppException.STUDENT_NOT_FOUND);
    }

    let documentCount = 0;
    if (student.userId) {
      documentCount = await this.prisma.folder.count({
        where: {
          userId: student.userId,
        },
      });
    }

    return {
      ...student,
      studentMedicalInfo,
      documents: documentCount,
    };
  }

  async createStudentContact(
    orgId: number,
    studentId: number,
    request: CreateContactDto,
  ) {
    const school = await this.schoolRepository.findSchoolById(orgId);
    if (!school) {
      throw new AppError(AppException.SCHOOL_NOT_FOUND);
    }

    const existingStudent = await this.studentRepository.findStudentById(
      orgId,
      studentId,
    );
    if (!existingStudent) {
      throw new AppError(AppException.STUDENT_NOT_FOUND);
    }

    const findAllContact =
      await this.contactStudentRepository.findAllContact(studentId);

    if (findAllContact.length >= 3) {
      throw new AppError(AppException.MAX_CONTACTS_REACHED);
    }

    const phoneExist = await this.userRepository.findUserByPhone(
      orgId,
      request.phone,
    );

    if (phoneExist) {
      throw new AppError(AppException.PHONE_EXIST);
    }

    const user = await this.userRepository.createContactUser(
      this.STUDENT_CONTACT_ORG_ID,
      {
        firstName: request.firstName,
        lastName: request.lastName,
        email: request.email,
        phone: request.phone,
        citizenId: request.citizenId,
        occupation: request.occupation,
        dateOfBirth: request.dateOfBirth,
      },
    );

    const studentsContact =
      await this.studentsContactRepository.createStudentContactWithUserId(
        user.id,
      );

    await this.studentsContactRepository.createStudentContactRelation(
      studentId,
      studentsContact.id,

      request.relationship !== undefined
        ? request.relationship
        : CONTACT_RELATION.OTHER,
      request.relationshipTitle,
    );

    if (request.isMainContact) {
      await this.studentsContactRepository.updateStudentMainContact(
        studentId,
        studentsContact.id,
      );
    }

    return plainToInstance(UpdateStudentContactsResponseDto, studentsContact);
  }

  async findContactByIdStudent(orgId: number, studentId: number) {
    if (!orgId) {
      throw new AppError(AppException.MISSING_ORGANIZATION_ID);
    }
    const existingStudent = await this.studentRepository.findStudentById(
      orgId,
      studentId,
    );
    if (!existingStudent) {
      throw new AppError(AppException.STUDENT_NOT_FOUND);
    }
    return this.contactStudentRepository.findAllContact(studentId);
  }

  async getAllStudents(orgId: number, query: GetStudentsDto) {
    if (!orgId) {
      throw new AppError(AppException.MISSING_ORGANIZATION_ID);
    }
    const { students, total } =
      await this.studentRepository.findStudentsByOrgId(orgId, query);

    const response = students.map((s) => this.mapStudentsToResponse(s));

    return [response, total];
  }

  async updateAcademicAndPolicyInfo(
    orgId: number,
    studentId: number,
    request: UpdatePriorityPoliciesDto,
  ): Promise<UpdateStudentPoliciesResponseDto> {
    const student = await this.studentRepository.findStudentById(
      orgId,
      studentId,
    );

    if (!student) {
      throw new AppError(AppException.STUDENT_NOT_FOUND);
    }

    const updateFields = {
      priorityPolicyId: request.priorityPolicyId,
      gradeLevel: request.gradeLevel,
      specialNeedsPolicyId: request.specialNeedsPolicyId,
      admissionDate: request.admissionDate,
      admissionSchoolYearId: request.admissionSchoolYearId,
      admissionType: request.admissionType,
    };

    const updatedStudent = await this.prisma.$transaction(async (tx) => {
      if (request.classId) {
        const existingClass = await tx.studentClass.findFirst({
          where: { classId: request.classId, orgId, studentId },
        });

        if (existingClass) {
          throw new AppError(AppException.CLASS_STUDENT_ALREADY_EXISTS);
        }

        await tx.studentClass.create({
          data: {
            orgId,
            studentId,
            classId: request.classId,
          },
        });
      }

      const updatedStudent = await tx.student.update({
        where: { id: studentId, orgId },
        data: updateFields,
        include: {
          studentClasses: {
            select: {
              classId: true,
              class: true,
            },
          },
        },
      });

      return updatedStudent;
    });

    if (!updatedStudent) {
      throw new AppError(AppException.STUDENT_NOT_FOUND);
    }

    return plainToInstance(UpdateStudentPoliciesResponseDto, updatedStudent);
  }

  async createStudent(orgId: number, body: CreateStudentRequestDto) {
    const { id: studentId, code } = body;

    const school = await this.schoolRepository.findSchoolById(orgId);
    if (!school) {
      throw new AppError(AppException.SCHOOL_NOT_FOUND);
    }

    if (code) {
      const existing = await this.studentRepository.findStudentByCode(
        orgId,
        code,
      );
      const isDuplicate = existing && (!studentId || existing.id !== studentId);

      if (isDuplicate) {
        throw new AppError(AppException.STUDENT_CODE_DUPLICATED);
      }
    }

    if (!studentId) {
      try {
        const created = await this.studentRepository.createStudent(orgId, body);

        return {
          ...body,
          id: created.id,
          sex: body.sex,
        };
      } catch (error) {
        this.logger.error('Failed to create student:', error);
        throw new AppError(AppException.UNKNOWN_ERROR);
      }
    }

    const existingStudent = await this.studentRepository.findStudentById(
      orgId,
      studentId,
    );
    if (!existingStudent) {
      throw new AppError(AppException.STUDENT_NOT_FOUND);
    }

    try {
      const { personal, ...userInfo } =
        await this.studentRepository.updateStudent(orgId, studentId, body);

      if (!userInfo) {
        throw new AppError(AppException.STUDENT_NOT_FOUND);
      }

      return {
        ...userInfo,
        ...personal,
        id: studentId,
        sex: personal?.sex,
      };
    } catch (error) {
      this.logger.error('Failed to update student:', error);
      throw new AppError(AppException.UNKNOWN_ERROR);
    }
  }

  async updateStudentInfo(
    orgId: number,
    studentId: number,
    body: UpdateStudentRequestDto,
  ) {
    const existingStudent =
      await this.studentRepository.findStudentPersonalInfoById(
        orgId,
        studentId,
      );

    if (!existingStudent) {
      throw new AppError(AppException.STUDENT_NOT_FOUND);
    }

    const userUpdateData: Record<string, any> = {};
    const personalUpdateData: Record<string, any> = {};

    const assignIfDefined = <T>(
      target: Record<string, T>,
      key: string,
      value: T | undefined,
    ) => {
      if (value !== undefined) target[key] = value;
    };

    assignIfDefined(userUpdateData, 'firstName', body.firstName);
    assignIfDefined(userUpdateData, 'lastName', body.lastName);
    assignIfDefined(userUpdateData, 'avatar', body.avatar);

    assignIfDefined(personalUpdateData, 'firstName', body.firstName);
    assignIfDefined(personalUpdateData, 'lastName', body.lastName);
    assignIfDefined(personalUpdateData, 'citizenId', body.citizenId);
    assignIfDefined(personalUpdateData, 'dateOfExpiry', body.dateOfExpiry);
    assignIfDefined(personalUpdateData, 'dateOfIssue', body.dateOfIssue);
    assignIfDefined(personalUpdateData, 'placeOfIssue', body.placeOfIssue);
    assignIfDefined(personalUpdateData, 'dateOfBirth', body.dateOfBirth);
    assignIfDefined(personalUpdateData, 'sex', body.sex);
    assignIfDefined(personalUpdateData, 'nationalityId', body.nationalityId);
    assignIfDefined(personalUpdateData, 'ethnicityId', body.ethnicityId);
    assignIfDefined(personalUpdateData, 'religionId', body.religionId);
    assignIfDefined(
      personalUpdateData,
      'originPlaceProvinceId',
      body.originPlaceProvinceId,
    );
    assignIfDefined(
      personalUpdateData,
      'originPlaceWardId',
      body.originPlaceWardId,
    );
    assignIfDefined(
      personalUpdateData,
      'permanentResidenceProvinceId',
      body.permanentResidenceProvinceId,
    );
    assignIfDefined(
      personalUpdateData,
      'permanentResidenceWardId',
      body.permanentResidenceWardId,
    );
    assignIfDefined(
      personalUpdateData,
      'permanentResidenceAddress',
      body.permanentResidenceAddress,
    );
    assignIfDefined(
      personalUpdateData,
      'temporaryResidenceAddress',
      body.temporaryResidenceAddress,
    );
    assignIfDefined(
      personalUpdateData,
      'temporaryResidenceProvinceId',
      body.temporaryResidenceProvinceId,
    );
    assignIfDefined(
      personalUpdateData,
      'temporaryResidenceWardId',
      body.temporaryResidenceWardId,
    );

    const updatePayload: any = {};
    if (Object.keys(userUpdateData).length > 0) {
      Object.assign(updatePayload, userUpdateData);
    }
    if (Object.keys(personalUpdateData).length > 0) {
      updatePayload.personal = personalUpdateData;
    }

    await this.studentRepository.updateStudentInfo(
      orgId,
      existingStudent.userId,
      studentId,
      updatePayload,
    );

    const sex = updatePayload.personal?.sex;

    return {
      avatar: updatePayload.avatar,
      ...personalUpdateData,
      sex,
    };
  }

  async updateStudentContact(
    orgId: number,
    studentId: number,
    data: UpdateStudentContactsDto,
  ) {
    const student = await this.studentRepository.findStudentById(
      orgId,
      studentId,
    );
    if (!student) {
      throw new AppError(AppException.STUDENT_NOT_FOUND);
    }

    await this.prisma.$transaction(async (prisma) => {
      const studentContacts = await prisma.studentContactRelation.findMany({
        where: { studentId },
        select: {
          studentContactId: true,
          studentContact: {
            select: {
              user: {
                select: {
                  id: true,
                  phone: true,
                },
              },
            },
          },
        },
      });

      const idsToDelete = studentContacts
        .map((r) => r.studentContact?.user?.id)
        .filter((id): id is number => !!id);

      if (idsToDelete.length > 0) {
        try {
          const deleteResult = await prisma.user.deleteMany({
            where: {
              id: { in: idsToDelete },
            },
          });
          this.logger.log(
            `Deleted ${deleteResult.count} user records for student ${studentId}`,
          );
        } catch (error) {
          this.logger.error(
            `Failed to delete user records for student ${studentId}:`,
            error,
          );
          throw new AppError(AppException.UNKNOWN_ERROR);
        }
      }

      await prisma.student.update({
        where: { id: studentId, orgId },
        data: {
          mainContactId: null,
        },
      });

      let newMainContactId: number | null = null;

      for (const contact of data.contacts) {
        const phoneExist = await prisma.user.findUnique({
          where: { orgId_phone: { orgId, phone: contact.phone } },
        });

        if (phoneExist) {
          throw new AppError(AppException.PHONE_EXIST);
        }

        const user = await prisma.user.create({
          data: {
            orgId: this.STUDENT_CONTACT_ORG_ID,
            firstName: contact.firstName,
            lastName: contact.lastName,
            email: contact.email,
            phone: contact.phone,
            avatar: contact.avatar,
            personal: {
              create: {
                firstName: contact.firstName,
                lastName: contact.lastName,
                citizenId: contact.citizenId,
                dateOfBirth: contact.dateOfBirth,
                occupation: contact.occupation,
              },
            },
          },
        });

        const studentsContact = await prisma.studentsContact.upsert({
          where: { userId: user.id },
          update: {},
          create: {
            userId: user.id,
          },
        });

        await prisma.studentContactRelation.create({
          data: {
            studentId,
            studentContactId: studentsContact.id,
            relationship: contact.relationship,
            relationshipTitle: contact.relationshipTitle,
          },
        });

        if (contact.isMainContact) {
          newMainContactId = studentsContact.id;
        }
      }

      if (newMainContactId) {
        await prisma.student.update({
          where: { id: studentId },
          data: {
            mainContactId: newMainContactId,
          },
        });
      }
    });
    const contacts =
      await this.contactStudentRepository.findAllContact(studentId);
    const mainContact = await this.studentRepository.findMainContactByStudentId(
      orgId,
      studentId,
    );
    const formatContact = contacts.map((item) => {
      const user = item.studentContact.user;
      return {
        relationship: item.relationship,
        relationshipTitle: item.relationshipTitle,
        id: item.studentContactId,
        isMainContact: item.studentContactId === mainContact?.id,
        status: item.studentContact.status,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        phone2: user.phone2,
        avatar: user.avatar,
      };
    });

    return plainToInstance(UpdateStudentContactsResponseDto, formatContact);
  }

  async updateMedicalInfo(
    orgId: number,
    studentId: number,
    request: UpdateMedicalInfoRequestDto,
  ) {
    const student = await this.studentRepository.findStudentById(
      orgId,
      studentId,
    );

    if (!student) {
      throw new AppError(AppException.STUDENT_NOT_FOUND);
    }

    return await this.studentRepository.updateMedicalInfo(studentId, request);
  }

  async grantAccessStudentContact(
    orgId: number,
    studentId: number,
    request: UpdateGrantContactAccessDto,
  ): Promise<boolean> {
    const student = await this.studentRepository.findStudentById(
      orgId,
      studentId,
    );

    if (!student) {
      throw new AppError(AppException.STUDENT_NOT_FOUND);
    }

    const contactRelationExists =
      await this.prisma.studentContactRelation.findFirst({
        where: {
          studentId,
          studentContactId: request.contactId,
        },
      });

    if (!contactRelationExists) {
      throw new AppError(AppException.CONTACT_PHONE_OR_USER_NOT_FOUND);
    }

    const granted = await this.prisma.$transaction(async (prisma) => {
      const existingContacts = await prisma.studentContactRelation.findMany({
        where: { studentId },
        select: { studentContactId: true },
      });

      await prisma.studentsContact.updateMany({
        where: {
          id: { in: existingContacts.map((c) => c.studentContactId) },
        },
        data: { grantAccess: false },
      });

      const updatedContact = await prisma.studentsContact.update({
        where: { id: request.contactId },
        data: { grantAccess: true },
        select: { grantAccess: true },
      });

      return updatedContact.grantAccess;
    });

    return granted;
  }

  async activateContactAccount(
    orgId: number,
    studentId: number,
    contactId: number,
  ) {
    const contact = await this.studentsContactRepository.findContactWithUser(
      orgId,
      studentId,
      contactId,
    );

    if (!contact) {
      throw new AppError(AppException.NOT_FOUND_CONTACT);
    }

    if (!contact.grantAccess) {
      throw new AppError(AppException.CONTACT_NOT_GRANTED_ACCESS);
    }

    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: {
        user: { include: { personal: true } },
      },
    });

    const dateOfBirth = student?.user?.personal?.dateOfBirth;
    if (!dateOfBirth) {
      throw new AppError(AppException.MISSING_STUDENT_BIRTHDAY);
    }

    const rawPassword = this.formatDateToDDMMYYYY(new Date(dateOfBirth));
    const hashedPassword = await cryptString(rawPassword);
    const userId = contact.user?.id;
    if (!userId) {
      throw new AppError(AppException.USER_NOT_FOUND);
    }

    const existingAccount = await this.prisma.account.findUnique({
      where: { userId },
    });

    if (!existingAccount) {
      if (!contact.user.phone) {
        throw new AppError(AppException.USER_PHONE_REQUIRED);
      }

      await this.prisma.account.create({
        data: {
          userId,
          userName: contact.user.phone,
          password: hashedPassword,
          roles: 'STUDENT_CONTACT',
          orgId: 2, // TODO: replace with correct orgId
        },
      });
    } else {
      await this.prisma.account.update({
        where: { userId },
        data: { password: hashedPassword },
      });
    }

    await this.prisma.studentsContact.update({
      where: { id: contactId },
      data: { status: CONTACT_STATUS.ACTIVE },
    });

    return {
      message: 'Đã kích hoạt tài khoản liên hệ thành công',
    };
  }

  async deleteStudentContact(
    orgId: number,
    studentId: number,
    contactId: number,
  ) {
    const contact = await this.studentsContactRepository.findContactWithUser(
      orgId,
      studentId,
      contactId,
    );

    if (!contact) {
      throw new AppError(AppException.NOT_FOUND_CONTACT);
    }

    const isMainContact = contact.students.some(
      (s) => s.id === studentId && s.mainContactId === contact.id,
    );

    if (isMainContact) {
      throw new AppError(AppException.CANNOT_DELETE_MAIN_CONTACT);
    }

    const hasActiveAccount =
      contact.grantAccess === true && contact.status === CONTACT_STATUS.ACTIVE;

    if (hasActiveAccount) {
      throw new AppError(AppException.CANNOT_DELETE_CONTACT_HAS_ACCOUNT);
    }

    await this.prisma.studentContactRelation.deleteMany({
      where: {
        studentId,
        studentContactId: contactId,
      },
    });

    return true;
  }

  public async updateContact(
    orgId: number,
    studentId: number,
    contactId: number,
    data: UpdateContactDto,
  ) {
    const contact = await this.studentsContactRepository.findContactWithUser(
      orgId,
      studentId,
      contactId,
    );

    if (!contact) throw new AppError(AppException.NOT_FOUND_CONTACT);

    if (data.phone && data.phone !== contact.user.phone) {
      const duplicatedPhone =
        await this.studentsContactRepository.findDuplicatedPhone(
          contactId,
          data.phone,
        );
      if (duplicatedPhone) throw new AppError(AppException.PHONE_DUPLICATED);
    }

    if (data.isMainContact === true) {
      await this.studentsContactRepository.updateStudentMainContact(
        studentId,
        contactId,
      );
    }

    if (data.isMainContact === false) {
      const student =
        await this.studentsContactRepository.findStudent(studentId);
      if (student?.mainContactId === contactId) {
        await this.studentsContactRepository.updateStudentMainContact(
          studentId,
          null,
        );
      }
    }

    if (data.grantAccess === true) {
      const other = await this.studentsContactRepository.findOtherActiveContact(
        studentId,
        contactId,
      );
      if (other) throw new AppError(AppException.GRANT_ACCESS_ALREADY_ACTIVE);
      await this.studentsContactRepository.revokeAccessOthers(
        studentId,
        contactId,
      );
    }

    const updateUserData: Prisma.UserUpdateInput = {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      email: data.email,
      avatar: data.avatar,
      personal: {
        update: {
          citizenId: data.citizenId,
          dateOfBirth: data.dateOfBirth,
          occupation: data.occupation,
        },
      },
    };

    const updateContactData: Prisma.StudentsContactUpdateInput = {};
    if (data.grantAccess !== undefined)
      updateContactData.grantAccess = data.grantAccess;

    await this.studentsContactRepository.updateRelationInfo(
      studentId,
      contactId,
      {
        relationship: data.relationship,
        relationshipTitle: data.relationshipTitle,
      },
    );

    await this.studentsContactRepository.updateContactAndUser(
      contactId,
      updateContactData,
      updateUserData,
    );

    const updated = await this.studentsContactRepository.findContactDetail(
      contactId,
      studentId,
    );
    if (!updated) throw new AppError(AppException.NOT_FOUND_CONTACT);

    return {
      avatar: updated.user.avatar,
      firstName: updated.user.firstName,
      lastName: updated.user.lastName,
      phone: updated.user.phone,
      email: updated.user.email,
      grantAccess: updated.grantAccess,
      isMainContact: updated.students.some(
        (s) => s.mainContactId === updated.id,
      ),
      relationship:
        updated.studentContacts.length > 0
          ? updated.studentContacts[0].relationship
          : null,
      relationshipTitle:
        updated.studentContacts.length > 0
          ? updated.studentContacts[0].relationshipTitle
          : null,
    };
  }

  public async arrangeClass(
    orgId: number,
    studentId: number,
    data: ArrangeStudentClassDto,
  ) {
    const { classId, gradeLevel } = data;
    const student = await this.prisma.student.findFirst({
      where: {
        id: studentId,
        orgId,
      },
      select: {
        gradeLevel: true,
        studentClasses: {
          where: { status: STUDENT_CLASS_STATUS.ACTIVE },
          orderBy: { arrangeAt: 'desc' },
          take: 1,
          select: {
            classId: true,
          },
        },
      },
    });

    if (!student) {
      throw new AppError(AppException.STUDENT_NOT_FOUND);
    }

    if (student.studentClasses?.length && student.studentClasses[0].classId) {
      throw new AppError(AppException.CLASS_STUDENT_ALREADY_EXISTS);
    }

    if (student.gradeLevel !== null && student.gradeLevel !== gradeLevel) {
      throw new AppError(AppException.GRADE_LEVEL_MISMATCH);
    }

    const currentActiveClass = await this.prisma.class.findFirst({
      where: {
        id: classId,
        orgId,
      },
      select: { id: true, gradeLevel: true },
    });

    if (!currentActiveClass) {
      throw new AppError(AppException.CLASS_NOT_FOUND);
    }

    if (currentActiveClass.gradeLevel !== gradeLevel) {
      throw new AppError(AppException.GRADE_LEVEL_MISMATCH);
    }

    await this.prisma.$transaction(async (tx) => {
      if (student.gradeLevel === null) {
        await tx.student.update({
          where: { id: studentId, orgId },
          data: { gradeLevel },
        });
      }
      try {
        await tx.studentClass.create({
          data: {
            studentId,
            classId,
            orgId,
            status: STUDENT_CLASS_STATUS.ACTIVE,
            arrangeAt: new Date(),
          },
        });
      } catch (e: any) {
        if (e?.code === 'P2002') {
          throw new AppError(AppException.CLASS_STUDENT_ALREADY_EXISTS);
        }
        throw e;
      }
    });

    return true;
  }

  public async arrangeClassBatch(
    orgId: number,
    data: ArrangeBatchStudentClassDto,
  ) {
    const { classId, studentIds, gradeLevel } = data;
    const uniqueIds = Array.from(new Set(studentIds));
    const currentActiveClass = await this.prisma.class.findFirst({
      where: {
        id: classId,
        orgId,
      },
      select: { id: true, gradeLevel: true },
    });

    if (!currentActiveClass) {
      throw new AppError(AppException.CLASS_NOT_FOUND);
    }

    if (currentActiveClass.gradeLevel !== gradeLevel) {
      throw new AppError(AppException.GRADE_LEVEL_MISMATCH);
    }

    const students = await this.prisma.student.findMany({
      where: {
        id: { in: uniqueIds },
        orgId,
      },
      select: {
        id: true,
        gradeLevel: true,
        studentClasses: {
          where: { status: STUDENT_CLASS_STATUS.ACTIVE },
          orderBy: { arrangeAt: 'desc' },
          take: 1,
          select: { classId: true },
        },
      },
    });
    const studentById = new Map(students.map((s) => [s.id, s]));
    const failed: { id: number; message: string }[] = [];
    const toCreate: {
      studentId: number;
      classId: number;
      orgId: number;
      status: number;
      arrangeAt: Date;
    }[] = [];

    const toUpdateIds: number[] = [];

    for (const studentId of uniqueIds) {
      const student = studentById.get(studentId);

      if (!student) {
        failed.push({
          id: studentId,
          message: AppExceptionDetail.STUDENT_NOT_FOUND.message,
        });
        continue;
      }

      if (student.gradeLevel != null && student.gradeLevel !== gradeLevel) {
        failed.push({
          id: studentId,
          message: AppExceptionDetail.GRADE_LEVEL_MISMATCH.message,
        });
        continue;
      }

      if (student.studentClasses?.length && student.studentClasses[0].classId) {
        failed.push({
          id: studentId,
          message: AppExceptionDetail.CLASS_STUDENT_ALREADY_EXISTS.message,
        });
        continue;
      }

      if (student.gradeLevel == null) {
        toUpdateIds.push(studentId);
      }

      toCreate.push({
        studentId,
        classId,
        orgId,
        status: STUDENT_CLASS_STATUS.ACTIVE,
        arrangeAt: new Date(),
      });
    }

    let inserted = 0;
    if (toCreate.length > 0) {
      const result = await this.prisma.studentClass.createMany({
        data: toCreate,
        skipDuplicates: true,
      });
      inserted = result.count;
    }

    if (toUpdateIds.length > 0) {
      await this.prisma.student.updateMany({
        where: { id: { in: toUpdateIds }, orgId },
        data: { gradeLevel },
      });
    }

    return { success: inserted, failed };
  }

  public async transferClass(
    orgId: number,
    studentId: number,
    data: TransferStudentClassDto,
  ) {
    const { fromClassId, toClassId, note, gradeLevel } = data;

    if (fromClassId === toClassId) {
      throw new AppError(AppException.CANNOT_TRANSFER_TO_SAME_CLASS);
    }

    //
    const [student, fromClass, toClass] = await Promise.all([
      this.prisma.student.findFirst({
        where: { id: studentId, orgId },
        select: {
          id: true,
          gradeLevel: true,
          studentClasses: {
            where: { status: STUDENT_CLASS_STATUS.ACTIVE },
            orderBy: { arrangeAt: 'desc' },
            take: 1,
            select: { id: true, classId: true },
          },
        },
      }),
      this.prisma.class.findFirst({
        where: { id: fromClassId, orgId },
        select: { id: true, gradeLevel: true },
      }),
      this.prisma.class.findFirst({
        where: { id: toClassId, orgId },
        select: { id: true, gradeLevel: true },
      }),
    ]);

    if (!student) throw new AppError(AppException.STUDENT_NOT_FOUND);
    if (!fromClass) throw new AppError(AppException.FROM_CLASS_NOT_FOUND);
    if (!toClass) throw new AppError(AppException.TO_CLASS_NOT_FOUND);

    if (
      !student.studentClasses?.length ||
      student.studentClasses[0].classId !== fromClassId
    ) {
      throw new AppError(AppException.STUDENT_NOT_IN_FROM_CLASS);
    }

    if (student.gradeLevel !== null && student.gradeLevel !== gradeLevel) {
      throw new AppError(AppException.GRADE_LEVEL_MISMATCH);
    }
    if (
      fromClass.gradeLevel !== gradeLevel ||
      toClass.gradeLevel !== gradeLevel
    ) {
      throw new AppError(
        AppException.FROM_CLASS_GRADE_LEVEL_MISMATCH_WITH_TO_CLASS,
      );
    }

    await this.prisma.$transaction(async (tx) => {
      const existingToActive = await tx.studentClass.findFirst({
        where: {
          studentId,
          orgId,
          classId: toClassId,
          status: STUDENT_CLASS_STATUS.ACTIVE,
        },
        select: { id: true },
      });
      if (existingToActive) {
        throw new AppError(AppException.CLASS_STUDENT_ALREADY_EXISTS);
      }

      await tx.studentClass.update({
        where: { id: student.studentClasses[0].id },
        data: { status: STUDENT_CLASS_STATUS.TRANSFERRED },
      });

      await tx.studentClass.create({
        data: {
          studentId,
          classId: toClassId,
          orgId,
          status: STUDENT_CLASS_STATUS.ACTIVE,
          arrangeAt: new Date(),
          note,
        },
      });

      if (student.gradeLevel === null) {
        await tx.student.update({
          where: { id: studentId },
          data: { gradeLevel },
        });
      }
    });

    return true;
  }

  private mapMainContact(contactUser: any, relation: any) {
    return contactUser
      ? {
          ...contactUser,
          relation: relation?.relationship,
          relationshipTitle: relation?.relationshipTitle,
        }
      : null;
  }

  private mapStudentsToResponse(student: any) {
    const user = student.user;
    const personal = user?.personal;
    const studentClass = student.studentClasses;
    const mainContactUser = student.mainStudentContact?.user;

    const relationship =
      mainContactUser &&
      student.studentContacts.find(
        (c: { studentContact: { user: { id: any } } }) =>
          c.studentContact?.user?.id === mainContactUser.id,
      );

    const sampleNames = [
      { firstName: 'An', lastName: 'Nguyễn Văn' },
      { firstName: 'Bích', lastName: 'Trần Thị' },
      { firstName: 'Nam', lastName: 'Lê Hoàng' },
      { firstName: 'Linh', lastName: 'Phạm Phương' },
      { firstName: 'Đức', lastName: 'Vũ Minh' },
      { firstName: 'Trang', lastName: 'Hoàng Thu' },
      { firstName: 'Kiệt', lastName: 'Đặng Tuấn' },
      { firstName: 'Linh', lastName: 'Bùi Khánh' },
      { firstName: 'Đăng', lastName: 'Đỗ Hải' },
      { firstName: 'Hương', lastName: 'Hồ Mai' },
    ];
    let fn = personal?.firstName || user?.firstName || '';
    let ln = personal?.lastName || user?.lastName || '';
    if (!fn || fn.toLowerCase().includes('học sinh') || /^hs/i.test(fn)) {
      const fallback = sampleNames[student.id % sampleNames.length];
      fn = fallback.firstName;
      ln = ln || fallback.lastName;
    }

    return {
      id: student.id,
      firstName: fn,
      lastName: ln,
      avatar: user?.avatar,
      code: student.code,

      status: student.status,
      sex: personal?.sex,
      classId: studentClass?.map((c: any) => c.classId),
      gradeLevel: student.gradeLevel,
      classNames: studentClass?.map((c: any) => c.class.name),
      mainContactId: student.mainContactId,
      mainStudentContact: this.mapMainContact(mainContactUser, relationship),
    };
  }

  private formatDateToDDMMYYYY(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months are zero-based
    const year = date.getFullYear();
    return `${day}${month}${year}`;
  }
}
