import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SchoolPositionsService } from './school-positions.service';
import { GetSchoolPositionsDto } from './dto/get-school-positions.dto';
import { DefaultPagination } from '@gedu/http';
import { User } from '../auth/decorators/user.decorators';
import { Authorization } from '../auth/decorators/authorization.decorators';
import { ScRoles } from '../auth/dto/role-enums';
import { SchoolPositionAuthorityResponseExample } from './dto/school-position.response.dto';

@ApiTags('school-positions')
@Controller('school-positions')
@ApiBearerAuth()
@Authorization([ScRoles.DEPARTMENT_ALL])
@UseGuards(JwtAuthGuard)
export class SchoolPositionsController {
  constructor(
    private readonly schoolPositionsService: SchoolPositionsService,
  ) {}

  @Get('')
  @Authorization([ScRoles.DEPARTMENT_READ])
  @ApiOperation({ summary: 'Retrieve paginated list of school positions' })
  async getSchoolPositions(
    @DefaultPagination() _unused: undefined,
    @User('orgId') orgId: number,
    @Query() query: GetSchoolPositionsDto,
  ) {
    return this.schoolPositionsService.getSchoolPositions(orgId, query);
  }

  @Get('/:positionId')
  @Authorization([ScRoles.DEPARTMENT_READ])
  @ApiOperation({ summary: 'Retrieve detail of a school position' })
  async getSchoolPositionDetail(
    @User('orgId') orgId: number,
    @Param('positionId') positionId: number,
  ) {
    return this.schoolPositionsService.getSchoolPositionDetail(
      orgId,
      +positionId,
    );
  }

  @Get('/:positionId/authorities')
  @Authorization([ScRoles.DEPARTMENT_READ])
  @ApiOperation({ summary: 'Retrieve authorities of a school position' })
  @ApiOkResponse({
    description: 'School position authorities retrieved successfully',
    schema: { example: SchoolPositionAuthorityResponseExample },
  })
  async getSchoolPositionAuthorities(
    @User('orgId') orgId: number,
    @Param('positionId', ParseIntPipe) positionId: number,
  ) {
    return this.schoolPositionsService.getSchoolPositionAuthorities(
      orgId,
      positionId,
    );
  }
}
