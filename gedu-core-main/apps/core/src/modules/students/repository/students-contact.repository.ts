import { Prisma, PrismaService } from '@gedu/prisma';

import { Injectable } from '@nestjs/common';
import { CONTACT_RELATION, CONTACT_STATUS } from '@gedu/shared';

@Injectable()
export class StudentsContactRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findContactWithUser(
    orgId: number,
    studentId: number,
    contactId: number,
  ) {
    return this.prisma.studentsContact.findFirst({
      where: {
        id: contactId,
        OR: [
          { students: { some: { id: studentId, orgId } } },
          { studentContacts: { some: { student: { id: studentId, orgId } } } },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            phone: true,
            account: true,
          },
        },
        students: true,
      },
    });
  }

  async findDuplicatedPhone(contactId: number, phone: string) {
    return this.prisma.studentsContact.findFirst({
      where: {
        id: { not: contactId },
        user: { phone },
      },
    });
  }

  async updateStudentMainContact(studentId: number, contactId: number | null) {
    return this.prisma.student.update({
      where: { id: studentId },
      data: { mainContactId: contactId },
    });
  }

  async findStudent(studentId: number) {
    return this.prisma.student.findUnique({
      where: { id: studentId },
      select: { mainContactId: true },
    });
  }

  async findOtherActiveContact(studentId: number, contactId: number) {
    return this.prisma.studentsContact.findFirst({
      where: {
        id: { not: contactId },
        grantAccess: true,
        status: CONTACT_STATUS.ACTIVE,
        studentContacts: { some: { studentId } },
      },
    });
  }

  async createStudentContactWithUserId(id: number) {
    return await this.prisma.studentsContact.upsert({
      where: { userId: id },
      update: {},
      create: {
        userId: id,
      },
    });
  }

  async revokeAccessOthers(studentId: number, contactId: number) {
    return this.prisma.studentsContact.updateMany({
      where: {
        id: { not: contactId },
        studentContacts: { some: { studentId } },
      },
      data: { grantAccess: false },
    });
  }

  async updateContactAndUser(
    contactId: number,
    updateContactData: Prisma.StudentsContactUpdateInput,
    updateUserData: Prisma.UserUpdateInput,
  ) {
    return this.prisma.studentsContact.update({
      where: { id: contactId },
      data: {
        ...updateContactData,
        user:
          Object.keys(updateUserData).length > 0
            ? { update: updateUserData }
            : undefined,
      },
    });
  }

  async updateRelationInfo(
    studentId: number,
    contactId: number,
    relationshipData: Partial<{
      relationship: CONTACT_RELATION;
      relationshipTitle: string;
    }>,
  ) {
    return this.prisma.studentContactRelation.updateMany({
      where: {
        studentId,
        studentContactId: contactId,
      },
      data: relationshipData,
    });
  }

  async findContactDetail(contactId: number, studentId: number) {
    return this.prisma.studentsContact.findUnique({
      where: { id: contactId },
      include: {
        user: true,
        students: {
          where: { id: studentId },
          select: { mainContactId: true, id: true },
        },
        studentContacts: {
          where: { studentId },
          select: {
            relationship: true,
            relationshipTitle: true,
          },
        },
      },
    });
  }

  async createStudentContactRelation(
    studentId: number,
    contactId: number,
    relationship: CONTACT_RELATION,
    relationshipTitle: string | undefined = undefined,
  ) {
    return this.prisma.studentContactRelation.create({
      data: {
        studentId,
        studentContactId: contactId,
        relationship,
        relationshipTitle,
      },
    });
  }
}
