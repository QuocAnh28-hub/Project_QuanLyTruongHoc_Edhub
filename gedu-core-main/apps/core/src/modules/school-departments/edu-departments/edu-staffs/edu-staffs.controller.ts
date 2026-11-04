import { DefaultPagination } from '@gedu/http';
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Authorization } from '../../../auth/decorators/authorization.decorators';
import { User } from '../../../auth/decorators/user.decorators';
import { EDRoles } from '../../../auth/dto/role-enums';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { GetEduStaffDto } from './dto/edu-staffs.request.dto';
import { EduStaffService } from './edu-staffs.service';

@ApiTags('ed-staffs')
@Controller('ed-staffs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Authorization([EDRoles.ADMIN])
export class EduStaffController {
  constructor(private readonly staffService: EduStaffService) { }

  @Get()
  @ApiOperation({ summary: 'Get a list of staff by organization' })
  getStaff(
    @DefaultPagination() _unused: void,
    @User('orgId') orgId: number,
    @Query() query: GetEduStaffDto,
  ) {
    return this.staffService.findAll(orgId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get staff details by ID' })
  findOne(@User('orgId') orgId: number, @Param('id', ParseIntPipe) id: number) {
    return this.staffService.getStaffById(orgId, id);
  }
}
