import { AppError, AppException } from '@gedu/shared/errors';
import {
  CreateStaffDto,
  GetStaffDto,
  SyncStaffFoldersRequestDto,
  UpdateDepartmentDto,
  UpdateStaffDto,
} from './dto/staff.request.dto';
import {
  CreateStaffResponse,
  GetContractAndBenefitsResponse,
  GetSpecializationAndTeachingResponse,
} from './dto/staff.response.dto';
import { Folder, Prisma, PrismaService, SchoolStaff } from '@gedu/prisma';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { cryptString, generateSecurePassword } from '@gedu/shared/utils';

import { EmailService } from '@gedu/email';
import { ORDER_ENUM } from '@gedu/shared';
import { STATUS } from '@gedu/shared';
import { StaffRepository } from './repository/school-staff.repository';
import { plainToInstance } from 'class-transformer';

const personalFullSelect: Prisma.PersonalSelect = {
  sex: true,
  maritalStatus: true,
  firstName: true,
  lastName: true,
  citizenId: true,
  dateOfBirth: true,
  dateOfIssue: true,
  dateOfExpiry: true,
  placeOfIssue: true,
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
  pioneersUnionsParty: true,
};
@Injectable()
export class StaffService {
  private readonly logger = new Logger(StaffService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly schoolStaffRepository: StaffRepository,
    private readonly emailService: EmailService,
  ) {}

  async findAll(orgId: number, query: GetStaffDto) {
    const {
      page = 1,
      size = 100,
      q: keyword,
      dept,
      pos,
      order = ORDER_ENUM.DESC,
      orderBy = 'id',
    } = query;

    const isEd = orgId < 100000;
    const targetOrgId =
      isEd && (query as any).schoolId
        ? Number((query as any).schoolId)
        : isEd
        ? undefined
        : orgId;

    const filters: Prisma.SchoolStaffWhereInput = {
      ...(targetOrgId ? { orgId: targetOrgId } : {}),
    };

    if (keyword) {
      filters.OR = [
        {
          user: {
            firstName: { contains: keyword, mode: 'insensitive' },
          },
        },
        {
          user: {
            lastName: { contains: keyword, mode: 'insensitive' },
          },
        },
        {
          code: { contains: keyword, mode: 'insensitive' },
        },
      ];
    }

    if (dept?.length) {
      filters.departmentId = { in: dept };
    }

    if (pos?.length) {
      filters.positionId = { in: pos };
    }

    const [staffs, count] = await Promise.all([
      this.prisma.schoolStaff.findMany({
        where: filters,
        orderBy: [{ [orderBy]: order }, { id: 'desc' }],
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              personal: true,
            },
          },
          position: true,
          department: {
            include: { schoolPositionTemplates: true },
          },
        },
        skip: (page - 1) * size,
        take: size,
      }),

