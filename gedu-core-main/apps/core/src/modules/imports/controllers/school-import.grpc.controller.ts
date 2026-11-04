import { Controller, Inject, Logger } from "@nestjs/common";
import {
  ImportSchoolsRequest,
  ImportSchoolsResponse,
  SchoolImportResult,
} from "@gedu/transport";

import { CreateAdminDto } from "../../schools/dto/create-admin.dto";
import { CreateSchoolDto } from "../../schools/dto/create-schools.dto";
import { GrpcMethod } from "@nestjs/microservices";
import { SchoolsService } from "../../schools/schools.service";
import { prismaErrorTransform } from "@gedu/prisma";
import { SharesService } from "../../shares/shares.service";
import { PROVINCE_CONFIG_KEY, ProvinceConfig } from "@gedu/config";

@Controller("schools.grpc")
export class SchoolImportGrpcController {
  private readonly logger = new Logger(SchoolImportGrpcController.name);

  constructor(
    private readonly schoolsService: SchoolsService,
    private readonly sharesService: SharesService,
    @Inject(PROVINCE_CONFIG_KEY)
    private readonly provinceConfig: ProvinceConfig
  ) {}

  @GrpcMethod("SchoolImportService", "ImportSchools")
  async importSchools(
    request: ImportSchoolsRequest
  ): Promise<ImportSchoolsResponse> {
    try {
      // Step 1: Transform all school data and prepare arrays
      const schoolDtos: CreateSchoolDto[] = [];
      const adminDtos: { schoolCode: string; admin: CreateAdminDto }[] = [];

      const provinceId = this.provinceConfig.id;
      if (!provinceId || provinceId <= 0) {
        throw new Error('Invalid province ID in configuration');
      }
      
      for (const data of request.schools) {
        // Find ward by name with format lowercase and remove diacritics and replace space with -
        let _ward: number | undefined = undefined;
        if (data.ward) {
          _ward = this.sharesService.findWardIdByName(provinceId, data.ward);
        }
        
        const createSchoolDto: Partial<CreateSchoolDto> = {
          code: data.code,
          name: data.name,
          type: data.type,
          address: data.address,
          dailyScheduleType: data.dailyScheduleType,
          email: data.email,
          website: data.website,
          hotline: data.hotline,
          provinceId: provinceId,
          wardId: _ward,
          principalFirstName: data.principalFirstName,
          principalLastName: data.principalLastName,
          principalPhone: data.principalPhone,
          canPreschool: data.canPreschool,
          canPrimarySchool: data.canPrimarySchool,
          canLowerSecondarySchool: data.canLowerSecondarySchool,
          canUpperSecondarySchool: data.canUpperSecondarySchool,
          isInternationalSchool: data.isInternationalSchool,
        };

        schoolDtos.push(createSchoolDto as CreateSchoolDto);

        if (data.admin) {
          adminDtos.push({
            schoolCode: data.code,
            admin: {
              firstName: data.admin.firstName,
              lastName: data.admin.lastName,
              phone: data.admin.phone,
              email: data.admin.email,
            },
          });
        }
      }

      // Step 2: Batch create schools
      const createdSchools = await this.schoolsService.createSchools(
        schoolDtos,
        request.createdBy
      );

      // Step 3: Create admins in parallel for created schools
      if (adminDtos.length > 0) {
        const adminPromises = adminDtos.map((adminData) => {
          const school = createdSchools.find(
            (s) => s.code === adminData.schoolCode
          );
          if (school) {
            return this.schoolsService
              .addAdmin(school.id, adminData.admin)
              .catch((error) => {
                const errors = prismaErrorTransform(error);
                this.logger.error(
                  `Failed to create admin for school ${school.id}`,
                  errors
                );
                return null;
              });
          }
          return null;
        });

        await Promise.allSettled(adminPromises);
      }

      // Step 4: Prepare success results
      const results: SchoolImportResult[] = request.schools.map((school) => {
        const schoolExists = createdSchools.find((s) => s.code === school.code);
        return {
          id: schoolExists ? schoolExists.id : 0,
          success: !!schoolExists,
          message: schoolExists
            ? "ok"
            : `School code ${school.code} already exists`,
        };
      });

      return {
        results,
        totalCount: request.schools.length,
        successCount: createdSchools.length,
        failureCount: request.schools.length - createdSchools.length,
      };
    } catch (error) {
      const errors = prismaErrorTransform(error);
      this.logger.error("Error in batch import schools", errors);

      // Return all as failed if batch operation fails
      const results: SchoolImportResult[] = request.schools.map((itm) => ({
        id: 0,
        success: false,
        message: `${errors.field}:${errors.reason}` || `Failed to import school with code ${itm.code}`,
      }));

      return {
        results,
        totalCount: request.schools.length,
        successCount: 0,
        failureCount: request.schools.length,
      };
    }
  }
}
