import { Prisma, PrismaService } from '@gedu/prisma';

import { EDRoles } from '../../auth/dto/role-enums';
import { Injectable } from '@nestjs/common';
import { SeedDataDto } from '../dtos/seed.dto';
import countries from '../data/countries.json';
import { cryptString } from '@gedu/shared/utils';
import departments from '../data/template-departments.json';
import districts from '../data/districts.json';
import edDepartment from '../data/edu-department.json';
import eduLevels from '../data/edu-levels.json';
import ethnics from '../data/ethnics.json';
import instructionLanguage from '../data/instruction-language.json';
import newProvinces from '../data/new_provinces.json';
import newWards from '../data/new_wards.json';
import permissions from '../data/permissions.json';
import positionRoles from '../data/position-roles.json';
import positions from '../data/template-positions.json';
import provinces from '../data/provinces.json';
import religions from '../data/religions.json';
import rolePermissions from '../data/role-permissions.json';
import roles from '../data/roles.json';
import studentPriorityNeedsPolicies from '../data/student-priority-needs-policies.json';
import studentPriorityPolicies from '../data/student-priority-policies.json';
import wards from '../data/wards.json';

@Injectable()
export class SeedRepository {
  constructor(private readonly prisma: PrismaService) {}

  async seedData(seedDataDto: SeedDataDto) {
    try {
      const result = await this.prisma.$transaction(
        async (tx) => {
          const doet = await this.seedDOET(seedDataDto, tx);
          await Promise.all([
            this.seedAdmin(seedDataDto, doet.id, tx),
            this.seedAdministrativeUnit(tx),
            this.seedEthnicsAndReligions(tx),
            this.seedCommonShares(tx),
            this.seedStudentPriorityPolicies(tx),
            this.seedEduDepartment(tx),
          ]);
          return doet;
        },
        { timeout: 10 * 60 * 1000 },
      );

      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getDOET() {
    return this.prisma.educationDepartment.findFirst({
      where: {
        id: 1,
      },
      select: {
        id: true,
      },
    });
  }

  async seedDOET(seedDataDto: SeedDataDto, tx: Prisma.TransactionClient) {
    return tx.educationDepartment.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: seedDataDto.name,
        address: seedDataDto.address,
        hotline: seedDataDto.hotline,
        email: seedDataDto.email,
        website: seedDataDto.website,
        provinceId: seedDataDto.provinceId,
        wardId: seedDataDto.wardId,
        description: seedDataDto.description,
        shortName: seedDataDto.name,
      },
    });
  }

  async seedAdmin(
    seedDataDto: SeedDataDto,
    departmentId: number,
    tx: Prisma.TransactionClient,
  ) {
    const userEdu = await tx.user.upsert({
      where: {
        orgId_phone: { orgId: departmentId, phone: seedDataDto.adminPhone },
      },
      update: {},
      create: {
        email: seedDataDto.adminEmail,
        firstName: seedDataDto.adminFirstName,
        lastName: seedDataDto.adminLastName ?? '',
        orgId: departmentId,
        phone: seedDataDto.adminPhone,
      },
    });

    await tx.account.upsert({
      where: { userName: seedDataDto.adminAccount },
      update: {},
      create: {
        orgId: departmentId,
        userId: userEdu.id,
        userName: seedDataDto.adminAccount,
        password: await cryptString(seedDataDto.adminPassword),
        roles: EDRoles.ADMIN,
      },
    });

    await tx.edStaff.upsert({
      where: { userId: userEdu.id },
      update: {},
      create: {
        orgId: departmentId,
        userId: userEdu.id,
      },
    });
  }

  async seedAdministrativeUnit(tx: Prisma.TransactionClient) {
    const [_countries, _nations] = await Promise.all([
      tx.countries.createManyAndReturn({
        data: countries.map((country) => ({
          name: country.name,
          code: country.code,
          originalName: country.originalName,
          phoneCode: country.phoneCode,
          flag: country.flag,
        })),
      }),
      tx.nations.createMany({
        data: countries.map((country) => ({
          title: country.name,
        })),
      }),
    ]);
    const vnCountry = _countries.find((ct) => ct.code.toLowerCase() === 'vn');

    await Promise.all([
      tx.provinces.createMany({
        data: provinces.data.map((province) => ({
          countryId: vnCountry!.id,
          id: province.code,
          title: province.name,
        })),
      }),
      tx.districts.createMany({
        data: districts.data.map((district) => ({
          provinceId: district.provinceCode,
          id: district.code,
          title: district.name,
          type: district.type,
        })),
      }),
      tx.wards.createMany({
        data: wards.data.map((ward) => ({
          districtId: ward.districtId,
          id: ward.code,
          title: ward.name,
        })),
      }),
      tx.provincesCities.createMany({
        data: newProvinces.map((province) => ({
          id: province.id,
          countryId: vnCountry!.id,
          code: province.id,
          title: province.title,
          type: 1,
        })),
      }),
      tx.wardsCommunes.createMany({
        data: newWards.map((ward) => ({
          id: ward.id,
          parentId: ward.provinceId,
          title: ward.title,
          type: 1,
        })),
      }),
    ]);
  }

  async seedEthnicsAndReligions(tx: Prisma.TransactionClient) {
    await Promise.all([
      tx.ethnics.createMany({
        data: ethnics.data.map((ethic) => ({
          id: ethic.id,
          title: ethic.title,
        })),
      }),
      tx.religions.createMany({
        data: religions.data.map((religion) => ({
          id: religion.id,
          title: religion.title,
        })),
      }),
    ]);
  }

  async seedStudentPriorityPolicies(tx: Prisma.TransactionClient) {
    await Promise.all([
      tx.studentPriorityPolicies.createMany({
        data: studentPriorityPolicies.map((policy) => ({
          id: policy.id,
          title: policy.title,
          shortTitle: policy.short_title,
          isActive: true,
        })),
      }),
      tx.studentSpecialNeedsPolicies.createMany({
        data: studentPriorityNeedsPolicies.map((policy) => ({
          id: policy.id,
          title: policy.title,
          isActive: true,
        })),
      }),
    ]);
  }

  async seedCommonShares(tx: Prisma.TransactionClient) {
    await Promise.all([
      tx.educationLevels.createMany({
        data: eduLevels.map((level) => ({
          id: level.id,
          name: level.name,
          desc: level.desc,
          isActive: true,
        })),
      }),
      tx.schoolDepartmentTemplates.createMany({
        data: departments.map((dept) => ({
          id: dept.id,
          templateId: dept.templateId,
          code: dept.code,
          name: dept.name,
          desc: dept.desc,
          isActive: dept.isActive ?? true,
          orgId: dept.orgId ?? undefined,
          parentId: dept.parentId ?? null,
          headPositionId: dept.headPositionId ?? null,
        })),
      }),
      tx.schoolPositionTemplates.createMany({
        data: positions.map((pos) => ({
          id: pos.id,
          templateId: pos.templateId,
          orgId: pos.orgId ?? undefined,
          code: pos.code,
          departmentId: pos.departmentId,
          title: pos.title,
          desc: pos.desc ?? null,
          level: pos.level ?? 1,
          canDedicated: pos.canDedicated ?? false,
          canConcurrent: pos.canConcurrent ?? false,
          isDepartmentHead: pos.isDepartmentHead ?? false,
          isActive: pos.isActive ?? true,
        })),
      }),
      tx.instructionLanguage.createMany({
        data: instructionLanguage.map((inst) => ({
          id: inst.id,
          name: inst.name,
          code: inst.code,
          isForeign: inst.isForeign,
          isInstruction: inst.isInstruction,
          isActive: true,
        })),
      }),
    ]);
  }

  async seedEduDepartment(tx: Prisma.TransactionClient) {
    for (const dept of edDepartment.data) {
      await tx.eduDepartmentTemplate.create({
        data: {
          code: dept.code,
          name: dept.name,
          desc: dept.desc,
          isActive: true,
          positionTemplates: dept.positionTemplates?.create?.length
            ? {
                create: dept.positionTemplates.create.map((pos) => ({
                  code: pos.code,
                  title: pos.title ?? '',
                  desc: pos.desc ?? '',
                  isDepartmentHead: pos.isDepartmentHead ?? false,
                  canDedicated: pos.canDedicated ?? false,
                  isActive: pos.isActive ?? true,
                })),
              }
            : undefined,
        },
      });
    }
  }

  async seedRoles(override = false) {
    await this.prisma.$transaction(async (tx) => {
      const existingRoles = await tx.role.findMany({
        where: { code: { in: roles.map((r) => r.code) } },
        select: { code: true },
      });

      const existingCodes = new Set(existingRoles.map((r) => r.code));

      const operations = roles
        .map((role) => {
          if (override) {
            return tx.role.upsert({
              where: { code: role.code },
              update: {
                title: role.title,
                desc: role.desc,
              },
              create: {
                title: role.title,
                code: role.code,
                desc: role.desc,
              },
            });
          } else if (!existingCodes.has(role.code)) {
            return tx.role.create({
              data: {
                title: role.title,
                code: role.code,
                desc: role.desc,
              },
            });
          }
          return null;
        })
        .filter(Boolean);

      await Promise.all(operations);
    });
  }

  async seedRolePermissions() {
    await this.prisma.$transaction(async (tx) => {
      const existing = await tx.role_Permission.findMany({
        select: {
          role_code: true,
          permission_code: true,
        },
      });

      const existingSet = new Set(
        existing.map((rp) => `${rp.role_code}-${rp.permission_code}`),
      );

      const newEntries = rolePermissions
        .filter(
          (rp) => !existingSet.has(`${rp.role_code}-${rp.permission_code}`),
        )
        .map((rp) => ({
          role_code: rp.role_code,
          permission_code: rp.permission_code,
        }));

      if (newEntries.length > 0) {
        await tx.role_Permission.createMany({
          data: newEntries,
          skipDuplicates: true,
        });
      }
    });
  }

  async seedPermissions(override = false) {
    await this.prisma.$transaction(async (tx) => {
      const existing = await tx.permission.findMany({
        where: { code: { in: permissions.map((p) => p.code) } },
        select: { code: true },
      });
      const existingSet = new Set(existing.map((p) => p.code));

      const operations = permissions
        .map((p) => {
          if (override) {
            return tx.permission.upsert({
              where: { code: p.code },
              update: {
                title: p.title,
                desc: p.desc,
              },
              create: {
                title: p.title,
                code: p.code,
                desc: p.desc,
              },
            });
          } else {
            if (!existingSet.has(p.code)) {
              return tx.permission.create({ data: p });
            }
          }
          return null;
        })
        .filter(Boolean);

      await Promise.all(operations);
    });
  }

  async seedPositionRoles() {
    const existing = await this.prisma.position_Role.findMany({
      select: {
        position_id: true,
        role_code: true,
      },
    });

    const existingSet = new Set(
      existing.map((r) => `${r.position_id}-${r.role_code}`),
    );

    const newEntries = positionRoles
      .filter((pr) => !existingSet.has(`${pr.position_id}-${pr.role_code}`))
      .map((pr) => ({
        position_id: pr.position_id,
        role_code: pr.role_code,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

    if (newEntries.length > 0) {
      await this.prisma.position_Role.createMany({
        data: newEntries,
      });
    }
  }
}
