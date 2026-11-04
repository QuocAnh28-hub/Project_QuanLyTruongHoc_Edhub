import { Module } from "@nestjs/common";
import { AdministrativeUnitController } from "./controller/administrative-unit.controller";
import { AdministrativeUnitService } from "./service/administrative-unit.service";
import { AdministrativeUnitSoapService } from "./service/soap.service";
import { PrismaModule } from "@gedu/prisma";
import { RedisModule } from "@gedu/redis";
import { AdministrativeUnitRepository } from "./repositories/administrative-unit.repository";

@Module({
  imports: [
    PrismaModule,
    RedisModule,
  ],
  controllers: [
    AdministrativeUnitController
  ],
  providers: [
    AdministrativeUnitService,
    AdministrativeUnitSoapService,
    AdministrativeUnitRepository,
  ],
  exports: [AdministrativeUnitService],
})
export class AdministrativeUnitsModule { }