      this.prisma.schoolStaff.count({
        where: filters,
      }),
    ]);

    const formattedStaff = await Promise.all(
      staffs.map(async (staff) => {
        const { user, department, ...rest } = staff;
        const { personal, ...userInfo } = user;

        let schoolPositions = null;
        if (staff.positionId) {
          schoolPositions = await this.prisma.schoolStaffPositions.findMany({
            where: {
              staffId: staff.id,
            },
          });
        }

        return {
          ...userInfo,
          ...rest,
          id: staff.id,
          status: rest.status,
          departmentName: department?.name,
          positionTitle: staff.position?.title,
          schoolPositions,
          schoolDepartment: {
            id: department?.id,
            name: department?.name,
          },
          personal,
          lastName: user.lastName,
          userId: user.id,
        };
      }),
    );

    return [formattedStaff, count];
  }

  async getStaffById(orgId: number, id: number) {
    const isEd = orgId < 100000;
    const staff = await this.prisma.schoolStaff.findFirst({
      where: {
        id,
        ...(isEd ? {} : { orgId }),
      },
      select: {
        id: true,
        orgId: true,
        code: true,
        userId: true,
        departmentId: true,
        positionId: true,
        position: true,
        contactPhone: true,
        contactPhone2: true,
        schoolStaffUnionInfo: true,
        department: {
          select: {
            id: true,
            name: true,
            schoolPositionTemplates: true,
          },
        },
        status: true,
        isAdmin: true,
        user: {
          include: {
            personal: { select: personalFullSelect },
          },
        },
      },
    });

    if (!staff) {
      throw new AppError(AppException.STAFF_NOT_FOUND);
    }

    const { user, department, ...rest } = staff;
    const { personal, ...userInfo } = user;

    let schoolPositions = null;
    if (staff.positionId) {
      schoolPositions = await this.prisma.schoolPositionTemplates.findMany({
        where: {
          departmentId: department?.id,
          id: staff.positionId,
        },
      });
    }

    return {
      id: staff.id,
      status: rest.status,
      sex: personal?.sex,
      email: userInfo.email,
      phone: userInfo.phone,
      phone2: userInfo.phone2,
      contactPhone: staff.contactPhone,
      contactPhone2: staff.contactPhone2,
      avatar: userInfo.avatar,
      code: staff.code,
      firstName: personal?.firstName,
      lastName: personal?.lastName,
      citizenId: personal?.citizenId,
      dateOfBirth: personal?.dateOfBirth,
      dateOfIssue: personal?.dateOfIssue,
      dateOfExpiry: personal?.dateOfExpiry,
      placeOfIssue: personal?.placeOfIssue,
      maritalStatus: personal?.maritalStatus,
      religionId: personal?.religionId,
      ethnicityId: personal?.ethnicityId,
      nationalityId: personal?.nationalityId,
      permanentResidenceAddress: personal?.permanentResidenceAddress,
      temporaryResidenceAddress: personal?.temporaryResidenceAddress,
      religionTitle: personal?.religion?.title,
      ethnicityTitle: personal?.ethnic?.title,
      nationalityTitle: personal?.nation?.title,
      originPlaceProvinceId: personal?.originPlaceProvinceId,
      originPlaceWardId: personal?.originPlaceWardId,
      permanentResidenceProvinceId: personal?.permanentResidenceProvinceId,
      permanentResidenceWardId: personal?.permanentResidenceWardId,
      temporaryResidenceProvinceId: personal?.temporaryResidenceProvinceId,
      temporaryResidenceWardId: personal?.temporaryResidenceWardId,
      originPlaceProvinceTitle: personal?.originPlaceProvince?.title,
      originPlaceWardTitle: personal?.originPlaceWard?.title,
      permanentResidenceProvinceTitle:
        personal?.permanentResidenceProvince?.title,
      permanentResidenceWardTitle: personal?.permanentResidenceWard?.title,
      temporaryResidenceProvinceTitle:
        personal?.temporaryResidenceProvince?.title,
      temporaryResidenceWardTitle: personal?.temporaryResidenceWard?.title,
      departmentId: staff.departmentId,
      departmentName: department?.name,
      departmentTitle: department?.name,
      positionId: staff.positionId,
      positionTitle: staff.position?.title,
      schoolPositions,
      pioneersUnionsParty: personal?.pioneersUnionsParty,
      dateOfJoiningUnion: staff.schoolStaffUnionInfo?.dateOfJoiningUnion,
      dateOfJoiningParty: staff.schoolStaffUnionInfo?.dateOfJoiningParty,
      dateOfEnlistment: staff.schoolStaffUnionInfo?.dateOfEnlistment,
      dateOfDischarge: staff.schoolStaffUnionInfo?.dateOfDischarge,
    };
  }

  async getStaffAuthorities(orgId: number, staffId: number) {
    const staff = await this.prisma.schoolStaff.findFirst({
      where: {
        orgId,
        id: staffId,
      },
      select: {
        position: {
          select: {
            id: true,
            positionRoles: {
              select: {
                role_code: true,
              },
            },
          },
        },
        schoolStaffPositions: {
          select: {
            position: {
              select: {
                positionRoles: {
                  select: {
                    role_code: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!staff) {
      throw new AppError(AppException.STAFF_NOT_FOUND);
    }

    const primaryRoleCodes =
      staff.position?.positionRoles?.map((role) => role.role_code) ?? [];

    const secondaryRoleCodes =
      staff.schoolStaffPositions?.flatMap(
        (p) => p.position?.positionRoles?.map((r) => r.role_code) ?? [],
      ) ?? [];

    const roleCodes = Array.from(
      new Set([...primaryRoleCodes, ...secondaryRoleCodes]),
    );

    if (roleCodes.length === 0) {
      return [];
    }

    const permissions = await this.prisma.role_Permission.findMany({
      where: {
        role_code: {
          in: roleCodes,
        },
      },
      select: {
        id: true,
        role_code: true,
        permission_code: true,
        permission: {
          select: {
            title: true,
          },
        },
      },
    });

    const seen = new Set<string>();
    const result: Array<{
      id: number;
      roleCode: string;
      permissionCode: string;
      permissionTitle: string;
    }> = [];

    for (const item of permissions) {
      const key = `${item.role_code}|${item.permission_code}`;
      if (seen.has(key)) continue;
      seen.add(key);
      result.push({
        id: item.id,
        roleCode: item.role_code,
        permissionCode: item.permission_code,
        permissionTitle: item.permission.title,
      });
    }
    return result;
  }

  async getStaffFolders(orgId: number, id: number) {
    const existingStaff = await this.prisma.schoolStaff.findUnique({
      where: {
        orgId,
        id,
      },
      select: {
        userId: true,
      },
    });

    if (!existingStaff) {
      throw new AppError(AppException.STAFF_NOT_FOUND);
    }

    return this.prisma.folder.findMany({
      where: {
        orgId,
        userId: existingStaff.userId,
      },
      select: {
        id: true,
        orgId: true,
        userId: true,
        folderName: true,
        issuingAuthority: true,
        dateOfIssue: true,
        recordNumber: true,
        type: true,
        files: {
          select: {
            id: true,
            orgId: true,
            userId: true,
            folderId: true,
            name: true,
            link: true,
            type: true,
          },
        },
      },
    });
  }

  async syncFolderWithFiles(
    performUserOrgId: number,
    performUserId: number,
    staffId: number,
    dto: SyncStaffFoldersRequestDto,
  ) {
    if (!dto.id && dto.isDeleted) {
      throw new AppError(AppException.INVALID_PAYLOAD);
    }

    const targetStaff = await this.prisma.schoolStaff.findUnique({
      where: {
        orgId: performUserOrgId,
        id: staffId,
      },
      select: {
        userId: true,
        orgId: true,
      },
    });

    if (!targetStaff) {
      throw new AppError(AppException.STAFF_NOT_FOUND);
    }

    return await this.prisma.$transaction(async (tx) => {
      let folder: Folder | null = null;

      if (dto.id) {
        folder = await tx.folder.findUnique({ where: { id: dto.id } });
        if (
          !folder ||
          folder.orgId !== targetStaff.orgId ||
          folder.userId !== targetStaff.userId
        ) {
          throw new AppError(AppException.FOLDER_NOT_FOUND_OR_FORBIDDEN);
        }

        if (dto.isDeleted) {
          await tx.file.deleteMany({
            where: { folderId: folder.id, userId: targetStaff.userId },
          });
          await tx.folder.delete({ where: { id: folder.id } });
          return true;
        }
      }

      if (folder) {
        folder = await tx.folder.update({
          where: { id: folder.id },
          data: {
            folderName: dto.folderName,
            issuingAuthority: dto.issuingAuthority,
            dateOfIssue: dto.dateOfIssue ? new Date(dto.dateOfIssue) : null,
            recordNumber: dto.recordNumber,
            type: dto.type,
            updatedAt: new Date(),
            updatedBy: performUserId,
          },
        });
      } else {
        folder = await tx.folder.create({
          data: {
            orgId: targetStaff.orgId,
            userId: targetStaff.userId,
            folderName: dto.folderName,
            issuingAuthority: dto.issuingAuthority,
            dateOfIssue: dto.dateOfIssue ? new Date(dto.dateOfIssue) : null,
            recordNumber: dto.recordNumber,
            type: dto.type ?? 1,
            createdBy: performUserId,
            updatedBy: performUserId,
          },
        });
      }

      const filesToDelete =
        dto.files?.filter((f) => f.isDeleted && f.id).map((f) => f.id) ?? [];
      if (filesToDelete.length) {
        await tx.file.deleteMany({
          where: {
            id: { in: filesToDelete as number[] },
            folderId: folder.id,
            userId: targetStaff.userId,
          },
        });
      }

      const filesToProcess = dto.files?.filter((f) => !f.isDeleted) ?? [];
      for (const fileDto of filesToProcess) {
        if (fileDto.id) {
          const existing = await tx.file.findUnique({
            where: { id: fileDto.id },
          });
          if (!existing || existing.folderId !== folder.id) {
            throw new AppError(AppException.FILE_NOT_FOUND_OR_FORBIDDEN);
          }
          await tx.file.update({
            where: { id: fileDto.id },
            data: {
              name: fileDto.name,
              link: fileDto.link,
              type: fileDto.type,
              updatedAt: new Date(),
              updatedBy: performUserId,
            },
          });
        } else {
          await tx.file.create({
            data: {
              orgId: targetStaff.orgId,
              userId: targetStaff.userId,
              folderId: folder.id,
              name: fileDto.name,
              link: fileDto.link,
              type: fileDto.type ?? 1,
              createdBy: performUserId,
              updatedBy: performUserId,
            },
          });
        }
      }

      return true;
    });
  }

  async create(orgId: number, request: CreateStaffDto) {
    const { id: staffId, code, email, citizenId, phone } = request;

    let existingStaff: SchoolStaff | null = null;
    if (staffId) {
      existingStaff = await this.schoolStaffRepository.findStaffById(
        orgId,
        staffId,
      );
      if (!existingStaff) {
        throw new AppError(AppException.STAFF_NOT_FOUND);
      }
    }

    const codeInput = code ?? undefined;
    const emailInput = email ?? undefined;
    const citizenIdInput = citizenId ?? undefined;
    const phoneInput = phone ?? undefined;

    let staffByCodeOrEmail: {
      id: number;
      code?: string | null;
      user?: { email?: string | null };
    } | null = null;
    if (codeInput || emailInput) {
      const orConditions = [];
      if (codeInput) orConditions.push({ code: codeInput });
      if (emailInput) orConditions.push({ user: { email: emailInput } });

      staffByCodeOrEmail = await this.prisma.schoolStaff.findFirst({
        where: { orgId, OR: orConditions },
        select: { id: true, code: true, user: { select: { email: true } } },
      });

      if (staffByCodeOrEmail) {
        if (codeInput && (!staffId || staffByCodeOrEmail.id !== staffId)) {
          throw new AppError(AppException.STAFF_CODE_DUPLICATED);
        }

        if (emailInput && (!staffId || staffByCodeOrEmail.id !== staffId)) {
          throw new AppError(AppException.EMAIL_EXISTED);
        }
      }
    }

    if (emailInput) {
      const accountByEmail = await this.prisma.account.findFirst({
        where: { orgId, userName: emailInput },
        select: { user: { select: { schoolStaff: { select: { id: true } } } } },
      });

      if (
        accountByEmail &&
        (!staffId || accountByEmail.user?.schoolStaff?.id !== staffId)
      ) {
        throw new AppError(AppException.ACCOUNT_EXISTED);
      }
    }

    if (citizenIdInput) {
      const userByCitizenId = await this.prisma.user.findFirst({
        where: { orgId, personal: { citizenId: citizenIdInput } },
        select: { schoolStaff: { select: { id: true } } },
      });

      if (
        userByCitizenId &&
        (!staffId || userByCitizenId.schoolStaff?.id !== staffId)
      ) {
        throw new AppError(AppException.CITIZEN_ID_EXISTED);
      }
    }

    if (phoneInput) {
      const userByPhone = await this.prisma.user.findFirst({
        where: { orgId, phone: phoneInput },
        select: { schoolStaff: { select: { id: true } } },
      });

      if (
        userByPhone &&
        (!staffId || userByPhone.schoolStaff?.id !== staffId)
      ) {
        throw new AppError(AppException.PHONE_DUPLICATED);
      }
    }

    if (existingStaff) {
      try {
        const result = await this.prisma.$transaction(async (prisma) => {
          await prisma.schoolStaff.update({
            where: { orgId, id: staffId },
            data: {
              code: request.code,
              contactPhone: request.contactPhone,
              contactPhone2: request.contactPhone2,
              isAdmin: request.isAdmin ?? undefined,
            },
          });

          await prisma.user.update({
            where: { id: existingStaff.userId, orgId },
            data: {
              orgId,
              firstName: request.firstName,
              lastName: request.lastName,
              avatar: request.avatar,
              phone: request.phone,
              phone2: request.phone2,
              email: request.email,
              personal: {
                update: {
                  citizenId: request.citizenId,
                  firstName: request.firstName,
                  lastName: request.lastName,
                  sex: request.sex,
                  dateOfBirth: request.dateOfBirth,
                  dateOfExpiry: request.dateOfExpiry,
                  placeOfIssue: request.placeOfIssue,
                  originPlaceProvinceId: request.originPlaceProvinceId,
                  originPlaceWardId: request.originPlaceWardId,
                  permanentResidenceProvinceId:
                    request.permanentResidenceProvinceId,
                  permanentResidenceWardId: request.permanentResidenceWardId,
                  permanentResidenceAddress: request.permanentResidenceAddress,
                  temporaryResidenceProvinceId:
                    request.temporaryResidenceProvinceId,
                  temporaryResidenceWardId: request.temporaryResidenceWardId,
                  dateOfIssue: request.dateOfIssue,
                  maritalStatus: request.maritalStatus,
                  nationalityId: request.nationalityId,
                  ethnicityId: request.ethnicityId,
                  religionId: request.religionId,
                },
              },
            },
          });

          await prisma.account.upsert({
            where: { userId: existingStaff.userId },
            create: {
              orgId,
              userName: request.email,
              password: null,
              roles: 'STAFF',
              userId: existingStaff.userId,
            },
            update: {
              userName: request.email,
            },
          });

          const staff = await prisma.schoolStaff.findUnique({
            where: { orgId, id: staffId },
            include: {
              user: {
                include: {
                  personal: true,
                },
              },
            },
          });

          return plainToInstance(CreateStaffResponse, {
            id: staff?.id,
            code: staff?.code,
            userId: staff?.user.id,
            firstName: staff?.user.firstName,
            lastName: staff?.user.lastName,
            sex: staff?.user.personal?.sex,
            avatar: staff?.user.avatar,
            nationalityId: staff?.user.personal?.nationalityId,
            ethnicityId: staff?.user.personal?.ethnicityId,
            religionId: staff?.user.personal?.religionId,
            maritalStatus: staff?.user.personal?.maritalStatus,
            email: staff?.user.email,
            citizenId: staff?.user?.personal?.citizenId,
            positionId: staff?.positionId,
            departmentId: staff?.departmentId,
            contactPhone: staff?.contactPhone,
            contactPhone2: staff?.contactPhone2,
            status: staff?.status,
            placeOfIssue: staff?.user?.personal?.placeOfIssue,
            dateOfBirth: staff?.user?.personal?.dateOfBirth,
            dateOfExpiry: staff?.user?.personal?.dateOfExpiry,
            dateOfIssue: staff?.user?.personal?.dateOfIssue,
            phone: staff?.user?.phone,
            permanentResidenceProvinceId:
              staff?.user?.personal?.permanentResidenceProvinceId,
            permanentResidenceWardId:
              staff?.user?.personal?.permanentResidenceWardId,
            permanentResidenceAddress:
              staff?.user?.personal?.permanentResidenceAddress,
            temporaryResidenceProvinceId:
              staff?.user?.personal?.temporaryResidenceProvinceId,
            temporaryResidenceWardId:
              staff?.user?.personal?.temporaryResidenceWardId,
            temporaryResidenceAddress:
              staff?.user?.personal?.temporaryResidenceAddress,
          });
        });
        return result;
      } catch (error) {
        this.logger.error(error);
        throw error;
      }
    }
    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        const user = await prisma.user.create({
          data: {
            orgId,
            firstName: request.firstName,
            lastName: request.lastName,
            avatar: request.avatar,
            phone: request.phone,
            phone2: request.phone2,
            email: request.email,

            personal: {
              create: {
                citizenId: request.citizenId,
                firstName: request.firstName,
                lastName: request.lastName,
                sex: request.sex,
                dateOfBirth: request.dateOfBirth,
                dateOfExpiry: request.dateOfExpiry,
                placeOfIssue: request.placeOfIssue,
                originPlaceProvinceId: request.originPlaceProvinceId,
                originPlaceWardId: request.originPlaceWardId,
                permanentResidenceProvinceId:
                  request.permanentResidenceProvinceId,
                permanentResidenceWardId: request.permanentResidenceWardId,
                permanentResidenceAddress: request.permanentResidenceAddress,
                temporaryResidenceProvinceId:
                  request.temporaryResidenceProvinceId,
                temporaryResidenceWardId: request.temporaryResidenceWardId,
                dateOfIssue: request.dateOfIssue,
                maritalStatus: request.maritalStatus,
                nationalityId: request.nationalityId,
                ethnicityId: request.ethnicityId,
                religionId: request.religionId,
              },
            },
          },
        });

        await prisma.account.create({
          data: {
            orgId,
            userName: request.email,
            password: null,
            roles: 'STAFF',
            userId: user.id,
          },
        });

        const staff = await prisma.schoolStaff.create({
          data: {
            orgId,
            userId: user.id,
            code: request.code,
            positionId: request.positionId,
            departmentId: request.departmentId,
            contactPhone: request.contactPhone,
            contactPhone2: request.contactPhone2,
            isAdmin: false,
            status: STATUS.CREATED,
          },
          include: {
            user: {
              include: {
                personal: true,
              },
            },
          },
        });

        return plainToInstance(CreateStaffResponse, {
          id: staff?.id,
          code: staff?.code,
          userId: staff?.user.id,
          firstName: staff?.user.firstName,
          lastName: staff?.user.lastName,
          sex: staff?.user.personal?.sex,
          avatar: staff?.user.avatar,
          nationalityId: staff?.user.personal?.nationalityId,
          ethnicityId: staff?.user.personal?.ethnicityId,
          religionId: staff?.user.personal?.religionId,
          maritalStatus: staff?.user.personal?.maritalStatus,
          email: staff?.user.email,
          citizenId: staff?.user?.personal?.citizenId,
          positionId: staff?.positionId,
          departmentId: staff?.departmentId,
          contactPhone: staff?.contactPhone,
          contactPhone2: staff?.contactPhone2,
          status: staff?.status,
          placeOfIssue: staff?.user?.personal?.placeOfIssue,
          dateOfBirth: staff?.user?.personal?.dateOfBirth,
          dateOfExpiry: staff?.user?.personal?.dateOfExpiry,
          dateOfIssue: staff?.user?.personal?.dateOfIssue,
          phone: staff?.user?.phone,
          permanentResidenceProvinceId:
            staff?.user?.personal?.permanentResidenceProvinceId,
          permanentResidenceWardId:
            staff?.user?.personal?.permanentResidenceWardId,
          permanentResidenceAddress:
            staff?.user?.personal?.permanentResidenceAddress,
          temporaryResidenceProvinceId:
            staff?.user?.personal?.temporaryResidenceProvinceId,
          temporaryResidenceWardId:
            staff?.user?.personal?.temporaryResidenceWardId,
          temporaryResidenceAddress:
            staff?.user?.personal?.temporaryResidenceAddress,
        });
      });
      return result;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async updateStaff(staffId: number, orgId: number, input: UpdateStaffDto) {
    const existingStaff = await this.schoolStaffRepository.findStaffById(
      orgId,
      staffId,
    );

    if (!existingStaff) {
      throw new AppError(AppException.STAFF_NOT_FOUND);
    }

    const personalData = this.buildPersonalData(input);
    const userData = this.buildUserData(input);
    const accountData = this.buildAccountData(input);
    const schoolStaffData = this.buildSchoolStaffData(input);
    const schoolStaffPositionsData = this.buildSchoolStaffPositionData(input);
    const staffUnionAndPartyData = this.buildStaffUnionAndPartyData(input);
    return await this.prisma.$transaction(async (prisma) => {
      const updatedUser = await prisma.user.update({
        where: { id: existingStaff.userId, orgId },
        data: userData,
      });

      const updatedPersonal = await prisma.personal.upsert({
        where: { id: updatedUser.personalId ?? 0 },
        update: personalData,
        create: {
          ...personalData,
          firstName: input.firstName || '',
          lastName: input.lastName || '',
          users: {
            connect: {
              id: updatedUser.id,
            },
          },
        },
        select: personalFullSelect,
      });

      await prisma.account.upsert({
        where: { userId: existingStaff.userId },
        update: accountData,
        create: {
          userId: existingStaff.userId,
          orgId,
          userName: accountData.userName || '',
          roles: 'STAFF',
        },
      });

      const updatedSchoolStaff = await prisma.schoolStaff.update({
        where: { id: existingStaff.id, orgId },
        data: schoolStaffData,
      });
      await prisma.schoolStaffPositions.updateMany({
        where: { staffId: existingStaff.id, orgId },
        data: schoolStaffPositionsData,
      });

      const updatedPositions = await prisma.schoolStaffPositions.findMany({
        where: { staffId: existingStaff.id, orgId },
        include: {
          position: {
            include: {
              department: true,
            },
          },
        },
      });
      const mappedPositions = updatedPositions.map((item) => ({
        id: item.position?.id,
        title: item.position?.title,
        staffId: item.staffId,
        departmentId: item.position?.departmentId,
        departmentTitle: item.position?.department?.name,
        departmentDesc: item.position?.department?.desc,
        desc: item.position?.desc,
        level: item.position?.level,
        isDedicated: item.isDedicated,
        canConcurrent: item.position?.canConcurrent,
        isActive: item.position?.isActive,
      }));

      const updatedStaffUnionAndParty =
        await prisma.schoolStaffUnionInfo.upsert({
          where: { staffId: existingStaff.id },
          update: staffUnionAndPartyData,
          create: {
            ...staffUnionAndPartyData,
            staffId: existingStaff.id,
            orgId,
          },
        });

      return {
        id: updatedSchoolStaff.id,
        status: updatedSchoolStaff.status,
        sex: updatedPersonal?.sex,
        email: updatedUser.email,
        phone: updatedUser.phone,
        phone2: updatedUser.phone2,
        avatar: updatedUser.avatar,
        code: updatedSchoolStaff.code,
        firstName: updatedPersonal?.firstName,
        lastName: updatedPersonal?.lastName,
        citizenId: updatedPersonal?.citizenId,
        dateOfBirth: updatedPersonal?.dateOfBirth,
        dateOfIssue: updatedPersonal?.dateOfIssue,
        dateOfExpiry: updatedPersonal?.dateOfExpiry,
        placeOfIssue: updatedPersonal?.placeOfIssue,
        maritalStatus: updatedPersonal?.maritalStatus,
        religionId: updatedPersonal?.religionId,
        ethnicityId: updatedPersonal?.ethnicityId,
        nationalityId: updatedPersonal?.nationalityId,
        permanentResidenceAddress: updatedPersonal?.permanentResidenceAddress,
        temporaryResidenceAddress: updatedPersonal?.temporaryResidenceAddress,
        religionTitle: updatedPersonal?.religion?.title,
        ethnicityTitle: updatedPersonal?.ethnic?.title,
        nationalityTitle: updatedPersonal?.nation?.title,
        originPlaceProvinceId: updatedPersonal?.originPlaceProvinceId,
        originPlaceWardId: updatedPersonal?.originPlaceWardId,
        permanentResidenceProvinceId:
          updatedPersonal?.permanentResidenceProvinceId,
        permanentResidenceWardId: updatedPersonal?.permanentResidenceWardId,
        temporaryResidenceProvinceId:
          updatedPersonal?.temporaryResidenceProvinceId,
        temporaryResidenceWardId: updatedPersonal?.temporaryResidenceWardId,
        originPlaceProvinceTitle: updatedPersonal?.originPlaceProvince?.title,
        originPlaceWardTitle: updatedPersonal?.originPlaceWard?.title,
        permanentResidenceProvinceTitle:
          updatedPersonal?.permanentResidenceProvince?.title,
        permanentResidenceWardTitle:
          updatedPersonal?.permanentResidenceWard?.title,
        temporaryResidenceProvinceTitle:
          updatedPersonal?.temporaryResidenceProvince?.title,
        temporaryResidenceWardTitle:
          updatedPersonal?.temporaryResidenceWard?.title,
        departmentId: mappedPositions.find(
          (item) => item.id === updatedSchoolStaff.positionId,
        )?.departmentId,
        departmentName: mappedPositions.find(
          (item) => item.id === updatedSchoolStaff.positionId,
        )?.departmentTitle,
        departmentTitle: mappedPositions.find(
          (item) => item.id === updatedSchoolStaff.positionId,
        )?.departmentTitle,
        positionId: updatedSchoolStaff.positionId,
        positionName: mappedPositions.find(
          (item) => item.id === updatedSchoolStaff.positionId,
        )?.title,
        schoolPositions: mappedPositions,
        dateOfJoiningUnion: updatedStaffUnionAndParty.dateOfJoiningUnion,
        dateOfJoiningParty: updatedStaffUnionAndParty.dateOfJoiningParty,
        dateOfEnlistment: updatedStaffUnionAndParty.dateOfEnlistment,
        dateOfDischarge: updatedStaffUnionAndParty.dateOfDischarge,
      };
    });
  }

  async activeStaff(orgId: number, userIds: number[]) {
    const DEFAULT_SCHOOL_NAME = 'Trường chưa đặt tên';
    const staffs = await this.prisma.schoolStaff.findMany({
      where: {
        orgId,
        OR: [{ userId: { in: userIds } }, { id: { in: userIds } }],
        status: STATUS.CREATED,
      },
      include: {
        user: {
          include: { account: true },
        },
        school: {
          select: { name: true },
        },
      },
    });

    const passwordMap = new Map<number, string>();

    const updates = [];
    for (const staff of staffs) {
      if (!staff.user.account) {
        this.logger.warn(
          `Account not found for userId ${staff.userId}, skipping.`,
        );
        continue;
      }

      const password = generateSecurePassword();
      const hashedPassword = await cryptString(password);
      passwordMap.set(staff.userId, password);

      updates.push({
        userId: staff.userId,
        hashedPassword,
        staffId: staff.id,
        schoolName: staff.school?.name ?? DEFAULT_SCHOOL_NAME,
        staffName: `${staff.user.firstName} ${staff.user.lastName}`,
        email: staff.user.email,
        username: staff.user.account.userName,
      });
    }

    await this.prisma.$transaction(
      updates.flatMap(({ userId, hashedPassword, staffId }) => [
        this.prisma.account.update({
          where: { userId },
          data: { password: hashedPassword },
        }),
        this.prisma.schoolStaff.update({
          where: { id: staffId },
          data: { status: STATUS.ACTIVE },
        }),
      ]),
    );

    (async () => {
      for (const info of updates) {
        if (info.email && info.username && info.staffName && info.schoolName) {
          await this.emailService.sendStaffAccountEmail(info.email, {
            schoolName: info.schoolName,
            staffName: info.staffName,
            email: info.username,
            password: passwordMap.get(info.userId)!,
          });
        }
      }
    })();

    return {
      message: 'Staffs activated and emails are being sent in background',
      totalActivated: updates.length,
    };
  }

  async assignDepartmentAndPosition(
    orgId: number,
    id: number,
    request: UpdateDepartmentDto,
  ) {
    const existingStaff = await this.prisma.schoolStaff.findUnique({
      where: { orgId, id },
      include: { schoolStaffPositions: true },
    });

    if (!existingStaff) {
      throw new AppError(AppException.STAFF_NOT_FOUND);
    }

    const updatedStaff = await this.prisma.$transaction(async (tx) => {
      await tx.schoolStaffPositions.deleteMany({
        where: { staffId: id, orgId },
      });

      await tx.schoolStaff.update({
        where: { orgId, id },
        data: {
          positionId: request.positionId,
          departmentId: request.departmentId,
        },
      });

      const allPositionIds: number[] = [];

      if (request.positionId) {
        allPositionIds.push(request.positionId);
      }
      if (request.schoolStaffPositions?.length) {
        allPositionIds.push(...request.schoolStaffPositions);
      }

      if (allPositionIds.length > 0) {
        await tx.schoolStaffPositions.createMany({
          data: allPositionIds.map((positionId) => ({
            orgId,
            staffId: id,
            positionId,
          })),
        });

        const positionRoles = await tx.position_Role.findMany({
          where: { position_id: { in: allPositionIds } },
          select: { role_code: true },
        });

        if (positionRoles.length > 0) {
          const roleCodes = positionRoles.map((role) => role.role_code);

          const rolePermissions = await tx.role_Permission.findMany({
            where: { role_code: { in: roleCodes } },
            select: { permission_code: true },
          });

          if (rolePermissions.length > 0) {
            await tx.account.update({
              where: { userId: existingStaff.userId },
              data: {
                roles: rolePermissions
                  .map((rp) => rp.permission_code)
                  .join(','),
              },
            });
          }
        }
      }

      return await tx.schoolStaff.findUnique({
        where: { orgId, id },
        include: {
          schoolStaffPositions: {
            include: {
              position: {
                select: {
                  id: true,
                  title: true,
                  desc: true,
                  departmentId: true,
                },
              },
            },
          },
        },
      });
    });

    return {
      positionId: updatedStaff?.positionId,
      departmentId: updatedStaff?.departmentId,
      schoolStaffPositions:
        updatedStaff?.schoolStaffPositions.map((pos) => ({
          positionId: pos.position?.id,
          title: pos.position?.title,
          desc: pos.position?.desc,
          departmentId: pos.position?.departmentId,
        })) || [],
    };
  }

  async getSpecializationAndTeaching(orgId: number, id: number) {
    const staff = await this.prisma.schoolStaff.findUnique({
      where: { orgId, id },
      select: {
        position: true,
        department: true,
        code: true,
        schoolStaffPositions: {
          select: {
            position: true,
          }
        },
        user: {
          select: {
            personal: {
              select: {
                qualificationCompetence: true,
                trainingDevelopmentHistories: true,
                pioneersUnionsParty: true,
                personalAchievements: true,
                personalWorkHistories: true,
              },
            },
          },
        },
      },
    });

    if (!staff) {
      throw new AppError(AppException.STAFF_NOT_FOUND);
    }

    return plainToInstance(GetSpecializationAndTeachingResponse, staff);
  }

  async getContractAndBenefits(
    orgId: number,
    id: number,
  ): Promise<GetContractAndBenefitsResponse> {
    const staff = await this.prisma.schoolStaff.findUnique({
      where: {
        orgId,
        id,
      },
      select: {
        user: {
          select: {
            personal: {
              select: {
                personalInsuranceFinance: true,
              },
            },
          },
        },
        schoolStaffsAllowance: true,
        schoolStaffWorkContracts: true,
        schoolStaffSalaries: true,
      },
    });

    if (!staff) {
      throw new AppError(AppException.STAFF_NOT_FOUND);
    }
    // return staff
    return {
      personalInsuranceFinance:
        staff.user.personal?.personalInsuranceFinance || null,
      schoolStaffsAllowance: staff.schoolStaffsAllowance,
      schoolStaffWorkContracts: staff.schoolStaffWorkContracts,
      schoolStaffSalaries: staff.schoolStaffSalaries,
    };
  }

  private buildPersonalData(request: UpdateStaffDto) {
    const data = {
      citizenId: request.citizenId,
      firstName: request.firstName || '',
      lastName: request.lastName || '',
      sex: request.sex,
      dateOfBirth: request.dateOfBirth,
      dateOfIssue: request.dateOfIssue,
      dateOfExpiry: request.dateOfExpiry,
      placeOfIssue: request.placeOfIssue,
      originPlaceProvinceId: request.originPlaceProvinceId,
      originPlaceWardId: request.originPlaceWardId,
      permanentResidenceProvinceId: request.permanentResidenceProvinceId,
      permanentResidenceWardId: request.permanentResidenceWardId,
      permanentResidenceAddress: request.permanentResidenceAddress,
      temporaryResidenceProvinceId: request.temporaryResidenceProvinceId,
      temporaryResidenceWardId: request.temporaryResidenceWardId,
      temporaryResidenceAddress: request.temporaryResidenceAddress,
      maritalStatus: request.maritalStatus,
      nationalityId: request.nationalityId,
      ethnicityId: request.ethnicityId,
      religionId: request.religionId,
    };

    return Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined),
    );
  }

  private buildUserData(input: UpdateStaffDto) {
    const data = {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      avatar: input.avatar,
      phone: input.phone,
      phone2: input.phone2,
    };

    return Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined),
    );
  }

  private buildAccountData(input: UpdateStaffDto) {
    const data = {
      userName: input.email,
    };

    return Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined),
    );
  }

  private buildSchoolStaffData(input: UpdateStaffDto) {
    const data = {
      code: input.code,
      positionId: input.positionId,
      departmentId: input.departmentId,
      contactPhone: input.contactPhone,
      contactPhone2: input.contactPhone2,
      isAdmin: input.isAdmin,
    };

    return Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined),
    );
  }

  private buildSchoolStaffPositionData(input: UpdateStaffDto) {
    const data = {
      positionId: input.positionId,
    };

    return Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined),
    );
  }

  private buildStaffUnionAndPartyData(input: UpdateStaffDto) {
    const data = {
      dateOfJoiningUnion: input.dateOfJoiningUnion
        ? new Date(input.dateOfJoiningUnion)
        : undefined,
      dateOfJoiningParty: input.dateOfJoiningParty
        ? new Date(input.dateOfJoiningParty)
        : undefined,
      dateOfEnlistment: input.dateOfEnlistment
        ? new Date(input.dateOfEnlistment)
        : undefined,
      dateOfDischarge: input.dateOfDischarge
        ? new Date(input.dateOfDischarge)
        : undefined,
    };

    return Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined),
    );
  }
}
