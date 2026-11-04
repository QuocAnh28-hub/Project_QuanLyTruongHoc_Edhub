import { AppError, AppException } from '@gedu/shared';
import { Folder, PrismaService } from '@gedu/prisma';

import { ContactStudentRepository } from './repository/contact-student.repository';
import { FolderItemDto } from './dto/get-student-folders.response.dto';
import { GetStudentByContactIdResponseDto } from './dto/contact-student.response.dto';
import { Injectable } from '@nestjs/common';
import { StudentFolderRepository } from '../repository/student-folders.repository';
import { StudentMedicalInfoRepository } from '../repository/student-medical-info.repository';
import { StudentsRepository } from '../repository/students.repository';
import { StudentsService } from '../students.service';
import { SyncStudentFoldersRequestDto } from './dto/contact-student.request.dto';
import { UpdateMedicalInfoRequestDto } from '../dto/students.request.dto';
import { plainToInstance } from 'class-transformer';

@Injectable({})
export class ContactStudentService {
  constructor(
    private readonly studentRepository: StudentsRepository,
    private readonly contactStudentRepository: ContactStudentRepository,
    private readonly studentMedicalInfoRepository: StudentMedicalInfoRepository,
    private readonly prisma: PrismaService,
    private readonly studentService: StudentsService,
    private readonly studentFolderRepository: StudentFolderRepository,
  ) {}

  async findContactByIdStudent(studentId: number) {
    return await this.contactStudentRepository.findAllContact(studentId);
  }

  async findStudentsByContactId(contactId: number) {
    const students =
      await this.contactStudentRepository.findStudentByContactId(contactId);

    return plainToInstance(GetStudentByContactIdResponseDto, students, {
      strategy: 'excludeAll',
    });
  }

  async confirmStudentInformation(
    performUserId: number,
    contactId: number,
    studentId: number,
  ) {
    const { targetStudent } = await this.validateContactAndStudent(
      performUserId,
      contactId,
      studentId,
    );

    if (targetStudent.isConfirmedBy) {
      throw new AppError(AppException.STUDENT_ALREADY_CONFIRMED);
    }

    await this.prisma.student.update({
      where: { id: studentId },
      data: { isConfirmedBy: performUserId },
    });

    return true;
  }

  async getStudentDetails(
    performUserId: number,
    contactId: number,
    studentId: number,
  ) {
    const { targetStudent } = await this.validateContactAndStudent(
      performUserId,
      contactId,
      studentId,
    );

    const student = await this.studentRepository.findStudentDetailById(
      targetStudent.orgId,
      studentId,
    );

    const studentMedicalInfo =
      await this.studentMedicalInfoRepository.getStudentMedicalInfo(studentId);

    let documentCount = 0;
    if (student.userId) {
      documentCount = await this.prisma.folder.count({
        where: {
          userId: student.userId,
        },
      });
    }

    return {
      ...student,
      studentMedicalInfo,
      documents: documentCount,
    };
  }

  async getStudentFolders(
    userId: number,
    contactId: number,
    studentId: number,
  ) {
    const { targetStudent } = await this.validateContactAndStudent(
      userId,
      contactId,
      studentId,
    );
    const studentFolders = await this.studentFolderRepository.getStudentFolders(
      targetStudent.orgId,
      targetStudent.userId,
    );

    return plainToInstance(FolderItemDto, studentFolders, {
      strategy: 'excludeAll',
    });
  }

