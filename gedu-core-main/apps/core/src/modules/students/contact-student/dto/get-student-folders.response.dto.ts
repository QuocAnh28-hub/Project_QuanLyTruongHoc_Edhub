import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class FileItemDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  link: string;

  @Expose()
  type?: number;
}

export class FolderItemDto {
  @Expose()
  id: number;

  @Expose()
  orgId: number;

  @Expose()
  userId: number;

  @Expose()
  folderName: string;

  @Expose()
  issuingAuthority: string;

  @Expose()
  dateOfIssue?: Date | null;

  @Expose()
  recordNumber?: string | null;

  @Expose()
  type?: number;

  @Expose()
  files: FileItemDto[];
}

export class GetStudentFoldersResponseDto {
  @ApiProperty({
    type: FolderItemDto,
    isArray: true,
    example: [
      {
        id: 1,
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
  })
  response: FolderItemDto[];
}
