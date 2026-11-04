import { Injectable, OnModuleInit } from "@nestjs/common";
import {
  DistrictRequestDto,
  WardRequestDto,
} from "../dto/administrative-unit.request";
import { AdministrativeUnitSoapService } from "./soap.service";
import { AdministrativeUnitRepository } from "../repositories/administrative-unit.repository";
import { RedisService } from "@gedu/redis";

@Injectable()
export class AdministrativeUnitService {
  private readonly CACHE_TTL = 60 * 60; // 1 hour

  constructor(
    private readonly administrativeUnitRepository: AdministrativeUnitRepository,
    private readonly administrativeUnitSoapService: AdministrativeUnitSoapService,
    private readonly redisService: RedisService,
  ) {}

  async getWardsByProvinceId(provinceId: number) {
    try {
      const cached = await this.redisService.get(`ward:${provinceId}`);
      if (cached) {
        return cached;
      }
    } catch (error) {
      console.warn('Redis get failed, falling back to repository:', error);
    }
    const wards = await this.administrativeUnitRepository.getWards(provinceId);
    try {
      await this.redisService.set(`ward:${provinceId}`, wards, this.CACHE_TTL);
    } catch (error) {
      console.warn('Redis set failed:', error);
    }
    return wards;
  }

  async getProvinces() {
    return this.administrativeUnitRepository.getProvinces();
  }

  async getDistricts({ provinceId }: DistrictRequestDto) {
    return this.administrativeUnitRepository.getDistricts(provinceId);
  }

  async getWards({ districtId }: WardRequestDto) {
    return this.administrativeUnitRepository.getWards(districtId);
  }

  async getAdministrativeUnitByCode() {
    let result =
      await this.administrativeUnitSoapService.getSoapAdministrativeUnits(
        "ward"
      );

    return result;
  }
}
