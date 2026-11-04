import { PrismaService } from '@gedu/prisma';
import { Injectable } from '@nestjs/common';
import { CreateContactStudentDto } from '../dto/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaServer: PrismaService) {}

  async createContactUser(
    orgId: number,
    createUserDto: CreateContactStudentDto,
  ) {
    return this.prismaServer.user.create({
      data: {
        orgId,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        email: createUserDto.email,
        phone: createUserDto.phone,
        personal: {
          create: {
            firstName: createUserDto.firstName,
            lastName: createUserDto.lastName,
            citizenId: createUserDto.citizenId,
            occupation: createUserDto.occupation,
            dateOfBirth: createUserDto.dateOfBirth,
          },
        },
      },
    });
  }

  async findUserByPhone(orgId: number, phone: string) {
    return this.prismaServer.user.findFirst({
      where: {
        orgId,
        phone,
      },
    });
  }

}
