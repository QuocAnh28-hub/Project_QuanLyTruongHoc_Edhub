import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CampusResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 100001 })
  @Expose()
  schoolId: number;

  @ApiProperty({ example: 'CS001' })
  @Expose()
  code: string;

  @ApiProperty({ example: 'Cơ sở Quận 1' })
  @Expose()
  name: string;

  @ApiProperty({ example: '123 Đường Nguyễn Huệ, Quận 1, TP.HCM' })
  @Expose()
  address: string;

  @ApiProperty({ example: 1 })
  @Expose()
  provinceId: number;

  @ApiProperty({ example: 4 })
  @Expose()
  wardId: number;

  @ApiProperty({ example: '0283123456' })
  @Expose()
  hotline: string;

  @ApiProperty({ example: 5000.5 })
  @Expose()
  totalArea: number;

  @ApiProperty({ example: 1500 })
  @Expose()
  distance: number;

  @ApiProperty({ example: 'Xe buýt, xe máy' })
  @Expose()
  meansOfTransportation: string;

  @ApiProperty({ example: '2025-01-15T10:30:00.000Z' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: '2025-01-15T10:30:00.000Z' })
  @Expose()
  updatedAt: Date;
}

export class CreateCampusResponseDto {
  @ApiProperty({ example: 'Successfully created 1 campus(es)' })
  message: string;

  @ApiProperty({ type: [CampusResponseDto] })
  campuses: CampusResponseDto[];
}

export class UpdateCampusResponseDto {
  @ApiProperty({ type: [CampusResponseDto] })
  updated: CampusResponseDto[];

  @ApiProperty({ type: [Number], example: [] })
  deleted: number[];
}

// Example constants for API documentation
export const CreateCampusExample = {
  message: 'Successfully created 1 campus(es)',
  campuses: [
    {
      id: 1,
      schoolId: 100001,
      code: 'CS001',
      name: 'Cơ sở Quận 1',
      address: '123 Đường Nguyễn Huệ, Quận 1, TP.HCM',
      provinceId: 1,
      wardId: 4,
      hotline: '0283123456',
      totalArea: 5000.5,
      distance: 1500,
      meansOfTransportation: 'Xe buýt, xe máy',
      createdAt: '2025-01-15T10:30:00.000Z',
      updatedAt: '2025-01-15T10:30:00.000Z',
    },
  ],
};

export const UpdateSingleCampusExample = {
  updated: [
    {
      id: 1,
      schoolId: 100001,
      code: 'CS001',
      name: 'Cơ sở Quận 1 - Updated',
      address: '456 Đường Lê Lợi, Quận 1, TP.HCM',
      provinceId: 1,
      wardId: 4,
      hotline: '0283654321',
      totalArea: 6000.0,
      distance: 1200,
      meansOfTransportation: 'Xe buýt, xe máy, ô tô',
      createdAt: '2025-01-15T10:30:00.000Z',
      updatedAt: '2025-01-15T11:45:00.000Z',
    },
  ],
  deleted: [],
};
