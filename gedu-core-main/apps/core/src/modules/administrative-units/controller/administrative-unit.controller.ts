import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import {
  DistrictRequestDto,
  WardRequestDto,
} from "../dto/administrative-unit.request";
import { AdministrativeUnitService } from "../service/administrative-unit.service";
import { CacheTTL } from "@nestjs/cache-manager";
import { RedisInterceptor } from "@gedu/redis";

@Controller("administrative-units")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(RedisInterceptor)  
export class AdministrativeUnitController {
  constructor(
    private readonly administrativeUnitService: AdministrativeUnitService,
  ) {}

  @Get("/provinces")
  @HttpCode(HttpStatus.OK)
  @CacheTTL(60 * 10 * 1000)
  getProvinces() {
    return this.administrativeUnitService.getProvinces();
  }

  @Get("/districts")
  @HttpCode(HttpStatus.OK)
  @ApiQuery({
    name: "provinceId",
    required: true,
  })
  @CacheTTL(60 * 10 * 1000)
  getDistricts(@Query() request: DistrictRequestDto) {
    return this.administrativeUnitService.getDistricts(request);
  }

  @Get("/wards")
  @ApiQuery({
    name: "districtId",
    required: true,
  })
  @HttpCode(HttpStatus.OK)
  @CacheTTL(60 * 10 * 1000)
  getWards(@Query() request: WardRequestDto) {
    return this.administrativeUnitService.getWards(request);
  }

  @Get("/sync-administrative-units")
  @HttpCode(HttpStatus.OK)
  syncProvinces() {
    return this.administrativeUnitService.getAdministrativeUnitByCode();
  }
}
