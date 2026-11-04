import { AppError, AppException } from '@gedu/shared';
import {
  ClassesResponseDto,
  SchoolYearsResponseDto,
} from '../school-years/dto/school-years.response.dto';
import {
  Country,
  Ethnic,
  Nation,
  Province,
  Religion,
  Ward,
} from '@gedu/shared/types';
import {
  GetCurriculumDto,
  GetSchoolPositionsDto,
} from './dto/get-school-positions.dto';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  InstructionLanguage,
  PrismaService,
  StudentPriorityPolicies,
  StudentSpecialNeedsPolicies,
} from '@gedu/prisma';
import {
  compareProvinceName,
  compareTwoString,
  compareWardName,
} from '@gedu/shared/utils';

import { ClassesRepository } from '../schools/classes/repository/classes.repository';
import { GetCurriculumResponseDto } from './dto/get-curriculum.response.dto';
import { RedisService } from '@gedu/redis';
import { SchoolRepository } from '../schools/repository/school.repository';
import { SharesRepository } from './repository/shares.repository';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class SharesService implements OnModuleInit {
  private readonly CACHE_TTL = 60 * 60 * 1000; // 1 hour
  private readonly logger = new Logger(SharesService.name);

  private nations: Nation[] = [];
  private religions: Religion[] = [];
  private provinces: Province[] = [];
  private wards: Ward[] = [];
  private ethnics: Ethnic[] = [];
  private countries: Country[] = [];
  private priorityPolicies: StudentPriorityPolicies[] = [];
  private priorityNeededPolicies: StudentSpecialNeedsPolicies[] = [];
  private instructionLanguage: InstructionLanguage[] = [];
  private foreignLanguage: InstructionLanguage[] = [];
  private isInitialized = false;
  private initializationPromise: Promise<void> | null = null;
  private nameCacheMap: Map<string, number | undefined> = new Map();

  constructor(
    private readonly sharesRepository: SharesRepository,
    private readonly classesRepository: ClassesRepository,
    private readonly schoolRepository: SchoolRepository,
    private readonly redisService: RedisService,
    private readonly prisma: PrismaService,
  ) {}

  async onModuleInit() {
    await this.ensureInitialized();
  }

  private async ensureInitialized(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this.warmUpCache();
    await this.initializationPromise;
    this.isInitialized = true;
  }

  async warmUpCache() {
    this.logger.log('Warm up shares cache');
    try {
      const [
        provinces,
        wards,
        nations,
        ethnics,
        religions,
        countries,
        priorityPolicies,
        priorityNeededPolicies,
        instructionLanguage,
        foreignLanguage,
      ] = await Promise.all([
        this.sharesRepository.getProvincesCities(),
        this.sharesRepository.getWardsAndCommunes(),
        this.sharesRepository.getNations(),
        this.sharesRepository.getEthnics(),
        this.sharesRepository.getReligions(),
        this.sharesRepository.getCountries(),
        this.sharesRepository.getPriorityPolicies(),
        this.sharesRepository.getPriorityNeededPolicies(),
        this.sharesRepository.findInstructionLanguages(),
        this.sharesRepository.findForeignLanguages(),
        // this.sharesRepository
      ]);

      this.provinces = provinces;
      this.wards = wards;
      this.nations = nations;
      this.ethnics = ethnics;
      this.religions = religions;
      this.countries = countries;
      this.priorityPolicies = priorityPolicies;
      this.priorityNeededPolicies = priorityNeededPolicies;
      this.instructionLanguage = instructionLanguage;
      this.foreignLanguage = foreignLanguage;
      // Redis caching is optional - failures won't affect service functionality
      try {
        const promises: Promise<any>[] = [];
        promises.push(
          this.redisService.set<Province[]>(
            'provinces',
            provinces,
            this.CACHE_TTL,
          ),
          this.redisService.set<Nation[]>('nations', nations, this.CACHE_TTL),
          this.redisService.set<Ward[]>('wards', wards, this.CACHE_TTL),
          this.redisService.set<Ethnic[]>('ethnics', ethnics, this.CACHE_TTL),
          this.redisService.set<Religion[]>(
            'religions',
            religions,
            this.CACHE_TTL,
          ),
          this.redisService.set<Country[]>(
            'countries',
            countries,
            this.CACHE_TTL,
          ),
          this.redisService.set<StudentPriorityPolicies[]>(
            'priorityPolicies',
            priorityPolicies,
            this.CACHE_TTL,
          ),
          this.redisService.set<StudentSpecialNeedsPolicies[]>(
            'priorityNeededPolicies',
            priorityNeededPolicies,
            this.CACHE_TTL,
          ),
          this.redisService.set<InstructionLanguage[]>(
            'instructionLanguages',
            this.instructionLanguage,
            this.CACHE_TTL,
          ),
        );
        await Promise.all(promises);
      } catch (redisError) {
        this.logger.warn(
          'Failed to cache data in Redis, service will use in-memory cache only',
          redisError,
        );
      }

      this.logger.log('Warm up shares cache done');
    } catch (error) {
      this.logger.error('Failed to warm up cache', error);
      throw error;
    }
  }

  // Student policies sections
  async getPriorityPolicies() {
    await this.ensureInitialized();
    return this.priorityPolicies;
  }

  async getPriorityNeededPolicies() {
    await this.ensureInitialized();
    return this.priorityNeededPolicies;
  }

  // Nation, ethnic, religion, country sections
  async getNations() {
    await this.ensureInitialized();
    return this.nations;
  }

  async getEthnics() {
    await this.ensureInitialized();
    return this.ethnics;
  }

  async getReligions() {
    await this.ensureInitialized();
    return this.religions;
  }

  // administrative unit sections
  async getCountries() {
    await this.ensureInitialized();
    return this.countries;
  }

  async getInstructionLanguages() {
    await this.ensureInitialized();
    return this.instructionLanguage;
  }

  async getForeignLanguages() {
    await this.ensureInitialized();
    return this.foreignLanguage;
  }

  async getProvincesCities() {
    await this.ensureInitialized();
    return this.provinces;
  }

  async findWardsCommunes(provincesCitiesId: number) {
    await this.ensureInitialized();
    return this.wards.filter((ward) => ward.parentId === provincesCitiesId);
  }

  async getWardsAndCommunes() {
    await this.ensureInitialized();
    return this.wards;
  }

  async getSchoolPositions(
    orgId: number,
    {
      templateId,
      departmentId,
    }: { templateId?: number; departmentId?: number },
  ) {
    const school = await this.prisma.school.findUnique({
      where: { id: orgId },
      select: {
        canUpperSecondarySchool: true,
        canLowerSecondarySchool: true,
        canPrimarySchool: true,
        canPreschool: true,
      },
    });

    const whereClause: Partial<{
      departmentId: number;
      templateId: number;
      isActive: boolean;
    }> = {
      isActive: true,
    };

    if (departmentId) {
      whereClause.departmentId = departmentId;
    }

    const queryTemplateId =
      templateId ?? (school ? this.getHighestTemplateId(school) : undefined);

    if (queryTemplateId) {
      whereClause.templateId = queryTemplateId;
    }

    const data = await this.sharesRepository.findSchoolPositionTemplates(
      whereClause,
      {
        id: true,
        code: true,
        title: true,
        desc: true,
        canDedicated: true,
        canConcurrent: true,
        isDepartmentHead: true,
        departmentId: true,
        department: { select: { name: true } },
      },
    );

    return data.map(({ department, ...rest }) => ({
      ...rest,
      departmentName: department?.name || null,
    }));
  }

  async getDepartments(orgId: number, templateId?: number) {
    const school = await this.prisma.school.findUnique({
      where: { id: orgId },
      select: {
        canUpperSecondarySchool: true,
        canLowerSecondarySchool: true,
        canPrimarySchool: true,
        canPreschool: true,
      },
    });

    const whereClause: Partial<{ templateId: number }> = {};

    const queryTemplateId =
      templateId ?? (school ? this.getHighestTemplateId(school) : undefined);

    if (queryTemplateId) {
      whereClause.templateId = queryTemplateId;
    }

    return this.sharesRepository.findSchoolDepartmentTemplates(whereClause, {
      id: true,
      name: true,
      code: true,
      parentId: true,
    });
  }

  async getSchoolYears(orgId: number) {
    const schoolYears =
      await this.sharesRepository.findSchoolYearsAllByOrgId(orgId);

    if (!schoolYears) {
      throw new AppError(AppException.SCHOOL_YEAR_NOT_FOUND_OR_ACCESS_DENIED);
    }

    return plainToInstance(SchoolYearsResponseDto, schoolYears || []);
  }

  async getClasses(orgId: number, schoolYearId: number, grd?: number) {
    const schoolYear = await this.sharesRepository.findSchoolYearsByIdAndOrgId(
      orgId,
      schoolYearId,
    );
    if (!schoolYear) {
      throw new AppError(AppException.SCHOOL_YEAR_NOT_FOUND_OR_ACCESS_DENIED);
    }

    const classes = await this.classesRepository.findByConditions(
      orgId,
      schoolYearId,
      grd,
    );
    return plainToInstance(ClassesResponseDto, classes || []);
  }

  async findSchoolYearIdByTitle(title?: string, orgId?: number) {
    if (!title || !orgId) return undefined;
    return this.sharesRepository.findSchoolYearByTitle(title, orgId);
  }

  async findClassByName(orgId: number, schoolYearId: number, name: string) {
    return this.classesRepository.findByName(orgId, schoolYearId, name);
  }

  // Helper for mapping name to id
  findProvinceIdByName(name?: string) {
    if (!name) return undefined;
    let result = this.retrieveIdFromCacheMap(name);
    if (result !== null) {
      return result;
    }
    result = this.provinces.find((province) =>
      compareProvinceName(province.title, name),
    )?.id;
    this.nameCacheMap.set(name, result);
    return result;
  }

  findWardIdByName(provinceId?: number, name?: string) {
    if (!name || !provinceId) return undefined;
    let result = this.retrieveIdFromCacheMap(`${provinceId}_${name}`);
    if (result !== null) {
      return result;
    }
    const ward = this.wards.find(
      (ward) =>
        compareWardName(ward.title, name) && ward.parentId === provinceId,
    );
    this.nameCacheMap.set(`${provinceId}_${name}`, ward?.id);
    return ward?.id;
  }

  findPriorityPolicyIdByName(name?: string) {
    if (!name) return undefined;
    let result = this.retrieveIdFromCacheMap(name);
    if (result !== null) {
      return result;
    }
    result = this.priorityPolicies.find((policy) =>
      compareTwoString(policy.title, name),
    )?.id;
    this.nameCacheMap.set(name, result);
    return result;
  }

  findSpecialNeedsPolicyIdByName(name?: string) {
    if (!name) return undefined;
    let result = this.retrieveIdFromCacheMap(name);
    if (result !== null) {
      return result;
    }
    result = this.priorityNeededPolicies.find((policy) =>
      compareTwoString(policy.title, name),
    )?.id;
    this.nameCacheMap.set(name, result);
    return result;
  }

  findNationIdByName(name?: string) {
    if (!name) return undefined;
    let result = this.retrieveIdFromCacheMap(name);
    if (result !== null) {
      return result;
    }
    result = this.nations.find((nation) =>
      compareTwoString(nation.title, name),
    )?.id;
    this.nameCacheMap.set(name, result);
    return result;
  }

  findEthnicIdByName(name?: string) {
    if (!name) return undefined;
    let result = this.retrieveIdFromCacheMap(name);
    if (result !== null) {
      return result;
    }
    result = this.ethnics.find((ethnic) =>
      compareTwoString(ethnic.title, name),
    )?.id;
    this.nameCacheMap.set(name, result);
    return result;
  }

  findReligionIdByName(name?: string) {
    if (!name) return undefined;
    let result = this.retrieveIdFromCacheMap(name);
    if (result !== null) {
      return result;
    }
    result = this.religions.find((religion) =>
      compareTwoString(religion.title, name),
    )?.id;
    this.nameCacheMap.set(name, result);
    return result;
  }

  findCountryIdByName(name?: string) {
    if (!name) return undefined;
    let result = this.retrieveIdFromCacheMap(name);
    if (result !== null) {
      return result;
    }
    result = this.countries.find((country) =>
      compareTwoString(country.originalName, name),
    )?.id;
    this.nameCacheMap.set(name, result);
    return result;
  }

  retrieveIdFromCacheMap(name: string): number | null | undefined {
    if (this.nameCacheMap.has(name)) {
      return this.nameCacheMap.get(name);
    }
    return null;
  }

  async getCurriculums(orgId: number, query?: GetCurriculumDto) {
    const curriculums = await this.sharesRepository.getCurriculums(
      orgId,
      query,
    );

    return plainToInstance(GetCurriculumResponseDto, curriculums || []);
  }

  async getHomeroomTeachers(orgId: number) {
    const school = await this.schoolRepository.findSchoolById(orgId);

    if (!school) {
      throw new AppError(AppException.SCHOOL_NOT_FOUND);
    }

    const homeroomTeachers =
      await this.sharesRepository.findHomeroomTeachers(orgId);

    return homeroomTeachers;
  }
  // Old provinces, cities, wards, communes (apply before 01/07/2025)
  // No cache
  async getProvinces() {
    return this.sharesRepository.getProvinces();
  }

  async getDistricts(provinceId: number) {
    return this.sharesRepository.getDistricts(provinceId);
  }

  async getWardsByDistrictId(districtId: number) {
    return this.sharesRepository.getWardsByDistrictId(districtId);
  }

  getHighestTemplateId(school?: {
    canUpperSecondarySchool?: boolean;
    canLowerSecondarySchool?: boolean;
    canPrimarySchool?: boolean;
    canPreSchool?: boolean;
  }): number | undefined {
    if (school?.canPreSchool) return 4;
    if (school?.canUpperSecondarySchool) return 3;
    if (school?.canLowerSecondarySchool) return 2;
    if (school?.canPrimarySchool) return 1;
    return undefined;
  }
}
