import { AppError, AppException, STUDENT_CLASS_STATUS } from '@gedu/shared';
import { PrismaService, Student, StudentsContact, User } from '@gedu/prisma';

import { ExtendedUpdateContactStudentRequestDto } from '../../dto/students.request.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ContactStudentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findStudentsContactById(id: number): Promise<{
    id: number;
    user: { id: number };
    students: {
      id: number;
      orgId: number;
      isConfirmedBy: number | null;
      userId: number;
    }[];
  } | null> {
    const contact = await this.prisma.studentsContact.findUnique({
      where: { id },
      select: {
        id: true,
        user: { select: { id: true } },
        studentContacts: {
          select: {
            student: {
              select: {
                id: true,
                orgId: true,
                isConfirmedBy: true,
                userId: true,
              },
            },
          },
        },
      },
    });

    if (!contact) return null;

    return {
      id: contact.id,
      user: contact.user,
      students: contact.studentContacts.map((sc) => sc.student),
    };
  }

  async findStudentByContactId(id: number) {
    return this.prisma.studentContactRelation.findMany({
      where: { studentContactId: id },
      include: {
        student: {
          select: {
            id: true,
            code: true,
            status: true,
            school: { select: { name: true, id: true } },
            confirmedBy: {
              select: {
                firstName: true,
                lastName: true,
                id: true,
              },
            },
            studentClasses: {
              where: { status: STUDENT_CLASS_STATUS.ACTIVE },
              orderBy: { arrangeAt: 'desc' },
              take: 1,
              select: {
                class: {
                  select: {
                    name: true,
                    gradeLevel: true,
                  },
                },
                status: true,
                classId: true,
              },
            },
            user: {
              select: {
                personal: true,
              },
            },
          },
        },
      },
    });
  }

  async findAllContact(studentId: number) {
    return this.prisma.studentContactRelation.findMany({
      where: { studentId },
      select: {
        relationship: true,
        relationshipTitle: true,
        studentContactId: true,
        studentContact: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async upsertStudentContacts(
    orgId: number,
    studentId: number,
    contacts: ExtendedUpdateContactStudentRequestDto[],
  ) {
    const student = await this.getStudentWithContacts(studentId);
    if (!student) {
      throw new AppError(AppException.STUDENT_NOT_FOUND);
    }

    const { toCreate, toUpdate, toDelete } = this.splitContacts(contacts);

    this.validateContactLimits(student, toCreate, toDelete);
    this.validateMainContactUniqueness(toCreate, toUpdate);

    return await this.prisma.$transaction(
      async (prisma) => {
        const relationMap = this.createRelationMap(student.studentContacts);
        const contactIdUserIdMap = this.createContactIdUserIdMap(
          student.studentContacts,
        );
        const results: any[] | PromiseLike<any[]> = [];

        await this.handleDeletes(
          prisma,
          toDelete,
          student,
          studentId,
          relationMap,
          results,
        );
        await this.handleUpdates(
          prisma,
          toUpdate,
          studentId,
          relationMap,
          contactIdUserIdMap,
          results,
        );
        await this.handleCreates(prisma, toCreate, orgId, studentId, results);

        return results;
      },
      { timeout: 60000 },
    );
  }

  private async getStudentWithContacts(studentId: number) {
    return this.prisma.student.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        mainContactId: true,
        studentContacts: {
          select: {
            id: true,
            studentContact: {
              select: {
                id: true,
                userId: true,
              },
            },
          },
        },
      },
    });
  }

  private splitContacts(contacts: ExtendedUpdateContactStudentRequestDto[]) {
    return {
      toCreate: contacts.filter((c) => !c.id),
      toUpdate: contacts.filter((c) => c.id && !c.isDeleted),
      toDelete: contacts.filter((c) => c.id && c.isDeleted),
    };
  }

  private validateContactLimits(
    student: Awaited<ReturnType<typeof this.getStudentWithContacts>>,
    toCreate: any[],
    toDelete: any[],
  ) {
    const existing = student?.studentContacts?.length || 0;
    const afterDelete = existing - toDelete.length;
    const afterCreate = afterDelete + toCreate.length;

    if (afterCreate > 3) {
      throw new AppError(AppException.STUDENT_CONTACT_LIMIT_EXCEEDED);
    }
  }

  private validateMainContactUniqueness(toCreate: any[], toUpdate: any[]) {
    const mainContactCount =
      toCreate.filter((c) => c.isMainContact).length +
      toUpdate.filter((c) => c.isMainContact).length;

    if (mainContactCount > 1) {
      throw new AppError(
        AppException.DUPLICATE_MAIN_CONTACT,
        'Chỉ được chọn một liên hệ chính',
      );
    }
  }

  private createRelationMap(studentContactRelations: any[]) {
    return new Map(
      studentContactRelations?.map((relation) => [
        relation.studentContact.id,
        relation.id,
      ]) || [],
    );
  }

  private createContactIdUserIdMap(studentContactRelations: any[]) {
    return new Map(
      studentContactRelations?.map((relation) => [
        relation.studentContact.id,
        relation.studentContact.userId,
      ]) || [],
    );
  }

  private async handleDeletes(
    prisma: any,
    toDelete: any[],
    student: any,
    studentId: number,
    relationMap: Map<number, number>,
    results: any[],
  ) {
    for (const c of toDelete) {
      if (!c.id) continue;
      const relationId = relationMap.get(c.id);
      if (!relationId) continue;

      await prisma.studentContactRelation.delete({ where: { id: relationId } });

      if (c.id === student?.mainContactId) {
        await prisma.student.update({
          where: { id: studentId },
          data: { mainContactId: null },
        });
      }

      await prisma.studentsContact.delete({ where: { id: c.id } });
      results.push({ ...c, action: 'deleted' });
    }
  }

  private async handleUpdates(
    prisma: any,
    toUpdate: any[],
    studentId: number,
    relationMap: Map<number, number>,
    contactIdUserIdMap: Map<number, number>,
    results: any[],
  ) {
    for (const c of toUpdate) {
      if (!c.id) continue;
      const relationId = relationMap.get(c.id);
      if (!relationId) continue;

      const userId = contactIdUserIdMap.get(c.id);
      if (!userId) continue;

      // Prepare update data
      const userUpdateData: any = {
        firstName: c.firstName,
        lastName: c.lastName,
        avatar: c.avatar,
        email: c.email,
      };

      if (c.phone) {
        const existingUserWithPhone = await prisma.user.findFirst({
          where: {
            phone: c.phone,
            id: {
              not: userId, // Exclude current user
            },
          },
          select: { id: true },
        });

        if (!existingUserWithPhone) {
          userUpdateData.phone = c.phone;
        }
        // else skip phone update silently
      }

      await prisma.user.update({
        where: { id: userId },
        data: userUpdateData,
      });

      await prisma.studentContactRelation.update({
        where: { id: relationId },
        data: {
          relationship: c.relationship,
          relationshipTitle: c.relationshipTitle,
        },
      });

      if (c.isMainContact) {
        await prisma.student.update({
          where: { id: studentId },
          data: { mainContactId: c.id },
        });
      }

      results.push({ ...c, action: 'updated' });
    }
  }

  private async handleCreates(
    prisma: any,
    toCreate: any[],
    orgId: number,
    studentId: number,
    results: any[],
  ) {
    for (const c of toCreate) {
      const existingPhone = await prisma.user.findUnique({
        where: { phone: c.phone },
      });
      if (existingPhone) {
        throw new AppError(AppException.PHONE_NUMBER_EXISTS);
      }
      const user = await prisma.user.create({
        data: {
          orgId,
          firstName: c.firstName,
          lastName: c.lastName,
          avatar: c.avatar,
          email: c.email,
          phone: c.phone,
        },
      });

      const contact = await prisma.studentsContact.create({
        data: { userId: user.id },
      });

      await prisma.studentContactRelation.create({
        data: {
          studentId,
          studentContactId: contact.id,
          relationship: c.relationship,
          relationshipTitle: c.relationshipTitle,
        },
      });

      if (c.isMainContact) {
        await prisma.student.update({
          where: { id: studentId },
          data: { mainContactId: contact.id },
        });
      }

      results.push({ ...c, id: contact.id, action: 'created' });
    }
  }

  async isStudentContactLinked(
    studentId: number,
    contactId: number,
  ): Promise<boolean> {
    const exist = await this.prisma.studentContactRelation.findFirst({
      where: {
        studentId,
        studentContactId: contactId,
      },
      select: { id: true },
    });

    return !!exist;
  }
}
