import { Injectable } from "@nestjs/common";
import { PrismaService } from "@gedu/prisma";
import { ORDER_ENUM } from "@gedu/shared";

@Injectable()
export class AdministrativeUnitRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getProvinces() {
    return this.prisma.provinces.findMany({
      orderBy: { title: ORDER_ENUM.ASC },
    });
  }

  async getDistricts(provinceId: number) {
    if (!provinceId || provinceId <= 0) {
      throw new Error('Invalid provinceId provided');
    }

    return this.prisma.districts.findMany({
      where: {
        provinceId: provinceId,
        isActive: true,
      },
      orderBy: { title: ORDER_ENUM.ASC },
    });
  }

  async getWards(districtId: number) {
    if (!districtId || districtId <= 0) {
      throw new Error('Invalid districtId provided');
    }

    return this.prisma.wards.findMany({
      where: {
        districtId: districtId,
        isActive: true,
      },
      orderBy: { title: ORDER_ENUM.ASC },
    });
  }

  async getNations() {
    return this.prisma.nations.findMany({
      orderBy: { title: ORDER_ENUM.ASC },
    });
  }

  async getReligions() {
    return this.prisma.religions.findMany({
      orderBy: { title: ORDER_ENUM.ASC },
    });
  }
} 