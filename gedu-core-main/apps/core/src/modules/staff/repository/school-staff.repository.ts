import { AppError, AppException, STATUS } from '@gedu/shared';
import { Injectable, Logger } from '@nestjs/common';
import {
  PrismaService,
  User,
  prismaErrorTransform,
} from '@gedu/prisma';

import { CreateStaffDto } from '../dto/staff.request.dto';
import { UpdateClassesInfoDto } from '../../schools/classes/dto/classes.request.dto';

interface CreatedUser {
  user: User | null;
  code: string;
  id: number;
  error?: string;
}

@Injectable()
export class StaffRepository {
  private readonly logger = new Logger(StaffRepository.name);
  constructor(private readonly prisma: PrismaService) {}

  async createMany(
    orgId: number,
    requests: CreateStaffDto[],
  ): Promise<CreatedUser[]> {
    const createdUsers: CreatedUser[] = [];
    // return await this.prisma.$transaction(async (prisma) => {
    for (const request of requests) {
      try {
        await this.prisma.$transaction(async (prisma) => {
          const user = await prisma.user.create({
            data: {
              firstName: request.firstName,
              lastName: request.lastName,
              orgId,
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

                  // originPlaceDistrictId: request.originPlaceDistrictId,
                  originPlaceProvinceId: request.originPlaceProvinceId,
                  originPlaceWardId: request.originPlaceWardId,

                  // permanentResidenceDistrictId:
                  //   request.permanentResidenceDistrictId,
                  permanentResidenceProvinceId:
                    request.permanentResidenceProvinceId,
                  permanentResidenceWardId: request.permanentResidenceWardId,
                  permanentResidenceAddress: request.permanentResidenceAddress,

                  temporaryResidenceProvinceId:
                    request.temporaryResidenceProvinceId,
                  // temporaryResidenceDistrictId:
                  //   request.temporaryResidenceDistrictId,
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

          if (request.positionId) {
            await prisma.schoolStaffPositions.create({
              data: {
                orgId,
                positionId: request.positionId,
                staffId: user.id,
              },
            });
          }
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
          });
          createdUsers.push({ user, code: request.code, id: staff.id });
        });
      } catch (error) {
        const _error = prismaErrorTransform(error);
        this.logger.error(_error);
        createdUsers.push({
          user: null,
          code: request.code,
          id: 0,
          error: `${_error.field}: ${_error.reason}`,
        });
      }
    }
    return createdUsers;
  }

  async findStaffByCode(orgId: number, code: string) {
    return await this.prisma.schoolStaff.findFirst({
      where: {
        orgId,
        code,
      },
      include: {
        user: true,
      },
    });
  }

  async findStaffById(orgId: number, id: number) {
    return await this.prisma.schoolStaff.findFirst({
      where: {
        orgId,
        id,
      },
      include: {
        user: true,
      },
    });
  }

  async findHomeroomTeacherByStaffId(orgId: number, staffId: number) {
    return await this.prisma.schoolStaff.findFirst({
      where: {
        orgId,
        id: staffId,
        OR: [
          { position: { code: { in: ['GVCN', 'GVBM'] } } },
          { schoolStaffPositions: { some: { position: { code: { in: ['GVCN', 'GVBM'] } } } } },
        ],
      },
      include: {
        user: true,
      },
    });
  }

  async findStaffBasic(orgId: number, id: number) {
    return this.prisma.schoolStaff.findFirst({
      where: {
        orgId,
        id,
      },
      select: {
        id: true,
        orgId: true,
        userId: true,
        code: true,
        status: true,
        isAdmin: true,
        departmentId: true,
        positionId: true,
      },
    });
  }

  async updateClass(
    orgId: number,
    classId: number,
    updateClassesDto: UpdateClassesInfoDto,
  ) {
    const clazz = await this.prisma.class.findFirst({
      where: {
        id: classId,
        orgId,
      },
    });

    if (!clazz) {
      throw new AppError(AppException.CLASS_ID_INVALID);
    }

    return this.prisma.class.update({
      where: { id: classId, orgId },
      data: updateClassesDto,
    });
  }
}
