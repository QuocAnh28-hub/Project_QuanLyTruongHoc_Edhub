import { PrismaService } from "@gedu/prisma";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.account.findMany({
      include: {
        user: true,
      },
    });
  }
}
