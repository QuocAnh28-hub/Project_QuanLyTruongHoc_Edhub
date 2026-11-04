import { DefaultPagination } from '@gedu/http';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import { Authorization } from '../../../auth/decorators/authorization.decorators';
import { User } from '../../../auth/decorators/user.decorators';
import { EDRoles } from '../../../auth/dto/role-enums';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { GetEduPositionsDto } from './dto/edu-position.request';
import { GetPositionsResponseDto } from './dto/edu-position.response';
import { EdPositionsService } from './edu-position.service';

@ApiTags('ed-positions')
@Controller('ed-positions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Authorization([EDRoles.ADMIN])
export class EdPositionsController {
  constructor(private readonly edPositionsService: EdPositionsService) { }

  @Get('')
  @ApiOperation({ summary: 'Retrieve paginated list of school positions' })
  @ApiOkResponse({ type: GetPositionsResponseDto })
  async getSchoolPositions(
    @DefaultPagination() _unused: undefined,
    @User('orgId') orgId: number,
    @Query() query: GetEduPositionsDto,
  ) {
    return this.edPositionsService.getEduPositions(orgId, query);
  }

  @Get('/:positionId')
  @ApiOperation({ summary: 'Retrieve detail of a school position' })
  async getSchoolPositionDetail(
    @User('orgId') orgId: number,
    @Param('positionId') positionId: number,
  ) {
    return this.edPositionsService.getEduPositionDetail(orgId, +positionId);
  }
}
