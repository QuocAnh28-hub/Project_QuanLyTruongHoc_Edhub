import { File, Folder, PrismaService } from '@gedu/prisma';

import { Injectable } from '@nestjs/common';

@Injectable()
export class StudentFolderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getStudentFolders(orgId: number, userId: number) {
    return this.prisma.folder.findMany({
      where: { orgId, userId },
      select: {
        id: true,
        orgId: true,
        userId: true,
        folderName: true,
        issuingAuthority: true,
        dateOfIssue: true,
        recordNumber: true,
        type: true,
        files: {
          select: {
            id: true,
            name: true,
            link: true,
            type: true,
          },
        },
      },
    });
  }
}
