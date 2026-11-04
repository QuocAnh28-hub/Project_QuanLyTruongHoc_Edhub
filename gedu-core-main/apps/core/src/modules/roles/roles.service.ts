import { Injectable } from "@nestjs/common";
import { PrismaService, Prisma } from "@gedu/prisma";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {}

  // async findAll() {
  //   return this.prisma.role.findMany({
  //     include: {},
  //   });
  // }

  // async findOne(id: number) {
  //   const role = await this.prisma.role.findUnique({
  //     where: { id },
  //   });

  //   if (!role) {
  //     throw new NotFoundException(`Role with ID ${id} not found`);
  //   }

  //   return role;
  // }

  // async update(id: number, updateRoleDto: UpdateRoleDto) {
  //   try {
  //     return await this.prisma.role.update({
  //       where: { id },
  //       data: updateRoleDto,
  //     });
  //   } catch (error) {
  //     if (error instanceof Prisma.PrismaClientKnownRequestError) {
  //       if (error.code === "P2025") {
  //         throw new NotFoundException(`Role with ID ${id} not found`);
  //       }
  //     }
  //     throw error;
  //   }
  // }

  // async remove(id: number) {
  //   try {
  //     return await this.prisma.role.delete({
  //       where: { id },
  //     });
  //   } catch (error) {
  //     if (error instanceof Prisma.PrismaClientKnownRequestError) {
  //       if (error.code === "P2025") {
  //         throw new NotFoundException(`Role with ID ${id} not found`);
  //       }
  //     }
  //     throw error;
  //   }
  // }
}
