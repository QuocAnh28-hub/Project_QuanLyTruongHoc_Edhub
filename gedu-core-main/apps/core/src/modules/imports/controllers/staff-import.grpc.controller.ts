import { Controller, Logger } from '@nestjs/common';
import { CreateStaffDto } from '../../staff/dto/staff.request.dto';
import { GrpcMethod } from '@nestjs/microservices';
import { ImportStaffRequest, StaffImportResult } from '@gedu/transport';
import { StaffRepository } from '../../staff/repository/school-staff.repository';
import { SharesService } from '../../shares/shares.service';

@Controller('staffs.grpc')
export class StaffImportGrpcController {

  private readonly logger = new Logger(StaffImportGrpcController.name);

  constructor(
    private readonly staffRepository: StaffRepository,
    private readonly sharesService: SharesService,
  ) { }

  @GrpcMethod('StaffImportService', 'ImportStaffs')
  async importStaffs(request: ImportStaffRequest) {
    const staffDtos: CreateStaffDto[] = [];

    for (const data of request.staffs) {
      let nationalityId: number | undefined;  
      let religionId: number | undefined;
      let permanentResidenceProvinceId: number | undefined;
      let permanentResidenceWardId: number | undefined;
      let temporaryResidenceProvinceId: number | undefined;
      let temporaryResidenceWardId: number | undefined;

      try {
        nationalityId = this.sharesService.findNationIdByName(data.nationality);
        religionId = this.sharesService.findReligionIdByName(data.religion);
        permanentResidenceProvinceId = this.sharesService.findProvinceIdByName(data.permanentResidenceProvince);
        permanentResidenceWardId = this.sharesService.findWardIdByName(permanentResidenceProvinceId, data.permanentResidenceWard);
        temporaryResidenceProvinceId = this.sharesService.findProvinceIdByName(data.temporaryResidenceProvince);
        temporaryResidenceWardId = this.sharesService.findWardIdByName(temporaryResidenceProvinceId, data.temporaryResidenceWard);
      } catch (error) {
        this.logger.error(`Failed to resolve IDs for staff ${data.code}:`, error);
      }

      const createStaffDto: CreateStaffDto = {
        code: data.code,
        firstName: data.firstName,
        lastName: data.lastName,
        citizenId: data.citizenId,
        email: data.email,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        dateOfIssue: data.dateOfIssue ? new Date(data.dateOfIssue) : undefined,
        dateOfExpiry: data.dateOfExpiry
          ? new Date(data.dateOfExpiry)
          : undefined,
        placeOfIssue: data.placeOfIssue || undefined,

        permanentResidenceProvinceId: permanentResidenceProvinceId,
        permanentResidenceWardId: permanentResidenceWardId,
        permanentResidenceAddress: data.permanentResidenceAddress || undefined,

        temporaryResidenceProvinceId: temporaryResidenceProvinceId,
        temporaryResidenceWardId: temporaryResidenceWardId,
        temporaryResidenceAddress: data.temporaryResidenceAddress || undefined,

        sex: data.sex || undefined,
        contactPhone: data.contactPhone || undefined,
        contactPhone2: data.contactPhone2 || undefined,

        nationalityId: nationalityId,
        religionId: religionId,

        phone: data.phone || undefined,
      };

      staffDtos.push(createStaffDto as CreateStaffDto);
    }

    const createdStaffs = await this.staffRepository.createMany(
      request.orgId,
      staffDtos,
    );

    const results: StaffImportResult[] = createdStaffs.map((staff) => {
      return {
        id: staff.id,
        success: !!staff.user,
        message: staff.error || 'ok',
      };
    });

    return {
      results,
      totalCount: request.staffs.length,
      successCount: results.filter((result) => result.success).length,
      failureCount: results.filter((result) => !result.success).length,
    };
  }
}
