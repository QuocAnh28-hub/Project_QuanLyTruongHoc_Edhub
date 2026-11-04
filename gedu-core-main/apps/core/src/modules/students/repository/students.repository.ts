import { AppError, AppException } from '@gedu/shared/errors';
import {
  CreateStudentRequestDto,
  UpdateContactStudentRequestDto,
  UpdateMedicalInfoRequestDto,
} from '../dto/students.request.dto';
import { ORDER_ENUM, STUDENT_CLASS_STATUS } from '@gedu/shared';
import { Prisma, PrismaService, Student } from '@gedu/prisma';

import { ContactStudentRepository } from '../contact-student/repository/contact-student.repository';
import { GetStudentByClassIdDto } from '../contact-student/dto/contact-student.request.dto';
import { GetStudentsDto } from '../dto/get-students.dto';
import { ImportStudentRequest } from '@gedu/transport';
import { Injectable } from '@nestjs/common';
import { SharesService } from '../../shares/shares.service';

const studentContactsSelect: Prisma.StudentContactRelationSelect = {
  id: true,
  relationship: true,
  relationshipTitle: true,
  studentContact: {
    select: {
      grantAccess: true,
      status: true,
      user: {
        include: {
          personal: true,
        },
      },
      id: true,
    },
  },
};

const userSelect = {
  id: true,
  firstName: true,
  lastName: true,
  avatar: true,
  personal: {
    select: {
      sex: true,
      maritalStatus: true,
      firstName: true,
      lastName: true,
      citizenId: true,
      dateOfBirth: true,
      dateOfIssue: true,
      dateOfExpiry: true,
      placeOfIssue: true,
      occupation: true,

      religionId: true,
      religion: { select: { title: true } },

      ethnicityId: true,
      ethnic: { select: { title: true } },

      nationalityId: true,
      nation: { select: { title: true } },

      originPlaceProvinceId: true,
      originPlaceProvince: { select: { title: true } },

      originPlaceWardId: true,
      originPlaceWard: { select: { title: true } },

      permanentResidenceProvinceId: true,
      permanentResidenceProvince: { select: { title: true } },

      permanentResidenceWardId: true,
      permanentResidenceWard: { select: { title: true } },

      permanentResidenceAddress: true,

      temporaryResidenceProvinceId: true,
      temporaryResidenceProvince: { select: { title: true } },

      temporaryResidenceWardId: true,
      temporaryResidenceWard: { select: { title: true } },

      temporaryResidenceAddress: true,
    },
  },
};
@Injectable()
export class StudentsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly contactStudentRepository: ContactStudentRepository,
    private readonly sharesService: SharesService,
  ) {}

  async findStudentById(orgId: number, id: number) {
    return this.prisma.student.findFirst({
      where: { id, orgId },
    });
  }

  async findStudentsInClass(orgId: number, classId: number) {
    return this.prisma.studentClass.findMany({
      where: { classId, orgId },
      include: {
        student: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async countStudentsInClass(orgId: number, classId: number) {
    return this.prisma.studentClass.count({
      where: { classId, orgId },
    });
  }

  async findStudentPersonalInfoById(orgId: number, id: number) {
    return this.prisma.student.findFirst({
      where: { id, orgId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
            personal: true,
          },
        },
      },
    });
  }

  async findStudentInClassPaginate(
    orgId: number,
    classId: number,
    query: GetStudentByClassIdDto,
  ) {
    const { page = 1, size = 10, q, order = ORDER_ENUM.DESC } = query;

    const studentClass = await this.prisma.studentClass.findMany({
      where: {
        classId,
        orgId,
        ...(q
          ? {
              student: {
                OR: [
                  { code: { contains: q, mode: 'insensitive' } },
                  {
                    user: {
                      OR: [
                        { firstName: { contains: q, mode: 'insensitive' } },
                        { lastName: { contains: q, mode: 'insensitive' } },
                      ],
                    },
                  },
                ],
              },
            }
          : {}),
      },
      include: {
        class: true,
        student: {
          include: {
            user: true,
            mainStudentContact: {
              select: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    avatar: true,
                    phone: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        id: order,
      },
      skip: (page - 1) * size,
      take: size,
    });

    const count = await this.prisma.studentClass.count({
      where: {
        classId,
        orgId,
        ...(q
          ? {
              student: {
                OR: [
                  { code: { contains: q, mode: 'insensitive' } },
                  {
                    user: {
                      OR: [
                        { firstName: { contains: q, mode: 'insensitive' } },
                        { lastName: { contains: q, mode: 'insensitive' } },
                      ],
                    },
                  },
                ],
              },
            }
          : {}),
      },
    });

    return { studentClass, count };
  }

  async findStudentDetailById(orgId: number, id: number) {
    const result = await this.prisma.student.findFirst({
      where: { id, orgId },
      select: {
        studentContacts: { select: studentContactsSelect },
        user: { select: userSelect },
        confirmedBy: { select: { id: true, firstName: true, lastName: true } },
        priorityPolicy: {
          select: {
            id: true,
            title: true,
          },
        },
        priorityPolicyId: true,
        specialNeedsPolicy: {
          select: {
            id: true,
            title: true,
          },
        },
        specialNeedsPolicyId: true,
        schoolYear: { select: { id: true, title: true } },
        studentClasses: {
          orderBy: { id: 'desc' },
          take: 1,
          select: {
            class: { select: { id: true, name: true, gradeLevel: true } },
          },
        },
        code: true,
        status: true,
        mainContactId: true,
        id: true,
        admissionDate: true,
        admissionSchoolYearId: true,
        admissionType: true,
      },
    });

    if (!result) {
      throw new AppError(AppException.STUDENT_NOT_FOUND);
    }

    const {
      id: studentId,
      code,
      status,
      mainContactId,
      user,
      studentContacts: studentContactRelation,
      admissionDate,
      admissionSchoolYearId,
      admissionType,
      schoolYear,
      priorityPolicy,
      specialNeedsPolicy,
      priorityPolicyId,
      specialNeedsPolicyId,
      studentClasses,
      confirmedBy,
    } = result;

    const personal = user?.personal;

    const formattedContacts = this.formatStudentContacts(
      studentContactRelation,
    );
    const mainStudentContact = formattedContacts.find(
      (c) => c.id === mainContactId,
    );
    let _class = undefined;
    if (studentClasses.length > 0) {
      _class = {
        ...studentClasses[0]?.class,
        gradeLevel: studentClasses[0]?.class.gradeLevel,
      };
    }

    return {
      id: studentId,
      userId: user?.id,
      code,
      status,
      avatar: user?.avatar,
      sex: personal?.sex,
      admissionDate,
      admissionSchoolYearId,
      admissionSchoolYearTitle: schoolYear?.title,
      admissionType,

      firstName: personal?.firstName,
      lastName: personal?.lastName,
      citizenId: personal?.citizenId,
      dateOfBirth: personal?.dateOfBirth,
      dateOfIssue: personal?.dateOfIssue,
      dateOfExpiry: personal?.dateOfExpiry,
      placeOfIssue: personal?.placeOfIssue,
      maritalStatus: personal?.maritalStatus,
      occupation: personal?.occupation,

      religionId: personal?.religionId,
      ethnicityId: personal?.ethnicityId,
      nationalityId: personal?.nationalityId,
      priorityPolicyId,
      priorityPolicyTitle: priorityPolicy?.title,
      specialNeedsPolicyId,
      specialNeedsPolicyTitle: specialNeedsPolicy?.title,

      permanentResidenceAddress: personal?.permanentResidenceAddress,
      temporaryResidenceAddress: personal?.temporaryResidenceAddress,

      religionTitle: personal?.religion?.title,
      ethnicityTitle: personal?.ethnic?.title,
      nationalityTitle: personal?.nation?.title,

      confirmedById: confirmedBy?.id,
      confirmedByFirstName: confirmedBy?.firstName,
      confirmedByLastName: confirmedBy?.lastName,

      originPlaceProvinceId: personal?.originPlaceProvinceId,
      // originPlaceDistrictId: personal?.originPlaceDistrictId,
      originPlaceWardId: personal?.originPlaceWardId,
      permanentResidenceProvinceId: personal?.permanentResidenceProvinceId,
      // permanentResidenceDistrictId: personal?.permanentResidenceDistrictId,
      permanentResidenceWardId: personal?.permanentResidenceWardId,
      temporaryResidenceProvinceId: personal?.temporaryResidenceProvinceId,
      // temporaryResidenceDistrictId: personal?.temporaryResidenceDistrictId,
      temporaryResidenceWardId: personal?.temporaryResidenceWardId,

      originPlaceProvinceTitle: personal?.originPlaceProvince?.title,
      // originPlaceDistrictTitle: personal?.originPlaceDistrict?.title,
      originPlaceWardTitle: personal?.originPlaceWard?.title,
      permanentResidenceProvinceTitle:
        personal?.permanentResidenceProvince?.title,
      // permanentResidenceDistrictTitle:
      //   personal?.permanentResidenceDistrict?.title,
      permanentResidenceWardTitle: personal?.permanentResidenceWard?.title,
      temporaryResidenceProvinceTitle:
        personal?.temporaryResidenceProvince?.title,
      // temporaryResidenceDistrictTitle:
      //   personal?.temporaryResidenceDistrict?.title,
      temporaryResidenceWardTitle: personal?.temporaryResidenceWard?.title,
      gradeLevel: _class?.gradeLevel,
      class: _class,
      classId: _class?.id,

      mainContactId,
      mainStudentContact,
      studentContacts: formattedContacts,
    };
  }

  async findStudentsByOrgId(orgId: number, query: GetStudentsDto) {
    const {
      page = 1,
      size = 10,
      grd,
      clss,
      q,
      status: studentStatuses,
      order = ORDER_ENUM.DESC,
      orderBy = 'id',
    } = query;
    const where: any = {
      orgId,

      ...(clss?.length ? { classId: { in: clss } } : {}),

      ...(grd?.length
        ? {
            studentClasses: {
              some: {
                class: {
                  gradeLevel: { in: grd },
                },
              },
            },
          }
        : {}),

      ...(studentStatuses?.length
        ? {
            status: {
              in: studentStatuses,
            },
          }
        : {}),

      ...(q
        ? {
            OR: [
              { code: { contains: q, mode: 'insensitive' } },
              {
                user: {
                  OR: [
                    { firstName: { contains: q, mode: 'insensitive' } },
                    { lastName: { contains: q, mode: 'insensitive' } },
                  ],
                },
              },
            ],
          }
        : {}),
    };

    const [students, total] = await Promise.all([
      this.prisma.student.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: [
          {
            [orderBy]: order,
          },
          { id: 'desc' },
        ],
        include: {
          studentContacts: {
            select: {
              relationship: true,
              relationshipTitle: true,
              studentContact: {
                select: {
                  user: true,
                },
              },
            },
          },
          studentClasses: {
            where: {
              status: {
                in: [STUDENT_CLASS_STATUS.CREATED, STUDENT_CLASS_STATUS.ACTIVE],
              },
            },
            orderBy: { id: 'desc' },
            take: 1,
            select: {
              classId: true,
              class: {
                select: {
                  name: true,
                  gradeLevel: true,
                },
              },
            },
          },
          mainStudentContact: {
            select: {
              user: true,
            },
          },
          user: {
            select: {
              firstName: true,
              lastName: true,
              personal: true,
              avatar: true,
            },
          },
        },
      }),
      this.prisma.student.count({ where }),
    ]);

    return { students, total };
  }

  async createMany(
    data: ImportStudentRequest,
  ): Promise<{ id: number; code: string; error: string | null }[]> {
    let students: { id: number; code: string; error: string | null }[] = [];
    for (const item of data.students) {
      try {
        // Permanent Residence
        const permanentProvinceId = this.sharesService.findProvinceIdByName(
          item.permanentResidenceProvince,
        );
        const permanentResidenceWardId = this.sharesService.findWardIdByName(
          permanentProvinceId,
          item.permanentResidenceWard,
        );
        // Temporary Residence
        const temporaryProvinceId = this.sharesService.findProvinceIdByName(
          item.temporaryResidenceProvince,
        );
        const temporaryResidenceWardId = this.sharesService.findWardIdByName(
          temporaryProvinceId,
          item.temporaryResidenceWard,
        );

        // Sex
        const sex = item.sex;

        const dto: CreateStudentRequestDto = {
          ...item,
          sex,
          dateOfBirth: item.dateOfBirth
            ? new Date(item.dateOfBirth)
            : undefined,
          nationalityId: this.sharesService.findNationIdByName(
            item.nationality,
          ),
          religionId: this.sharesService.findReligionIdByName(item.religion),
          permanentResidenceProvinceId: permanentProvinceId,
          permanentResidenceWardId: permanentResidenceWardId,
          permanentResidenceAddress: item.permanentResidenceAddress,

          temporaryResidenceProvinceId: temporaryProvinceId,
          temporaryResidenceWardId: temporaryResidenceWardId,
          temporaryResidenceAddress: item.temporaryResidenceAddress,
        };

        const student = await this.prisma.$transaction(async (prisma) => {
          let priorityPolicyFields = {};
          if (item.admissionInfo) {
            const {
              priorityPolicy, // priorityPolicyId
              gradeLevel,
              disabilityPolicy, // specialNeedsPolicyId
              admissionDate,
              admissionSchoolYear, // admissionSchoolYearId
              admissionType, // admissionType
              className, // classId
            } = item.admissionInfo;
            const _gradeLevel = gradeLevel!;
            const schoolYear = await this.sharesService.findSchoolYearIdByTitle(
              admissionSchoolYear,
              data.orgId,
            );
            let classId = undefined;
            if (schoolYear) {
              const _class = await this.sharesService.findClassByName(
                data.orgId,
                schoolYear.id,
                className!,
              );
              classId = _class?.id;
            }
            const priorityPolicyId =
              this.sharesService.findPriorityPolicyIdByName(priorityPolicy);
            const specialNeedsPolicyId =
              this.sharesService.findSpecialNeedsPolicyIdByName(
                disabilityPolicy,
              );

            priorityPolicyFields = {
              priorityPolicyId,
              gradeLevel: _gradeLevel,
              specialNeedsPolicyId,
              admissionDate: admissionDate
                ? new Date(admissionDate)
                : undefined,
              admissionSchoolYearId: schoolYear?.id,
              admissionType: admissionType!,
              classId,
            };
          }
          const _student = await this.createStudent(
            data.orgId,
            dto,
            priorityPolicyFields,
            prisma,
          );
          const promise = [];
          if (item.medicalInfo) {
            const { foodAllergy, drugAllergy, disease, note } =
              item.medicalInfo;
            const medicalList = [];
            if (foodAllergy) {
              medicalList.push({
                group: 2,
                type: 2,
                info: foodAllergy,
              });
            }
            if (drugAllergy) {
              medicalList.push({
                group: 2,
                type: 3,
                info: drugAllergy,
              });
            }
            if (disease) {
              medicalList.push({
                group: 3,
                type: 4,
                info: disease,
              });
            }
            if (note) {
              medicalList.push({
                group: 1,
                type: 1,
                info: note,
              });
            }
            promise.push(
              this.updateMedicalInfo(_student.id, { medicalList }, prisma),
            );
          }

          if (item.guardians) {
            const contacts = item.guardians.map((guardian, index) => ({
              firstName: guardian.firstName!,
              lastName: guardian.lastName!,
              phone: guardian.phone!,
              email: guardian.email,
              relationship: guardian.relationship!,
              relationshipTitle: guardian.relationshipTitle!,
              isMainContact: index === 0,
            }));
            promise.push(
              this.createStudentContacts(
                _student.id,
                data.orgId,
                contacts,
                prisma,
              ),
            );
          }

          await Promise.all(promise);

          return { id: _student.id, code: item.code, error: null };
        });
        students.push(student);
      } catch (error) {
        students.push({
          id: 0,
          code: item.code,
          error: error?.message || error?.toString() || 'Unknown error',
        });
      }
    }

    return students;
  }

  async createStudentContacts(
    studentId: number,
    orgId: number,
    request: UpdateContactStudentRequestDto[],
    tx?: Prisma.TransactionClient,
  ) {
    const fn = async (prisma: Prisma.TransactionClient) => {
      for (const contact of request) {
        let user = await prisma.user.findUnique({
          where: { orgId_phone: { orgId, phone: contact.phone } },
        });
        if (!user) {
          user = await prisma.user.create({
            data: {
              orgId,
              firstName: contact.firstName,
              lastName: contact.lastName,
              email: contact.email,
              phone: contact.phone,
              avatar: contact.avatar,
            },
          });
        }

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
      }
    };
    return tx ? fn(tx) : this.prisma.$transaction(fn);
  }

  async createStudent(
    orgId: number,
    data: CreateStudentRequestDto,
    admissionInfo: any = {},
    tx?: Prisma.TransactionClient,
  ) {
    const fn = async (prisma: Prisma.TransactionClient) => {
      const user = await prisma.user.create({
        data: {
          orgId,
          firstName: data.firstName,
          lastName: data.lastName,
          personal: {
            create: {
              firstName: data.firstName,
              lastName: data.lastName,
              citizenId: data.citizenId,
              dateOfBirth: data.dateOfBirth,

              sex: data.sex,
              nationalityId: data.nationalityId,
              religionId: data.religionId,
              ethnicityId: data.ethnicityId,

              originPlaceProvinceId: data.originPlaceProvinceId,
              // originPlaceDistrictId: data.originPlaceDistrictId,
              originPlaceWardId: data.originPlaceWardId,

              permanentResidenceProvinceId: data.permanentResidenceProvinceId,
              // permanentResidenceDistrictId: data.permanentResidenceDistrictId,
              permanentResidenceWardId: data.permanentResidenceWardId,
              permanentResidenceAddress: data.permanentResidenceAddress,

              temporaryResidenceAddress: data.temporaryResidenceAddress,
              temporaryResidenceProvinceId: data.temporaryResidenceProvinceId,
              // temporaryResidenceDistrictId: data.temporaryResidenceDistrictId,
              temporaryResidenceWardId: data.temporaryResidenceWardId,
            },
          },
        },
        include: {
          personal: true,
        },
      });

      const student = await prisma.student.create({
        data: {
          orgId,
          code: data.code,
          userId: user.id,
          ...admissionInfo,
        },
      });
      const { personal, ...rest } = user;

      return { ...rest, ...personal, ...student };
    };
    return tx ? fn(tx) : this.prisma.$transaction(fn);
  }

  async updateStudent(
    orgId: number,
    studentId: number,
    data: CreateStudentRequestDto,
  ) {
    return this.prisma.$transaction(async (prisma) => {
      const student = await prisma.student.findFirst({
        where: { id: studentId, orgId },
        include: { user: true },
      });

      if (!student) {
        throw new AppError(AppException.STUDENT_NOT_FOUND);
      }

      const updatedUser = await prisma.user.update({
        where: { id: student.userId },
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          avatar: data.avatar,
          personal: {
            update: {
              firstName: data.firstName,
              lastName: data.lastName,

              citizenId: data.citizenId,
              dateOfBirth: data.dateOfBirth,
              dateOfExpiry: data.dateOfExpiry,
              dateOfIssue: data.dateOfIssue,
              sex: data.sex,
              nationalityId: data.nationalityId,
              ethnicityId: data.ethnicityId,
              religionId: data.religionId,
              placeOfIssue: data.placeOfIssue,

              originPlaceProvinceId: data.originPlaceProvinceId,
              // originPlaceDistrictId: data.originPlaceDistrictId,
              originPlaceWardId: data.originPlaceWardId,

              permanentResidenceProvinceId: data.permanentResidenceProvinceId,
              // permanentResidenceDistrictId: data.permanentResidenceDistrictId,
              permanentResidenceWardId: data.permanentResidenceWardId,
              permanentResidenceAddress: data.permanentResidenceAddress,

              temporaryResidenceAddress: data.temporaryResidenceAddress,
              temporaryResidenceProvinceId: data.temporaryResidenceProvinceId,
              // temporaryResidenceDistrictId: data.temporaryResidenceDistrictId,
              temporaryResidenceWardId: data.temporaryResidenceWardId,
            },
          },
        },
        include: {
          personal: true,
        },
      });

      await prisma.student.update({
        where: { id: studentId },
        data: {
          code: data.code,
        },
      });
      return updatedUser;
    });
  }

  async updateStudentInfo(
    orgId: number,
    userId: number,
    studentId: number,
    updatePayload: {
      firstName?: string;
      lastName?: string;
      avatar?: string;
      personal?: Prisma.PersonalUpdateInput;
    },
  ) {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const { firstName, lastName, avatar, personal = {} } = updatePayload;

        const data: Prisma.UserUpdateInput = { firstName, lastName, avatar };

        if (Object.keys(personal).length > 0) {
          data.personal = {
            update: personal,
          };
        }

        await prisma.user.update({
          where: { id: userId, orgId },
          data,
        });

        return this.findStudentPersonalInfoById(orgId, studentId);
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteStudent(orgId: number, id: number): Promise<Student> {
    return this.prisma.student.delete({
      where: { id, orgId },
    });
  }

  async updateMedicalInfo(
    studentId: number,
    data: UpdateMedicalInfoRequestDto,
    tx?: Prisma.TransactionClient,
  ) {
    const fn = async (prisma: Prisma.TransactionClient) => {
      await prisma.studentMedicalInfo.deleteMany({
        where: { studentId },
      });

      const medicalInfo = await prisma.studentMedicalInfo.createManyAndReturn({
        data: data.medicalList.map((info) => ({
          studentId,
          ...info,
        })),
      });
      return medicalInfo;
    };
    return tx ? fn(tx) : this.prisma.$transaction(fn);
  }

  async findStudentByCode(orgId: number, code: string) {
    return this.prisma.student.findFirst({
      where: {
        orgId,
        code,
      },
    });
  }
  async findMainContactByStudentId(orgId: number, studentId: number) {
    const student = await this.prisma.student.findFirst({
      where: { id: studentId, orgId },
      select: {
        mainContactId: true,
      },
    });

    if (!student || !student.mainContactId) {
      throw new AppError(AppException.STUDENT_NOT_FOUND);
    }

    return this.contactStudentRepository.findStudentsContactById(
      student.mainContactId,
    );
  }

  formatStudentContacts(studentContactRelation: any[]) {
    return studentContactRelation.map((contact) => {
      const {
        relationship,
        relationshipTitle,
        studentContact: {
          user: contactUser,
          id: contactId,
          grantAccess = false,
          status,
        },
      } = contact;

      const {
        id: userId,
        firstName,
        lastName,
        personal,
        ...restUser
      } = contactUser;

      return {
        id: contactId,
        userId,
        firstName,
        lastName,
        relationship,
        relationshipTitle,
        status,
        grantAccess,
        occupation: personal?.occupation,
        dateOfBirth: personal?.dateOfBirth,
        citizenId: personal?.citizenId,
        phone: restUser?.phone,
        email: restUser?.email,
      };
    });
  }
}