  async syncFolderWithFiles(
    userId: number,
    contactId: number,
    studentId: number,
    dto: SyncStudentFoldersRequestDto,
  ) {
    if (!dto.id && dto.isDeleted) {
      throw new AppError(AppException.INVALID_PAYLOAD);
    }

    const { targetStudent } = await this.validateContactAndStudent(
      userId,
      contactId,
      studentId,
    );

    return await this.prisma.$transaction(async (tx) => {
      let folder: Folder | null = null;

      if (dto.id) {
        folder = await tx.folder.findUnique({ where: { id: dto.id } });
        if (
          !folder ||
          folder.orgId !== targetStudent.orgId ||
          folder.userId !== targetStudent.userId
        ) {
          throw new AppError(AppException.FOLDER_NOT_FOUND_OR_FORBIDDEN);
        }

        if (dto.isDeleted) {
          await tx.file.deleteMany({
            where: { folderId: folder.id, userId: targetStudent.userId },
          });
          await tx.folder.delete({ where: { id: folder.id } });
          return true;
        }
      }

      if (folder) {
        folder = await tx.folder.update({
          where: { id: folder.id },
          data: {
            folderName: dto.folderName,
            issuingAuthority: dto.issuingAuthority,
            dateOfIssue: dto.dateOfIssue ? new Date(dto.dateOfIssue) : null,
            recordNumber: dto.recordNumber,
            type: dto.type,
            updatedAt: new Date(),
            updatedBy: userId,
          },
        });
      } else {
        folder = await tx.folder.create({
          data: {
            orgId: targetStudent.orgId,
            userId: targetStudent.userId,
            folderName: dto.folderName,
            issuingAuthority: dto.issuingAuthority,
            dateOfIssue: dto.dateOfIssue ? new Date(dto.dateOfIssue) : null,
            recordNumber: dto.recordNumber,
            type: dto.type ?? 1,
            createdBy: userId,
            updatedBy: userId,
          },
        });
      }

      const filesToDelete =
        dto.files?.filter((f) => f.isDeleted && f.id).map((f) => f.id) ?? [];
      if (filesToDelete.length) {
        await tx.file.deleteMany({
          where: {
            id: { in: filesToDelete as number[] },
            folderId: folder.id,
            userId: targetStudent.userId,
          },
        });
      }

      const filesToProcess = dto.files?.filter((f) => !f.isDeleted) ?? [];
      for (const fileDto of filesToProcess) {
        if (fileDto.id) {
          const existing = await tx.file.findUnique({
            where: { id: fileDto.id },
          });
          if (!existing || existing.folderId !== folder.id) {
            throw new AppError(AppException.FILE_NOT_FOUND_OR_FORBIDDEN);
          }
          await tx.file.update({
            where: { id: fileDto.id },
            data: {
              name: fileDto.name,
              link: fileDto.link,
              type: fileDto.type,
              updatedAt: new Date(),
              updatedBy: userId,
            },
          });
        } else {
          await tx.file.create({
            data: {
              orgId: targetStudent.orgId,
              userId: targetStudent.userId,
              folderId: folder.id,
              name: fileDto.name,
              link: fileDto.link,
              type: fileDto.type ?? 1,
              createdBy: userId,
              updatedBy: userId,
            },
          });
        }
      }

      return true;
    });
  }

  async updateMedicalInfo(
    performUserId: number,
    contactId: number,
    studentId: number,
    request: UpdateMedicalInfoRequestDto,
  ) {
    const { targetStudent } = await this.validateContactAndStudent(
      performUserId,
      contactId,
      studentId,
    );

    return this.studentService.updateMedicalInfo(
      targetStudent.orgId,
      studentId,
      request,
    );
  }

  private async validateContactAndStudent(
    performUserId: number,
    contactId: number,
    studentId: number,
  ) {
    const contact =
      await this.contactStudentRepository.findStudentsContactById(contactId);

    if (!contact) {
      throw new AppError(AppException.CONTACT_STUDENT_NOT_FOUND);
    }

    if (contact.user.id !== performUserId) {
      throw new AppError(AppException.PERFORM_USER_ID_NOT_MATCH_CONTACT_ID);
    }

    const targetStudent = contact.students.find((st) => st.id === studentId);
    if (!targetStudent) {
      throw new AppError(AppException.STUDENT_CONTACT_NOT_LINKED_TO_STUDENT);
    }

    return { contact, targetStudent };
  }
}
