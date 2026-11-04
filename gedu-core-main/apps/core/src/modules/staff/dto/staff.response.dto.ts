import { Exclude, Expose, Transform } from 'class-transformer';
import {
  PersonalAchievement,
  PersonalInsuranceFinance,
  PersonalWorkHistory,
  QualificationCompetence,
  SchoolStaffWorkContract,
  SchoolStaffsAllowance,
  TrainingDevelopmentHistory,
  User,
} from '@gedu/prisma';
import { PositionDto } from '../../school-departments/edu-departments/edu-positions/dto/edu-position.response';

export class StaffResponseDto {
  @Expose()
  sex: number;

  @Expose()
  dailyScheduleType: number;
}

export class CreateStaffResponse extends StaffResponseDto {
  @Expose()
  sex: number;

  @Expose()
  status: number;
}

export class GetSpecializationAndTeachingResponse {
  @Expose()
  @Transform(({ obj }) => obj?.user?.personal?.qualificationCompetence ?? null)
  qualificationCompetence: QualificationCompetence | null;

  @Expose()
  @Transform(({ obj }) => {
    const positions = obj?.schoolStaffPositions ?? [];
    const currentId = obj?.position?.id;

    return positions
      .filter(
        (pos: { position: PositionDto }) => pos?.position?.id !== currentId,
      )
      .map((pos: { position: PositionDto }) => pos.position);
  })
  schoolStaffPositions: PositionDto[];

  @Expose()
  @Transform(
    ({ obj }) => obj?.user?.personal?.trainingDevelopmentHistories ?? [],
  )
  trainingDevelopmentHistories: TrainingDevelopmentHistory[];

  @Expose()
  @Transform(({ obj }) => obj?.user?.personal?.personalAchievements ?? [])
  personalAchievements: PersonalAchievement[];

  @Expose()
  @Transform(({ obj }) => obj?.user?.personal?.personalWorkHistories ?? [])
  personalWorkHistories: PersonalWorkHistory[];

  @Exclude()
  user: User;
}

export class GetContractAndBenefitsResponse {
  @Expose()
  @Transform(({ obj }) => {
    return obj?.user?.personal?.personalInsuranceFinance ?? null;
  })
  personalInsuranceFinance: PersonalInsuranceFinance | null;

  @Expose()
  @Transform(({ obj }) => obj?.schoolStaffWorkContracts ?? [])
  schoolStaffWorkContracts: SchoolStaffWorkContract[];

  @Expose()
  @Transform(({ obj }) =>
    (obj?.schoolStaffSalaries ?? []).map((s: any) => ({
      ...s,
      coefficient: s.coefficient?.toString() ?? null, // DECIMAL fix
    })),
  )
  schoolStaffSalaries!: any[];

  @Expose()
  @Transform(({ obj }) => obj?.schoolStaffsAllowance ?? [])
  schoolStaffsAllowance: SchoolStaffsAllowance[];
}

export const StaffFolderResponseExample = {
  response: [
    {
      id: 1,
      orgId: 100001,
      userId: 13,
      folderName: 'bachelor',
      issuingAuthority: 'DH Quoc te',
      dateOfIssue: '2025-02-02T00:00:00.000Z',
      recordNumber: 'A123',
      type: 1,
      files: [
        {
          id: 1,
          name: 'bang dai hoc',
          link: 'http://example.com',
          type: 1,
        },
      ],
    },
  ],
};

export const SchoolStaffPositionAuthorityResponseExample = {
  response: [
    {
      id: 1,
      roleCode: 'principal',
      permissionCode: 'dshbrd_r',
      permissionTitle: 'Xem Tổng quan',
    },
  ],
};
