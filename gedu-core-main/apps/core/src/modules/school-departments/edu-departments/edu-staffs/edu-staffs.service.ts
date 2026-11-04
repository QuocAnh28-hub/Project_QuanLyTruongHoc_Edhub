import { Prisma, PrismaService } from '@gedu/prisma';
import { ORDER_ENUM } from '@gedu/shared';
import { AppError, AppException } from '@gedu/shared/errors';
import { Injectable } from '@nestjs/common';
import { GetEduStaffDto } from './dto/edu-staffs.request.dto';

const personalFullSelect = {
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

    religionId: true,
    religion: { select: { title: true } },

    ethnicityId: true,
    ethnic: { select: { title: true } },

    nationalityId: true,
    nation: { select: { title: true } },

    originPlaceProvinceId: true,
    originPlaceProvince: { select: { title: true } },

    // originPlaceDistrictId: true,
    // originPlaceDistrict: { select: { title: true } },

    originPlaceWardId: true,
    originPlaceWard: { select: { title: true } },

    permanentResidenceProvinceId: true,
    permanentResidenceProvince: { select: { title: true } },

    // permanentResidenceDistrictId: true,
    // permanentResidenceDistrict: { select: { title: true } },

    permanentResidenceWardId: true,
    permanentResidenceWard: { select: { title: true } },

    permanentResidenceAddress: true,

    temporaryResidenceProvinceId: true,
    temporaryResidenceProvince: { select: { title: true } },

    // temporaryResidenceDistrictId: true,
    // temporaryResidenceDistrict: { select: { title: true } },

    temporaryResidenceWardId: true,
    temporaryResidenceWard: { select: { title: true } },

    temporaryResidenceAddress: true,
  },
};
@Injectable()
export class EduStaffService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(orgId: number, query: GetEduStaffDto) {
    const {
      page = 1,
      size = 100,
      q: keyword,
      dept,
      pos,
      order = ORDER_ENUM.DESC,
      orderBy = 'id',
    } = query;

    const filters: Prisma.EdStaffWhereInput = {
      orgId,
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
      this.prisma.edStaff.findMany({
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
            include: { positionTemplates: true },
          },
        },
        skip: (page - 1) * size,
        take: size,
      }),

      this.prisma.edStaff.count({
        where: filters,
      }),
    ]);

    const formattedStaff = await Promise.all(
      staffs.map(async (staff) => {
        const { user, department, ...rest } = staff;
        const { personal, ...userInfo } = user;

        let edPositions = null;
        if (staff.positionId) {
          edPositions = await this.prisma.edPositionTemplate.findMany({
            where: {
              departmentId: department?.id,
              id: staff.positionId,
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
          edPositions,
          edDepartment: {
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
    const staff = await this.prisma.edStaff.findUnique({
      where: {
        orgId,
        id,
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
        department: {
          select: {
            id: true,
            name: true,
            positionTemplates: true,
          },
        },
        status: true,
        isAdmin: true,
        user: {
          include: {
            personal: personalFullSelect,
          },
        },
      },
    });

    if (!staff) {
      throw new AppError(AppException.STAFF_NOT_FOUND);
    }

    const { user, department, ...rest } = staff;
    const { personal, ...userInfo } = user;

    let edPositions = null;
    if (staff.positionId) {
      edPositions = await this.prisma.edPositionTemplate.findMany({
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

      departmentId: staff.departmentId,
      departmentName: department?.name,
      departmentTitle: department?.name,
      positionId: staff.positionId,
      positionTitle: staff.position?.title,
      edPositions,
    };
  }
}
