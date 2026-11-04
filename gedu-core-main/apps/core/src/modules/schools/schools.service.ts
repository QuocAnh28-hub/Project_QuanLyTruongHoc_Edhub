import { AppError, AppException } from '@gedu/shared/errors';
import {
  CURRICULUM_SUBJECT_TYPE,
  EDUCATION_LEVEL,
  GRADE_LEVEL,
  ORDER_ENUM,
  SCHOOL_EXTEND_STATUS,
  SCHOOL_LEVEL,
  SCHOOL_TYPE,
  STATUS,
} from '@gedu/shared/enums';
import { CreateCampusDto, UpdateCampusDto } from './dto/campus-request.dto';
import {
  CreateFacilityDto,
  FacilityResponseDto,
  UpdateFacilityDto,
} from './dto/facility-request.dto';
import {
  CreateOperationDto,
  OperationResponseDto,
  UpdateOperationDto,
} from './dto/operation.request.dto';
import { Injectable, Logger } from '@nestjs/common';
import { Prisma, PrismaService, School, SchoolCampus } from '@gedu/prisma';
import { cryptString, generateSecurePassword } from '@gedu/shared/utils';

import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateSchoolDto } from './dto/create-schools.dto';
import { EmailService } from '@gedu/email';
import { GetSchoolsDto } from './dto/get-schools.dto';
import { SchoolRepository } from './repository/school.repository';
import { SchoolResponseDto } from './dto/school.response.dto';
import { UpdateSchoolDto } from './dto/update-schools.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class SchoolsService {
  private readonly logger = new Logger(SchoolsService.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly schoolRepository: SchoolRepository,
    private prisma: PrismaService,
  ) {}

  /**
   * Mock data function - centralized logic for default values
   * TODO: Remove this function when real data is available
   */
  private createMockDefaultData(schoolId: number, school: any, createSchoolDto: CreateSchoolDto, createdBy: number) {
    return {
      facility: {
        schoolId: schoolId,
        totalArea: 5000,
        hasMinimumTeachingEquipment: false,
        hasComputers: false,
        hasInternetAccess: false,
        hasPowerGrid: false,
        hasCleanWaterSource: false,
        hasRestrooms: false,
        hasCleanHygieneEducationProgram: false,
        hasStudentServiceUnit: false,
        createdBy,
        updatedBy: createdBy,
      },
      operation: {
        schoolId: schoolId,
        nationalStandardStatus: 0,
        region: 1,
        zone: 1,
        hasLifeSkillsEducation: false,
        hasBasicEducationProgram: false,
        createdBy,
        updatedBy: createdBy,
      }
    };
  }

  async create(createSchoolDto: CreateSchoolDto, createdBy: number) {
    const { code, id } = createSchoolDto;

    if (code) {
      const existingSchool = await this.schoolRepository.findSchoolByCode(code);

      const isDuplicate = existingSchool && (!id || existingSchool.id !== id);

      if (isDuplicate) {
        throw new AppError(AppException.SCHOOL_CODE_DUPLICATED);
      }
    }

    if (!id) {
      const school = await this.prisma.school.create({
        data: {
          code: createSchoolDto.code,
          name: createSchoolDto.name,
          shortName: createSchoolDto.shortName,
          hotline: createSchoolDto.hotline,
          principalFirstName: createSchoolDto.principalFirstName,
          principalLastName: createSchoolDto.principalLastName,
          principalPhone: createSchoolDto.principalPhone,
          provinceId: createSchoolDto.provinceId,
          wardId: createSchoolDto.wardId,
          address: createSchoolDto.address,
          email: createSchoolDto.email,
          canPreschool: createSchoolDto.canPreschool,
          canPrimarySchool: createSchoolDto.canPrimarySchool,
          canLowerSecondarySchool: createSchoolDto.canLowerSecondarySchool,
          canUpperSecondarySchool: createSchoolDto.canUpperSecondarySchool,
          type: createSchoolDto.type,
          dailyScheduleType: createSchoolDto.dailyScheduleType,
          isInternationalSchool: createSchoolDto.isInternationalSchool,
          website: createSchoolDto.website,
          createdBy,
          updatedBy: createdBy,
        },
      });

      // Create mock default data - TODO: Remove when real data is available
      const mockData = this.createMockDefaultData(school.id, school, createSchoolDto, createdBy);

      // Create default school facilities
      await this.prisma.schoolFacility.create({
        data: mockData.facility,
      });

      // Create default school operations
      await this.prisma.schoolOperation.create({
        data: mockData.operation,
      });

      return plainToInstance(SchoolResponseDto, school);
    }

    const existingSchool = await this.schoolRepository.findSchoolById(id);

    if (!existingSchool) {
      throw new AppError(AppException.SCHOOL_NOT_FOUND);
    }

    const school = await this.schoolRepository.updateSchoolById(
      id,
      createSchoolDto,
    );

    return plainToInstance(SchoolResponseDto, school);
  }

  async findAll(query: GetSchoolsDto): Promise<[SchoolResponseDto[], number]> {
    const {
      page = 1,
      size = 100,
      order = ORDER_ENUM.DESC,
      q: keyword,
      type,
      level,
      intl,
      hasAdmin,
      status: inputStatuses,
    } = query;
    const intlBool = intl === 1 ? true : intl === 0 ? false : undefined;
    const hasAdminBool =
      hasAdmin === 1 ? true : hasAdmin === 0 ? false : undefined;

    const andConditions: Prisma.SchoolWhereInput[] = [];

    if (keyword) {
      andConditions.push({
        OR: [
          { name: { contains: keyword, mode: 'insensitive' } },
          { code: { contains: keyword, mode: 'insensitive' } },
        ],
      });
    }

    const orTypeIntl: Prisma.SchoolWhereInput[] = [];
    if (type) {
      const types = Array.isArray(type) ? type : [type];
      orTypeIntl.push({ type: { in: types as SCHOOL_TYPE[] } });
    }
    if (intlBool !== undefined) {
      orTypeIntl.push({ isInternationalSchool: intlBool });
    }
    if (orTypeIntl.length > 0) {
      andConditions.push({ OR: orTypeIntl });
    }

    if (level?.length) {
      const levelFieldSet = new Set<string>();
      if (level.includes(EDUCATION_LEVEL.PRESCHOOL))
        levelFieldSet.add('canPreschool');
      if (level.includes(EDUCATION_LEVEL.PRIMARY))
        levelFieldSet.add('canPrimarySchool');
      if (level.includes(EDUCATION_LEVEL.SECONDARY))
        levelFieldSet.add('canLowerSecondarySchool');
      if (level.includes(EDUCATION_LEVEL.TERTIARY))
        levelFieldSet.add('canUpperSecondarySchool');

      const orLevelConditions = Array.from(levelFieldSet).map((key) => ({
        [key]: true,
      }));
      if (orLevelConditions.length > 0) {
        andConditions.push({ OR: orLevelConditions });
      }
    }

    const orStatusConditions: Prisma.SchoolWhereInput[] = [];
    if (inputStatuses?.includes(SCHOOL_EXTEND_STATUS.NO_ADMIN)) {
      orStatusConditions.push({
        schoolStaffs: {
          none: { isAdmin: true },
        },
      });
    }

    const filteredStatuses = inputStatuses?.filter(
      (s) => s !== SCHOOL_EXTEND_STATUS.NO_ADMIN,
    );
    if (filteredStatuses && filteredStatuses.length > 0) {
      orStatusConditions.push({
        status: { in: filteredStatuses },
      });
    }
    if (orStatusConditions.length > 0) {
      andConditions.push({ OR: orStatusConditions });
    }

    if (hasAdminBool === true) {
      andConditions.push({
        schoolStaffs: {
          some: { isAdmin: true },
        },
      });
    }
    if (hasAdminBool === false) {
      andConditions.push({
        schoolStaffs: {
          none: { isAdmin: true },
        },
      });
    }

    const where: Prisma.SchoolWhereInput =
      andConditions.length > 0 ? { AND: andConditions } : {};

    const [schools, totalCount] = await Promise.all([
      this.prisma.school.findMany({
        include: {
          schoolStaffs: {
            select: {
              id: true,
              positionId: true,
              isAdmin: true,
              department: { select: { name: true } },
              position: { select: { title: true } },
              schoolStaffPositions: {
                select: {
                  position: { select: { title: true } },
                },
              },
              user: true,
              status: true,
            },
          },
        },
        skip: (page - 1) * size,
        take: Number(size),
        orderBy: [{ updatedAt: order }, { id: ORDER_ENUM.DESC }],
        where,
      }),

      this.prisma.school.count({ where }),
    ]);

    const formatData = schools.map((school) => {
      const { schoolStaffs, ...rest } = school;

      const admins = schoolStaffs.filter((s) => s.isAdmin);
      const activeAdmins = admins.filter((a) => a.status === STATUS.ACTIVE);
      const inactiveAdmins = admins.filter((a) => a.status !== STATUS.ACTIVE);

      const { prioritizedAdmins } = this.getPriorityAdmins(
        admins,
        activeAdmins,
        inactiveAdmins,
      );

      const adminStaff = prioritizedAdmins[0];
      const admin = adminStaff
        ? [
            {
              ...adminStaff.user,
              status: +adminStaff.status,
              staffId: adminStaff.id,
              departmentName: adminStaff.department?.title,
              positionTitle: adminStaff.position?.title,
            },
          ]
        : [];

      return {
        ...rest,
        admin,
      };
    });

    const result = plainToInstance(SchoolResponseDto, formatData);
    return [result, totalCount];
  }

  async findOne(id: number): Promise<SchoolResponseDto> {
    const school = await this.prisma.school.findUnique({
      where: { id },
      include: {
        schoolCampuses: true,
        schoolOperation: true,
        schoolFacility: true,
        province: true,
        ward: true,
        schoolStaffs: {
          include: {
            user: true,
            department: true,
            position: true,
          },
          where: {
            isAdmin: true,
          },
        },
      },
    });

    if (!school) {
      throw new AppError(AppException.SCHOOL_NOT_FOUND);
    }

    const { schoolStaffs, province, ward, ...rest } = school;
    const admin = schoolStaffs?.[0];

    const result = {
      ...rest,
      admin: admin
        ? [
            {
              ...admin.user,
              status: admin.status,
              departmentName: admin.department?.name,
              positionTitle: admin.position?.title,
              staffId: admin.id,
            },
          ]
        : [],
    };

    return {
      ...result,
      shortName: result?.shortName || undefined,
      address: result?.address || undefined,
      wardTitle: school?.ward?.title || undefined,
      provinceTitle: school?.province?.title || undefined,
      dailyScheduleType: result?.dailyScheduleType || 1,
      principalFirstName: result?.principalFirstName || undefined,
      principalLastName: result?.principalLastName || undefined,
      principalPhone: result?.principalPhone || undefined,
      provinceId: result?.provinceId || null,
      wardId: result?.wardId || null,
      dateFounded: result?.dateFounded?.toISOString() || undefined,
      email: result?.email || undefined,
      website: result?.website || undefined,
      hotline: result?.hotline || undefined,
      ranking: result?.ranking || undefined,
      fax: result?.fax || undefined,
      principalEmail: result?.principalEmail || undefined,
      principalIsPartyMember: result?.principalIsPartyMember || false,
      schoolOperation: result?.schoolOperation || null,
      schoolFacility: result?.schoolFacility || null,
      createdBy: result?.createdBy || -1,
      updatedBy: result?.updatedBy || -1,
    };
  }

  async update(id: number, updateSchoolDto: UpdateSchoolDto) {
    try {
      const updateData = {
        ...updateSchoolDto,
        ...(updateSchoolDto.dateFounded && {
          dateFounded: new Date(updateSchoolDto.dateFounded),
        }),
      };
      const school = await this.prisma.school.update({
        where: { id },
        data: updateData,
      });
      return plainToInstance(SchoolResponseDto, school);
    } catch (error) {
      throw error;
    }
  }

  async addAdmin(schoolId: number, userAdmin: CreateAdminDto) {
    const isSchoolExists = await this.prisma.school.findUnique({
      where: { id: schoolId },
      select: { id: true },
    });

    if (!isSchoolExists) {
      throw new AppError(AppException.SCHOOL_NOT_FOUND);
    }

    const initialPassword = userAdmin.initialPassword
      ? await cryptString(userAdmin.initialPassword)
      : null;

    return await this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          firstName: userAdmin.firstName,
          lastName: userAdmin.lastName,
          phone: userAdmin.phone,
          email: userAdmin.email,
          orgId: schoolId,
          account: {
            create: {
              userName: userAdmin.email,
              password: initialPassword,
              roles: '',
              orgId: schoolId,
            },
          },
          personal: {
            create: {
              firstName: userAdmin.firstName,
              lastName: userAdmin.lastName,
            },
          },
        },
      });

      const staff = await prisma.schoolStaff.create({
        data: {
          orgId: schoolId,
          userId: user.id,
          code: userAdmin.code,
          positionId: userAdmin.positionId,
          departmentId: userAdmin.departmentId,
          isAdmin: true,
          createdBy: 1,
          updatedBy: 1,
        },
      });

      await prisma.schoolStaffPositions.create({
        data: {
          orgId: schoolId,
          staffId: staff.id,
          positionId: userAdmin.positionId,
          createdBy: 1,
          updatedBy: 1,
        },
      });

      const roleCode = await prisma.position_Role.findFirst({
        where: {
          position_id: userAdmin.positionId,
        },
        select: {
          role_code: true,
        },
      });

      if (roleCode) {
        const roleAssign = await prisma.role_Permission.findMany({
          where: {
            role_code: roleCode.role_code,
          },
        });
        if (roleAssign) {
          await prisma.account.update({
            where: {
              userId: user.id,
            },
            data: {
              roles: roleAssign.map((item) => item.permission_code).join(','),
            },
          });
        }
      }

      return {
        message: 'Admin created successfully, pending activation',
      };
    });
  }

  async isSchoolCodeExists(code: string) {
    const school = await this.prisma.school.findUnique({
      where: { code },
      select: { id: true },
    });
    return !!school;
  }

  async createSchools(schoolDtos: CreateSchoolDto[], createdBy: number) {
    return await this.prisma.school.createManyAndReturn({
      data: schoolDtos.map((school) => ({
        ...school,
        createdBy,
        updatedBy: createdBy,
      })),
      skipDuplicates: true,
      select: {
        id: true,
        code: true,
      },
    });
  }

  async createCampuses(
    schoolId: number,
    campuses: CreateCampusDto[],
  ): Promise<{
    message: string;
    campuses: SchoolCampus[];
  }> {
    const school = await this.prisma.school.findUnique({
      where: { id: schoolId },
      select: { id: true },
    });

    if (!school) {
      throw new AppError(AppException.SCHOOL_NOT_FOUND);
    }

    const campusCodes = [...new Set(campuses.map((campus) => campus.code))];

    const existingCampuses = await this.prisma.schoolCampus.findMany({
      where: {
        schoolId,
        code: { in: campusCodes },
      },
      select: { code: true },
    });

    if (existingCampuses.length > 0) {
      throw new AppError(AppException.DUPLICATE_CAMPUS_CODES);
    }

    const createdCampuses = await this.prisma.schoolCampus.createManyAndReturn({
      data: campuses.map((campus) => ({
        schoolId,
        code: campus.code,
        name: campus.name,
        address: campus.address || '',
        provinceId: campus.provinceId,
        wardId: campus.wardId,
        hotline: campus.hotline,
        totalArea: campus.totalArea,
        distance: campus.distance,
        meansOfTransportation: campus.meansOfTransportation,
      })),
    });

    return {
      message: `Successfully created ${createdCampuses.length} campus(es)`,
      campuses: createdCampuses,
    };
  }

  async updateCampuses(
    schoolId: number,
    campuses: UpdateCampusDto[],
  ): Promise<{ updated: any[]; deleted: number[] }> {
    const school = await this.prisma.school.findUnique({
      where: { id: schoolId },
    });

    if (!school) {
      throw new AppError(AppException.SCHOOL_NOT_FOUND);
    }

    const result = {
      updated: [] as any[],
      deleted: [] as number[],
    };

    return await this.prisma.$transaction(async (tx) => {
      for (const campus of campuses) {
        if (campus.isDeleted && campus.id) {
          await tx.schoolCampus.delete({
            where: {
              id: campus.id,
              schoolId: schoolId,
            },
          });
          result.deleted.push(campus.id);
        } else if (campus.id) {
          const { isDeleted, ...updateData } = campus;
          const updated = await tx.schoolCampus.update({
            where: {
              id: campus.id,
              schoolId: schoolId,
            },
            data: {
              ...updateData,
              updatedAt: new Date(),
            },
          });
          result.updated.push(updated);
        } else {
          throw new AppError(AppException.CAMPUS_CREATION_NOT_ALLOWED);
        }
      }

      return result;
    });
  }

  async getFacilities(schoolId: number): Promise<FacilityResponseDto | null> {
    const school = await this.prisma.school.findUnique({
      where: { id: schoolId },
    });

    if (!school) {
      throw new AppError(AppException.SCHOOL_NOT_FOUND);
    }

    const facility = await this.prisma.schoolFacility.findUnique({
      where: { schoolId },
    });

    return facility
      ? {
          ...{
            ...facility,
            createdBy: facility.createdBy || undefined,
            updatedBy: facility.updatedBy || undefined,
          },
          totalArea: facility.totalArea ? Number(facility.totalArea) : 0,
        }
      : null;
  }

  async createFacilities(
    schoolId: number,
    createFacilityDto: CreateFacilityDto,
    createdBy: number,
  ): Promise<FacilityResponseDto> {
    const school = await this.prisma.school.findUnique({
      where: { id: schoolId },
    });

    if (!school) {
      throw new AppError(AppException.SCHOOL_NOT_FOUND);
    }

    const existingFacility = await this.prisma.schoolFacility.findUnique({
      where: { schoolId },
    });

    if (existingFacility) {
      throw new AppError(AppException.SCHOOL_FACILITY_ALREADY_EXISTS);
    }

    const facility = await this.prisma.schoolFacility.create({
      data: {
        schoolId,
        ...createFacilityDto,
        createdBy,
        updatedBy: createdBy,
      },
    });

    return facility
      ? {
          ...{
            ...facility,
            createdBy: facility.createdBy || undefined,
            updatedBy: facility.updatedBy || undefined,
          },
          totalArea: facility.totalArea ? Number(facility.totalArea) : 0,
        }
      : facility;
  }

  async updateFacilities(
    schoolId: number,
    updateFacilityDto: UpdateFacilityDto,
    updatedBy: number,
  ): Promise<FacilityResponseDto> {
    const school = await this.prisma.school.findUnique({
      where: { id: schoolId },
    });

    if (!school) {
      throw new AppError(AppException.SCHOOL_NOT_FOUND);
    }

    const existingFacility = await this.prisma.schoolFacility.findUnique({
      where: { schoolId },
    });

    if (!existingFacility) {
      throw new AppError(AppException.SCHOOL_FACILITY_NOT_FOUND);
    }

    const facility = await this.prisma.schoolFacility.update({
      where: { schoolId },
      data: {
        ...updateFacilityDto,
        updatedBy,
        updatedAt: new Date(),
      },
    });

    return facility
      ? {
          ...{
            ...facility,
            createdBy: facility.createdBy || undefined,
            updatedBy: facility.updatedBy || undefined,
          },
          totalArea: facility.totalArea
            ? Number(facility.totalArea)
            : undefined,
        }
      : facility;
  }

  async getOperations(schoolId: number): Promise<OperationResponseDto | null> {
    const school = await this.prisma.school.findUnique({
      where: { id: schoolId },
    });

    if (!school) {
      throw new AppError(AppException.SCHOOL_NOT_FOUND);
    }

    const operation = await this.prisma.schoolOperation.findUnique({
      where: { schoolId },
    });

    if (!operation) {
      return null;
    }

    return plainToInstance(OperationResponseDto, operation);
  }

  async createOperations(
    schoolId: number,
    createOperationDto: CreateOperationDto,
    createdBy: number,
  ): Promise<OperationResponseDto> {
    const school = await this.prisma.school.findUnique({
      where: { id: schoolId },
    });

    if (!school) {
      throw new AppError(AppException.SCHOOL_NOT_FOUND);
    }

    const existingOperation = await this.prisma.schoolOperation.findUnique({
      where: { schoolId },
    });

    if (existingOperation) {
      throw new AppError(AppException.SCHOOL_OPERATION_ALREADY_EXISTS);
    }

    const operation = await this.prisma.schoolOperation.create({
      data: {
        schoolId,
        nationalStandardStatus: createOperationDto.nationalStandardStatus ?? 0,
        region: createOperationDto.region,
        zone: createOperationDto.zone,
        hasStudentsWithDisabilities:
          createOperationDto.hasStudentsWithDisabilities ?? false,
        hasLifeSkillsEducation:
          createOperationDto.hasLifeSkillsEducation ?? false,
        hasBasicEducationProgram:
          createOperationDto.hasBasicEducationProgram ?? false,
        createdBy,
        updatedBy: createdBy,
      },
    });

    return plainToInstance(OperationResponseDto, operation);
  }

  async updateOperations(
    schoolId: number,
    updateOperationDto: UpdateOperationDto,
    updatedBy: number,
  ): Promise<OperationResponseDto> {
    const school = await this.prisma.school.findUnique({
      where: { id: schoolId },
    });

    if (!school) {
      throw new AppError(AppException.SCHOOL_NOT_FOUND);
    }

    const existingOperation = await this.prisma.schoolOperation.findUnique({
      where: { schoolId },
    });

    if (!existingOperation) {
      throw new AppError(AppException.SCHOOL_OPERATION_NOT_FOUND);
    }

    const operation = await this.prisma.schoolOperation.update({
      where: { schoolId },
      data: {
        ...updateOperationDto,
        updatedBy,
        updatedAt: new Date(),
      },
    });

    return plainToInstance(OperationResponseDto, operation);
  }

  async activateAdmins(
    schoolId: number,
    adminIds: number[],
    requestedPassword?: string,
  ) {
    const school = await this.prisma.school.findUnique({
      where: { id: schoolId },
    });

    if (!school) {
      throw new AppError(AppException.SCHOOL_NOT_FOUND);
    }

    const admins = await this.prisma.schoolStaff.findMany({
      where: {
        orgId: schoolId,
        id: { in: adminIds },
        isAdmin: true,
      },
      include: {
        user: {
          include: {
            account: true,
          },
        },
      },
    });

    if (admins.length === 0) {
      throw new AppError(AppException.SCHOOL_ADMIN_NOT_FOUND);
    }

    const passwordMap = new Map<number, string>();
    const errors: { adminId: number; reason: string }[] = [];
    const toActivate = admins.filter((staff) => {
      if (!staff.user.email) {
        errors.push({ adminId: staff.id, reason: 'Missing user email' });
        return false;
      }
      if (!staff.user.account) {
        errors.push({ adminId: staff.id, reason: 'Missing user account' });
        return false;
      }
      if (staff.status === STATUS.ACTIVE && !requestedPassword) {
        errors.push({ adminId: staff.id, reason: 'Already active' });
        return false;
      }
      return true;
    });

    if (toActivate.length === 0) {
      return {
        message: 'No valid admin accounts to activate.',
        errors,
      };
    }

    await this.prisma.$transaction(async (prisma) => {
      for (const staff of toActivate) {
        if (requestedPassword) {
          await prisma.account.update({
            where: { userId: staff.user.id },
            data: { password: await cryptString(requestedPassword) },
          });
        } else if (!staff.user.account!.password) {
          const password = generateSecurePassword();
          const hashedPassword = await cryptString(password);
          passwordMap.set(staff.id, password);

          await prisma.account.update({
            where: { userId: staff.user.id },
            data: { password: hashedPassword },
          });
        }

        await prisma.schoolStaff.update({
          where: { id: staff.id },
          data: {
            status: STATUS.ACTIVE,
            updatedBy: 1,
            updatedAt: new Date(),
          },
        });
        await prisma.school.update({
          where: { id: staff.orgId },
          data: {
            status: STATUS.ACTIVE,
            updatedAt: new Date(),
          },
        });
      }
    });

    (async () => {
      try {
        const schoolLevels = this.getSchoolLevels(school);
        this.logger.debug(
          'Initialized base curriculums with school levels:',
          schoolLevels,
        );

        await this.initBaseCurriculumsAndSubjects(schoolId, schoolLevels);
        this.logger.debug(
          'Initialized base curriculums and subjects successfully',
        );
      } catch (error) {
        this.logger.error(
          'Failed to initialize base curriculums and subjects',
          error,
        );
      }
    })();

    (async () => {
      for (const staff of toActivate) {
        const password = passwordMap.get(staff.id);
        if (!password) continue;

        const emailResult = await this.emailService.sendAdminAccountEmail(
          staff.user.email!,
          {
            schoolName: school.name,
            adminName: `${staff.user.firstName} ${staff.user.lastName}`,
            email: staff.user.account!.userName,
            password,
          },
        );
        if (emailResult) {
          this.logger.log(
            `Admin activation email sent successfully to ${staff.user.email}`,
          );
        } else {
          this.logger.error(
            `Failed to send admin activation email to ${staff.user.email}`,
          );
        }
      }
    })();

    return {
      message: `Activated ${toActivate.length} admin(s); ${passwordMap.size} activation email(s) are being sent.`,
      successCount: toActivate.length,
      failureCount: errors.length,
      errors,
    };
  }

  async initBaseCurriculumsAndSubjects(orgId: number, schoolLevels: string[]) {
    const existingCurriculum = await this.prisma.curriculum.findFirst({
      where: { orgId, code: 'CTPT-2018' },
    });

    if (existingCurriculum) {
      this.logger.debug('Curriculum already exists:', existingCurriculum);
      return;
    }

    const instructionLanguage = await this.prisma.instructionLanguage.findFirst(
      {
        where: { code: 'vi', isActive: true },
      },
    );

    if (!instructionLanguage) {
      throw new AppError(AppException.INSTRUCTION_LANGUAGE_NOT_FOUND);
    }

    return this.prisma.$transaction(async (tx) => {
      const curriculum = await this.createCurriculum(
        tx,
        orgId,
        instructionLanguage.id,
      );

      const baseSubjects = this.getBaseSubjects(orgId, schoolLevels);
      const gradeLevels = this.getSchoolGradeLevels(schoolLevels);

      await this.createSubjects(tx, baseSubjects);
      const subjectMap = await this.getSubjectMap(tx, orgId);

      await this.createCurriculumGradeLevel(
        tx,
        orgId,
        curriculum.id,
        gradeLevels,
      );

      await this.createSubjectOptions(tx, baseSubjects, subjectMap);
      await this.createDepartmentSubjects(tx, orgId, baseSubjects, subjectMap);
      await this.createCurriculumSubjects(
        tx,
        baseSubjects,
        subjectMap,
        curriculum.id,
        instructionLanguage.id,
        orgId,
      );

      return curriculum;
    });
  }

  private async createCurriculum(
    tx: any,
    orgId: number,
    instructionLanguageId: number,
  ) {
    return tx.curriculum.create({
      data: {
        orgId,
        code: 'CTPT-2018',
        name: 'Chương trình Phổ thông 2018',
        instructionLanguageId,
        graduationDegree: 'Bằng tốt nghiệp THPT Việt Nam',
        isReceived: true,
        canApply: true,
      },
    });
  }

  private async createSubjects(
    tx: Prisma.TransactionClient,
    baseSubjects: any[],
  ) {
    await tx.subject.createMany({
      data: baseSubjects.map((s) => ({
        orgId: s.orgId,
        code: s.code,
        name: s.name,
        canApply: s.canApply,
      })),
      skipDuplicates: true,
    });
  }

  private async getSubjectMap(tx: Prisma.TransactionClient, orgId: number) {
    const subjects = await tx.subject.findMany({ where: { orgId } });
    return Object.fromEntries(
      subjects.map((s: { code: any; id: any }) => [s.code, s.id]),
    );
  }

  private async createSubjectOptions(
    tx: any,
    subjects: any[],
    subjectMap: Record<string, number>,
  ) {
    for (const s of subjects) {
      if (s.options?.length) {
        const subjectId = subjectMap[s.code];
        const options = s.options.map((opt: { code: any; name: any }) => ({
          subjectId,
          code: opt.code,
          name: opt.name,
        }));
        await tx.subjectOption.createMany({
          data: options,
          skipDuplicates: true,
        });
      }
    }
  }

  private async createDepartmentSubjects(
    tx: any,
    orgId: number,
    subjects: any[],
    subjectMap: Record<string, number>,
  ) {
    const allDeptCodes = [
      ...new Set(subjects.flatMap((s) => s.departmentCodes)),
    ];
    const departments = await tx.schoolDepartmentTemplates.findMany({
      where: { code: { in: allDeptCodes } },
    });
    const deptMap = Object.fromEntries(
      departments.map((d: { code: string; id: number }) => [d.code, d.id]),
    );

    const data = subjects.flatMap((s) => {
      const subjectId = subjectMap[s.code];
      if (!subjectId) {
        return [];
      }
      return s.departmentCodes
        .map((code: string | number) => {
          const departmentId = deptMap[code];
          if (!departmentId) {
            return null;
          }
          return {
            orgId,
            subjectId: subjectMap[s.code],
            departmentId,
          };
        })
        .filter(Boolean);
    });

    await tx.departmentSubject.createMany({ data, skipDuplicates: true });
  }

  private async createCurriculumSubjects(
    tx: any,
    subjects: any[],
    subjectMap: Record<string, number>,
    curriculumId: number,
    instructionLangId: number,
    orgId: number,
  ) {
    const data = subjects.flatMap((s) => {
      const subjectId = subjectMap[s.code];
      if (!subjectId) {
        return [];
      }
      return s.appliedGrades.map((grade: string) => ({
        orgId,
        curriculumId,
        gradeLevel: grade,
        subjectId: subjectMap[s.code],
        type: s.type,
        instructionLanguageId: instructionLangId,
        commentsBased: s.commentsBased,
        scoringBased: s.scoringBased,
        lessonsPerWeek: 1,
      }));
    });

    await tx.curriculumSubject.createMany({ data, skipDuplicates: true });
  }

  private getBaseSubjects(orgId: number, schoolLevels: string[]) {
    const primarySubjects = [
      {
        orgId,
        code: 'TVIET',
        name: 'Tiếng Việt',
        canApply: false,
        type: CURRICULUM_SUBJECT_TYPE.REQUIRED,
        departmentCodes: ['TK1', 'TK2', 'TK3', 'TK4', 'TK5'],
        appliedGrades: [
          GRADE_LEVEL.GRADE_1,
          GRADE_LEVEL.GRADE_2,
          GRADE_LEVEL.GRADE_3,
          GRADE_LEVEL.GRADE_4,
          GRADE_LEVEL.GRADE_5,
        ],
        commentsBased: true,
        scoringBased: true,
      },
      {
        orgId,
        code: 'TOAN',
        name: 'Toán',
        canApply: false,
        type: CURRICULUM_SUBJECT_TYPE.REQUIRED,
        departmentCodes: ['TK1', 'TK2', 'TK3', 'TK4', 'TK5'],
        appliedGrades: [
          GRADE_LEVEL.GRADE_1,
          GRADE_LEVEL.GRADE_2,
          GRADE_LEVEL.GRADE_3,
          GRADE_LEVEL.GRADE_4,
          GRADE_LEVEL.GRADE_5,
        ],
        commentsBased: true,
        scoringBased: true,
      },
      {
        orgId,
        code: 'NN2',
        name: 'Ngoại ngữ 2',
        canApply: false,
        type: CURRICULUM_SUBJECT_TYPE.REQUIRED,
        departmentCodes: ['TN'],
        appliedGrades: [
          GRADE_LEVEL.GRADE_3,
          GRADE_LEVEL.GRADE_4,
          GRADE_LEVEL.GRADE_5,
        ],
        commentsBased: true,
        scoringBased: true,
        options: [
          { code: 'N1', name: 'Tiếng Anh' },
          { code: 'N2', name: 'Tiếng Nga' },
          { code: 'N3', name: 'Tiếng Pháp' },
          { code: 'N4', name: 'Tiếng Trung Quốc' },
          { code: 'N5', name: 'Tiếng Đức' },
          { code: 'N6', name: 'Tiếng Nhật' },
          { code: 'N7', name: 'Tiếng Hàn' },
        ],
      },
      {
        orgId,
        code: 'ĐĐUC',
        name: 'Đạo đức',
        canApply: false,
        type: CURRICULUM_SUBJECT_TYPE.REQUIRED,
        departmentCodes: ['TK1', 'TK2', 'TK3', 'TK4', 'TK5'],
        appliedGrades: [
          GRADE_LEVEL.GRADE_1,
          GRADE_LEVEL.GRADE_2,
          GRADE_LEVEL.GRADE_3,
          GRADE_LEVEL.GRADE_4,
          GRADE_LEVEL.GRADE_5,
        ],
        commentsBased: true,
        scoringBased: false,
      },
      {
        orgId,
        code: 'TN&XH',
        name: 'Tự nhiên và Xã hội',
        canApply: false,
        type: CURRICULUM_SUBJECT_TYPE.REQUIRED,
        departmentCodes: ['TK1', 'TK2', 'TK3'],
        appliedGrades: [
          GRADE_LEVEL.GRADE_1,
          GRADE_LEVEL.GRADE_2,
          GRADE_LEVEL.GRADE_3,
        ],
        commentsBased: true,
        scoringBased: false,
      },
      {
        orgId,
        code: 'LS&DL',
        name: 'Lịch sử và Địa lí',
        canApply: false,
        type: CURRICULUM_SUBJECT_TYPE.REQUIRED,
        departmentCodes: ['TK4', 'TK5'],
        appliedGrades: [GRADE_LEVEL.GRADE_4, GRADE_LEVEL.GRADE_5],
        commentsBased: true,
        scoringBased: true,
      },
      {
        orgId,
        code: 'KH',
        name: 'Khoa học',
        canApply: false,
        type: CURRICULUM_SUBJECT_TYPE.REQUIRED,
        departmentCodes: ['TK4', 'TK5'],
        appliedGrades: [GRADE_LEVEL.GRADE_4, GRADE_LEVEL.GRADE_5],
        commentsBased: true,
        scoringBased: true,
      },
      {
        orgId,
        code: 'TH&CN',
        name: 'Tin học và Công nghệ',
        canApply: false,
        type: CURRICULUM_SUBJECT_TYPE.REQUIRED,
        departmentCodes: ['TTCN'],
        appliedGrades: [
          GRADE_LEVEL.GRADE_3,
          GRADE_LEVEL.GRADE_4,
          GRADE_LEVEL.GRADE_5,
        ],
        commentsBased: true,
        scoringBased: true,
      },
      {
        orgId,
        code: 'GDTC',
        name: 'Giáo dục thể chất',
        canApply: false,
        type: CURRICULUM_SUBJECT_TYPE.REQUIRED,
        departmentCodes: ['TN&TC'],
        appliedGrades: [
          GRADE_LEVEL.GRADE_1,
          GRADE_LEVEL.GRADE_2,
          GRADE_LEVEL.GRADE_3,
          GRADE_LEVEL.GRADE_4,
          GRADE_LEVEL.GRADE_5,
        ],
        commentsBased: true,
        scoringBased: false,
      },
      {
        orgId,
        code: 'AN&MT',
        name: 'Nghệ thuật (Âm nhạc, Mĩ thuật)',
        canApply: false,
        type: CURRICULUM_SUBJECT_TYPE.REQUIRED,
        departmentCodes: ['TN&TC'],
        appliedGrades: [
          GRADE_LEVEL.GRADE_1,
          GRADE_LEVEL.GRADE_2,
          GRADE_LEVEL.GRADE_3,
          GRADE_LEVEL.GRADE_4,
          GRADE_LEVEL.GRADE_5,
        ],
        commentsBased: true,
        scoringBased: false,
      },
      {
        orgId,
        code: 'HDTN',
        name: 'Hoạt động trải nghiệm',
        canApply: false,
        type: CURRICULUM_SUBJECT_TYPE.COMPULSORY_EDUCATION_ACTIVITY,
        departmentCodes: ['TK1', 'TK2', 'TK3', 'TK4', 'TK5'],
        appliedGrades: [
          GRADE_LEVEL.GRADE_1,
          GRADE_LEVEL.GRADE_2,
          GRADE_LEVEL.GRADE_3,
          GRADE_LEVEL.GRADE_4,
          GRADE_LEVEL.GRADE_5,
        ],
        commentsBased: true,
        scoringBased: false,
      },
      {
        orgId,
        code: 'TDTTS',
        name: 'Tiếng dân tộc thiểu số',
        canApply: false,
        type: CURRICULUM_SUBJECT_TYPE.OPTIONAL,
        departmentCodes: ['TK1', 'TK2', 'TK3', 'TK4', 'TK5'],
        appliedGrades: [
          GRADE_LEVEL.GRADE_1,
          GRADE_LEVEL.GRADE_2,
          GRADE_LEVEL.GRADE_3,
          GRADE_LEVEL.GRADE_4,
          GRADE_LEVEL.GRADE_5,
        ],
        commentsBased: true,
        scoringBased: false,
      },
      {
        orgId,
        code: 'NN1',
        name: 'Ngoại ngữ 1',
        canApply: false,
        type: CURRICULUM_SUBJECT_TYPE.OPTIONAL,
        departmentCodes: ['TN'],
        appliedGrades: [GRADE_LEVEL.GRADE_1, GRADE_LEVEL.GRADE_2],
        commentsBased: true,
        scoringBased: true,
        options: [
          { code: 'EN', name: 'Tiếng Anh' },
          { code: 'RU', name: 'Tiếng Nga' },
          { code: 'FR', name: 'Tiếng Pháp' },
          { code: 'ZH', name: 'Tiếng Trung Quốc' },
          { code: 'DE', name: 'Tiếng Đức' },
          { code: 'JA', name: 'Tiếng Nhật' },
          { code: 'KO', name: 'Tiếng Hàn' },
        ],
      },
    ];

    const lowerSecondarySubjects = [
      {
        orgId,
        code: 'NGU_VAN',
        name: 'Ngữ Văn',
        canApply: false,
        type: CURRICULUM_SUBJECT_TYPE.REQUIRED,
        departmentCodes: ['TNV'],
        appliedGrades: [
          GRADE_LEVEL.GRADE_6,
          GRADE_LEVEL.GRADE_7,
          GRADE_LEVEL.GRADE_8,
          GRADE_LEVEL.GRADE_9,
        ],
        commentsBased: false,
        scoringBased: true,
      },
      {
        orgId,
        code: 'TOAN',
        name: 'Toán',
        canApply: false,
        type: CURRICULUM_SUBJECT_TYPE.REQUIRED,
        departmentCodes: ['TTT'],
        appliedGrades: [
          GRADE_LEVEL.GRADE_6,
          GRADE_LEVEL.GRADE_7,
          GRADE_LEVEL.GRADE_8,
          GRADE_LEVEL.GRADE_9,
        ],
        commentsBased: false,
        scoringBased: true,
      },
      {
        orgId,
        code: 'NN1',
        name: 'Ngoại ngữ 1',
        canApply: false,
        type: CURRICULUM_SUBJECT_TYPE.REQUIRED,
        departmentCodes: ['TNN'],
        appliedGrades: [
          GRADE_LEVEL.GRADE_6,
          GRADE_LEVEL.GRADE_7,
          GRADE_LEVEL.GRADE_8,
          GRADE_LEVEL.GRADE_9,
        ],
        commentsBased: false,
        scoringBased: true,
        options: [
          { code: 'N1', name: 'Tiếng Anh' },
          { code: 'N2', name: 'Tiếng Nga' },
          { code: 'N3', name: 'Tiếng Pháp' },
          { code: 'N4', name: 'Tiếng Trung Quốc' },
          { code: 'N5', name: 'Tiếng Đức' },
          { code: 'N6', name: 'Tiếng Nhật' },
          { code: 'N7', name: 'Tiếng Hàn' },
        ],
      },
      {
        orgId,
        code: 'GDCD',
        name: 'Giáo Dục Công Dân',
        canApply: false,
        type: CURRICULUM_SUBJECT_TYPE.REQUIRED,
        departmentCodes: ['TSDGD'],
        appliedGrades: [
          GRADE_LEVEL.GRADE_6,
          GRADE_LEVEL.GRADE_7,
          GRADE_LEVEL.GRADE_8,
          GRADE_LEVEL.GRADE_9,
        ],
        commentsBased: false,
        scoringBased: true,
      },
      {
        orgId,
        code: 'LS&DL',
        name: 'Lịch sử và Địa lí',
        canApply: false,
        type: CURRICULUM_SUBJECT_TYPE.REQUIRED,
        departmentCodes: ['TSDGD'],
        appliedGrades: [
          GRADE_LEVEL.GRADE_6,
          GRADE_LEVEL.GRADE_7,
          GRADE_LEVEL.GRADE_8,
          GRADE_LEVEL.GRADE_9,
        ],
        commentsBased: false,
        scoringBased: true,
      },
      {
        orgId,
        code: 'KHTN',
        name: 'Khoa học tự nhiên',
        canApply: false,
        type: CURRICULUM_SUBJECT_TYPE.REQUIRED,
        departmentCodes: ['TLCN', 'THS'],
        appliedGrades: [
          GRADE_LEVEL.GRADE_6,
          GRADE_LEVEL.GRADE_7,
          GRADE_LEVEL.GRADE_8,
          GRADE_LEVEL.GRADE_9,
        ],
        commentsBased: false,
        scoringBased: true,
      },
      {
        orgId,
        code: 'CN',
        name: 'Công nghệ',
        canApply: false,
        type: CURRICULUM_SUBJECT_TYPE.REQUIRED,
        departmentCodes: ['TLCN'],
        appliedGrades: [
          GRADE_LEVEL.GRADE_6,
          GRADE_LEVEL.GRADE_7,
          GRADE_LEVEL.GRADE_8,
          GRADE_LEVEL.GRADE_9,
        ],
        commentsBased: false,
        scoringBased: true,
      },
      {
        orgId,
        code: 'TIN',
        name: 'Tin học',
        canApply: false,
        type: CURRICULUM_SUBJECT_TYPE.REQUIRED,
        departmentCodes: ['TTT'],
        appliedGrades: [
          GRADE_LEVEL.GRADE_6,
          GRADE_LEVEL.GRADE_7,
          GRADE_LEVEL.GRADE_8,
          GRADE_LEVEL.GRADE_9,
        ],
        commentsBased: false,
        scoringBased: true,
      },
      {
        orgId,
        code: 'GDTC',
        name: 'Giáo dục thể chất',
        canApply: false,
        type: CURRICULUM_SUBJECT_TYPE.REQUIRED,
        departmentCodes: ['TN&TDQPNT'],
        appliedGrades: [
          GRADE_LEVEL.GRADE_6,
          GRADE_LEVEL.GRADE_7,
          GRADE_LEVEL.GRADE_8,
          GRADE_LEVEL.GRADE_9,
        ],
        commentsBased: true,
        scoringBased: false,
      },
      {
        orgId,
        code: 'AN&MT',
        name: 'Nghệ thuật (Âm nhạc, Mĩ thuật)',
        canApply: false,
        type: CURRICULUM_SUBJECT_TYPE.REQUIRED,
        departmentCodes: ['TN&TDQPNT'],
        appliedGrades: [
          GRADE_LEVEL.GRADE_6,
          GRADE_LEVEL.GRADE_7,
          GRADE_LEVEL.GRADE_8,
          GRADE_LEVEL.GRADE_9,
        ],
        commentsBased: true,
        scoringBased: false,
      },
      {
        orgId,
        code: 'HDTN&HN',
        name: 'Hoạt động trải nghiệm, hướng nghiệp',
        canApply: false,
        type: CURRICULUM_SUBJECT_TYPE.COMPULSORY_EDUCATION_ACTIVITY,
        departmentCodes: ['TSDGD'],
        appliedGrades: [
          GRADE_LEVEL.GRADE_6,
          GRADE_LEVEL.GRADE_7,
          GRADE_LEVEL.GRADE_8,
          GRADE_LEVEL.GRADE_9,
        ],
        commentsBased: true,
        scoringBased: false,
      },
      {
        orgId,
        code: 'GDDP',
        name: 'Nội dung giáo dục của địa phương',
        canApply: false,
        type: CURRICULUM_SUBJECT_TYPE.LOCAL_EDUCATION_CONTENT,
        departmentCodes: ['TSDGD'],
        appliedGrades: [
          GRADE_LEVEL.GRADE_6,
          GRADE_LEVEL.GRADE_7,
          GRADE_LEVEL.GRADE_8,
          GRADE_LEVEL.GRADE_9,
        ],
        commentsBased: true,
        scoringBased: false,
      },
      {
        orgId,
        code: 'TDTTS',
        name: 'Tiếng dân tộc thiểu số',
        canApply: false,
        type: CURRICULUM_SUBJECT_TYPE.OPTIONAL,
        departmentCodes: ['TNV'],
        appliedGrades: [
          GRADE_LEVEL.GRADE_6,
          GRADE_LEVEL.GRADE_7,
          GRADE_LEVEL.GRADE_8,
          GRADE_LEVEL.GRADE_9,
        ],
        commentsBased: true,
        scoringBased: false,
      },
      {
        orgId,
        code: 'NN2',
        name: 'Ngoại ngữ 2',
        canApply: false,
        type: CURRICULUM_SUBJECT_TYPE.OPTIONAL,
        departmentCodes: ['TNN'],
        appliedGrades: [
          GRADE_LEVEL.GRADE_6,
          GRADE_LEVEL.GRADE_7,
          GRADE_LEVEL.GRADE_8,
          GRADE_LEVEL.GRADE_9,
        ],
        commentsBased: false,
        scoringBased: true,
        options: [
          { code: 'EN', name: 'Tiếng Anh' },
          { code: 'RU', name: 'Tiếng Nga' },
          { code: 'FR', name: 'Tiếng Pháp' },
          { code: 'ZH', name: 'Tiếng Trung Quốc' },
          { code: 'DE', name: 'Tiếng Đức' },
          { code: 'JA', name: 'Tiếng Nhật' },
          { code: 'KO', name: 'Tiếng Hàn' },
        ],
      },
    ];

    const higherSecondarySubjects = [
      {
        orgId,
        code: '01',
        name: 'Toán',
        canApply: false,
        type: CURRICULUM_SUBJECT_TYPE.REQUIRED,
        departmentCodes: ['TTT'],
        appliedGrades: [
          GRADE_LEVEL.GRADE_10,
          GRADE_LEVEL.GRADE_11,
          GRADE_LEVEL.GRADE_12,
        ],
        commentsBased: false,
        scoringBased: true,
      },
      {
        orgId,
        code: '02',
        name: 'Ngữ văn',
        canApply: false,
        type: CURRICULUM_SUBJECT_TYPE.REQUIRED,
        departmentCodes: ['TNV'],
        appliedGrades: [
          GRADE_LEVEL.GRADE_10,
          GRADE_LEVEL.GRADE_11,
          GRADE_LEVEL.GRADE_12,
        ],
        commentsBased: false,
        scoringBased: true,
      },
      {
        orgId,
        code: 'NN1',
        name: 'Ngoại ngữ 1',
        canApply: false,
        type: CURRICULUM_SUBJECT_TYPE.REQUIRED,
        departmentCodes: ['TNN'],
        appliedGrades: [
          GRADE_LEVEL.GRADE_10,
          GRADE_LEVEL.GRADE_11,
          GRADE_LEVEL.GRADE_12,
        ],
        commentsBased: false,
        scoringBased: true,
        options: [
          { code: 'N1', name: 'Tiếng Anh' },
          { code: 'N2', name: 'Tiếng Nga' },
          { code: 'N3', name: 'Tiếng Pháp' },
          { code: 'N4', name: 'Tiếng Trung Quốc' },
          { code: 'N5', name: 'Tiếng Đức' },
          { code: 'N6', name: 'Tiếng Nhật' },
          { code: 'N7', name: 'Tiếng Hàn' },
        ],
      },
      {
        orgId,
        code: '03',
        name: 'Vật lý',
        canApply: false,
        type: CURRICULUM_SUBJECT_TYPE.ELECTIVE,
        departmentCodes: ['TLCN'],
        appliedGrades: [
          GRADE_LEVEL.GRADE_10,
          GRADE_LEVEL.GRADE_11,
          GRADE_LEVEL.GRADE_12,
        ],
        commentsBased: false,
        scoringBased: true,
      },
      {
        orgId,
        code: '04',
        name: 'Hoá học',
        canApply: false,
        type: CURRICULUM_SUBJECT_TYPE.ELECTIVE,
        departmentCodes: ['THS'],
        appliedGrades: [
          GRADE_LEVEL.GRADE_10,
          GRADE_LEVEL.GRADE_11,
          GRADE_LEVEL.GRADE_12,
        ],
        commentsBased: false,
        scoringBased: true,
      },
      {
        orgId,
        code: '05',
        name: 'Sinh học',
        canApply: false,
        type: CURRICULUM_SUBJECT_TYPE.ELECTIVE,
        departmentCodes: ['THS'],
        appliedGrades: [
          GRADE_LEVEL.GRADE_10,
          GRADE_LEVEL.GRADE_11,
          GRADE_LEVEL.GRADE_12,
        ],
        commentsBased: false,
        scoringBased: true,
      },
      {
        orgId,
        code: '06',
        name: 'Lịch sử',
        canApply: false,
        type: CURRICULUM_SUBJECT_TYPE.REQUIRED,
        departmentCodes: ['TSDGD'],
        appliedGrades: [
          GRADE_LEVEL.GRADE_10,
          GRADE_LEVEL.GRADE_11,
          GRADE_LEVEL.GRADE_12,
        ],
        commentsBased: false,
        scoringBased: true,
      },
      {
        orgId,
        code: '07',
        name: 'Địa lí',
        canApply: false,
        type: CURRICULUM_SUBJECT_TYPE.ELECTIVE,
        departmentCodes: ['TSDGD'],
        appliedGrades: [
          GRADE_LEVEL.GRADE_10,
          GRADE_LEVEL.GRADE_11,
          GRADE_LEVEL.GRADE_12,
        ],
        commentsBased: false,
        scoringBased: true,
      },
      {
        orgId,
        code: '08',
        name: 'Giáo dục kinh tế và pháp luật',
        canApply: false,
        type: CURRICULUM_SUBJECT_TYPE.ELECTIVE,
        departmentCodes: ['TSDGD'],
        appliedGrades: [
          GRADE_LEVEL.GRADE_10,
          GRADE_LEVEL.GRADE_11,
          GRADE_LEVEL.GRADE_12,
        ],
        commentsBased: false,
        scoringBased: true,
      },
      {
        orgId,
        code: 'CN',
        name: 'Công nghệ',
        canApply: false,
        type: CURRICULUM_SUBJECT_TYPE.ELECTIVE,
        departmentCodes: ['TLCN'],
        appliedGrades: [
          GRADE_LEVEL.GRADE_10,
          GRADE_LEVEL.GRADE_11,
          GRADE_LEVEL.GRADE_12,
        ],
        commentsBased: false,
        scoringBased: true,
      },
      {
        orgId,
        code: 'TH',
        name: 'Tin học',
        canApply: false,
        type: CURRICULUM_SUBJECT_TYPE.ELECTIVE,
        departmentCodes: ['TTT'],
        appliedGrades: [
          GRADE_LEVEL.GRADE_10,
          GRADE_LEVEL.GRADE_11,
          GRADE_LEVEL.GRADE_12,
        ],
        commentsBased: false,
        scoringBased: true,
      },
      {
        orgId,
        code: 'AN',
        name: 'Âm nhạc',
        canApply: false,
        type: CURRICULUM_SUBJECT_TYPE.ELECTIVE,
        departmentCodes: ['TDQPNT'],
        appliedGrades: [
          GRADE_LEVEL.GRADE_10,
          GRADE_LEVEL.GRADE_11,
          GRADE_LEVEL.GRADE_12,
        ],
        commentsBased: true,
        scoringBased: false,
      },
      {
        orgId,
        code: 'NT',
        name: 'Mĩ thuật',
        canApply: false,
        type: CURRICULUM_SUBJECT_TYPE.ELECTIVE,
        departmentCodes: ['TDQPNT'],
        appliedGrades: [
          GRADE_LEVEL.GRADE_10,
          GRADE_LEVEL.GRADE_11,
          GRADE_LEVEL.GRADE_12,
        ],
        commentsBased: true,
        scoringBased: false,
      },
      {
        orgId,
        code: 'HDTNHN',
        name: 'Hoạt động trải nghiệm, hướng nghiệp',
        canApply: false,
        type: CURRICULUM_SUBJECT_TYPE.COMPULSORY_EDUCATION_ACTIVITY,
        departmentCodes: ['TSDGD'],
        appliedGrades: [
          GRADE_LEVEL.GRADE_10,
          GRADE_LEVEL.GRADE_11,
          GRADE_LEVEL.GRADE_12,
        ],
        commentsBased: true,
        scoringBased: false,
      },
      {
        orgId,
        code: 'GDDP',
        name: 'Nội dung giáo dục của địa phương',
        canApply: false,
        type: CURRICULUM_SUBJECT_TYPE.LOCAL_EDUCATION_CONTENT,
        departmentCodes: ['TSDGD'],
        appliedGrades: [
          GRADE_LEVEL.GRADE_10,
          GRADE_LEVEL.GRADE_11,
          GRADE_LEVEL.GRADE_12,
        ],
        commentsBased: true,
        scoringBased: false,
      },
      {
        orgId,
        code: 'TDTTS',
        name: 'Tiếng dân tộc thiểu số',
        canApply: false,
        type: CURRICULUM_SUBJECT_TYPE.OPTIONAL,
        departmentCodes: ['TNV'],
        appliedGrades: [
          GRADE_LEVEL.GRADE_10,
          GRADE_LEVEL.GRADE_11,
          GRADE_LEVEL.GRADE_12,
        ],
        commentsBased: true,
        scoringBased: false,
      },
      {
        orgId,
        code: 'NN2',
        name: 'Ngoại ngữ 2',
        canApply: false,
        type: CURRICULUM_SUBJECT_TYPE.OPTIONAL,
        departmentCodes: ['TNN'],
        appliedGrades: [
          GRADE_LEVEL.GRADE_10,
          GRADE_LEVEL.GRADE_11,
          GRADE_LEVEL.GRADE_12,
        ],
        commentsBased: false,
        scoringBased: true,
        options: [
          { code: 'N1', name: 'Tiếng Anh' },
          { code: 'N2', name: 'Tiếng Nga' },
          { code: 'N3', name: 'Tiếng Pháp' },
          { code: 'N4', name: 'Tiếng Trung Quốc' },
          { code: 'N5', name: 'Tiếng Đức' },
          { code: 'N6', name: 'Tiếng Nhật' },
          { code: 'N7', name: 'Tiếng Hàn' },
        ],
      },
    ];

    const levelToSubjectsMap = {
      [SCHOOL_LEVEL.PRIMARY]: primarySubjects,
      [SCHOOL_LEVEL.LOWER_SECONDARY]: lowerSecondarySubjects,
      [SCHOOL_LEVEL.UPPER_SECONDARY]: higherSecondarySubjects,
    };

    const schoolBaseSubjects = Object.entries(levelToSubjectsMap)
      .filter(([level]) => schoolLevels.includes(level))
      .flatMap(([, subjects]) => subjects);

    return schoolBaseSubjects;
  }

  private getPriorityAdmins(
    admins: any,
    activeAdmins: any,
    inactiveAdmins: any,
  ) {
    if (admins.length === 0) {
      return { prioritizedAdmins: [] };
    }

    if (activeAdmins.length > 0) {
      return {
        prioritizedAdmins: activeAdmins,
      };
    }

    return {
      prioritizedAdmins: inactiveAdmins,
    };
  }

  private getSchoolGradeLevels(schoolLevels: string[]) {
    const levelToGradeLevelsMap = {
      [SCHOOL_LEVEL.PRESCHOOL]: [
        GRADE_LEVEL.NHA_TRE,
        GRADE_LEVEL.MAM,
        GRADE_LEVEL.CHOI,
        GRADE_LEVEL.LA,
      ],
      [SCHOOL_LEVEL.PRIMARY]: [
        GRADE_LEVEL.GRADE_1,
        GRADE_LEVEL.GRADE_2,
        GRADE_LEVEL.GRADE_3,
        GRADE_LEVEL.GRADE_4,
        GRADE_LEVEL.GRADE_5,
      ],
      [SCHOOL_LEVEL.LOWER_SECONDARY]: [
        GRADE_LEVEL.GRADE_6,
        GRADE_LEVEL.GRADE_7,
        GRADE_LEVEL.GRADE_8,
        GRADE_LEVEL.GRADE_9,
      ],
      [SCHOOL_LEVEL.UPPER_SECONDARY]: [
        GRADE_LEVEL.GRADE_10,
        GRADE_LEVEL.GRADE_11,
        GRADE_LEVEL.GRADE_12,
      ],
    };

    const gradeLevels = Object.entries(levelToGradeLevelsMap)
      .filter(([level]) => schoolLevels.includes(level))
      .flatMap(([, levels]) => levels);

    return gradeLevels;
  }

  private async createCurriculumGradeLevel(
    tx: Prisma.TransactionClient,
    orgId: number,
    curriculumId: number,
    schoolGradeLevels: GRADE_LEVEL[],
  ) {
    await tx.curriculumGradeLevel.createMany({
      data: schoolGradeLevels.map((gradeLevel: GRADE_LEVEL) => ({
        orgId,
        curriculumId,
        gradeLevel: gradeLevel,
      })),
    });
  }

  private getSchoolLevels(school: School): SCHOOL_LEVEL[] {
    const levels: SCHOOL_LEVEL[] = [];
    this.logger.debug('school', school);

    if (school.canPreschool) {
      levels.push(SCHOOL_LEVEL.PRESCHOOL);
    }
    if (school.canPrimarySchool) {
      levels.push(SCHOOL_LEVEL.PRIMARY);
    }
    if (school.canLowerSecondarySchool) {
      levels.push(SCHOOL_LEVEL.LOWER_SECONDARY);
    }
    if (school.canUpperSecondarySchool) {
      levels.push(SCHOOL_LEVEL.UPPER_SECONDARY);
    }

    return levels;
  }
}
