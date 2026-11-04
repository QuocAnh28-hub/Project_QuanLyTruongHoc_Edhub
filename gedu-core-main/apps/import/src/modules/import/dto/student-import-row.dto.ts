import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString, Matches, ValidateNested
} from 'class-validator';

import { 
  convertProvinceNameToComparableFormat, 
  convertWardNameToComparableFormat, 
  convertToComparableFormat
} from "@gedu/shared";

import { constantNumberMapping, contactRelationMapping } from '../../../utils/common.utils';
import { CODE_REGEX, CONTACT_RELATION_MAPPING, PHONE_REGEX, SEX_MAPPING } from '../../../constants/common.constants';
import { VALIDATION_ERRORS_MESSAGES } from '../../../constants/errors.constant';
import { ADMISSION_TYPE_MAP, GRADE_LEVEL_MAP } from '../../../constants/student.constants';


export class StudentGuardianDto {

  @IsOptional()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_FIRST_NAME })
  firstName?: string;

  @IsOptional()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_LAST_NAME })
  lastName?: string;

  @IsOptional()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_PHONE })
  @Matches(PHONE_REGEX, { message: VALIDATION_ERRORS_MESSAGES.INVALID_PHONE })
  phone?: string;

  @IsOptional()
  @IsEmail({}, { message: VALIDATION_ERRORS_MESSAGES.INVALID_EMAIL })
  email?: string;

  @IsOptional()
  @Transform(({ value }) => contactRelationMapping(value))
  @IsIn(Object.values(CONTACT_RELATION_MAPPING), { message: VALIDATION_ERRORS_MESSAGES.INVALID_RELATIONSHIP })
  relationship?: number;

  @IsOptional()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_RELATIONSHIP_TITLE })
  relationshipTitle?: string;
}

export class StudentAdmissionDto {

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: VALIDATION_ERRORS_MESSAGES.INVALID_ADMISSION_DATE })
  admissionDate?: Date;

  @IsOptional()
  @Transform(({ key, value }) => constantNumberMapping(value, ADMISSION_TYPE_MAP))
  @IsIn(Object.values(ADMISSION_TYPE_MAP), { message: VALIDATION_ERRORS_MESSAGES.INVALID_ADMISSION_TYPE })
  admissionType?: number;

  @IsOptional()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_ADMISSION_SCHOOL_YEAR })
  @Matches(/^\d{4}-\d{4}$/, { message: VALIDATION_ERRORS_MESSAGES.INVALID_ADMISSION_SCHOOL_YEAR })
  admissionSchoolYear?: string;

  @IsOptional()
  @Transform(({ key, value }) => constantNumberMapping(value, GRADE_LEVEL_MAP))
  @IsIn(Object.values(GRADE_LEVEL_MAP), { message: VALIDATION_ERRORS_MESSAGES.INVALID_GRADE_LEVEL })
  gradeLevel?: number;

  @IsOptional()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_CLASS_ID })
  className?: string;

  @IsOptional()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_PRIORITY_POLICY_ID })
  priorityPolicy?: string;

  @IsOptional()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_DISABILITY_POLICY_ID })
  disabilityPolicy?: string;
  
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: VALIDATION_ERRORS_MESSAGES.INVALID_YOUNG_PIONEER_JOIN_DATE })
  youngPioneerJoinDate?: Date;

  @IsOptional()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_YOUNG_PIONEER_TITLE })
  youngPioneerTitle?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: VALIDATION_ERRORS_MESSAGES.INVALID_YOUTH_UNION_JOIN_DATE })
  youthUnionJoinDate?: Date;

  @IsOptional()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_YOUTH_UNION_TITLE })
  youthUnionTitle?: string;


  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: VALIDATION_ERRORS_MESSAGES.INVALID_COMMUNIST_PARTY_JOIN_DATE })
  communistPartyJoinDate?: Date;

  @IsOptional()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_COMMUNIST_PARTY_TITLE })
  communistPartyTitle?: string;
}

export class StudentMedicalInfoDto {

  @IsOptional()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_FOOD_ALLERGY })
  foodAllergy?: string;

  @IsOptional()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_DRUG_ALLERGY })
  drugAllergy?: string;
        
  @IsOptional()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_DISEASE })
  disease?: string;

  @IsOptional()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_NOTE })
  note?: string;
}


export class StudentImportRowDto {

  @IsNotEmpty({ message: VALIDATION_ERRORS_MESSAGES.MISSING_STUDENT_CODE })
  @Matches(CODE_REGEX, { message: VALIDATION_ERRORS_MESSAGES.INVALID_STUDENT_CODE })
  code: string;
  
  @IsNotEmpty({ message: VALIDATION_ERRORS_MESSAGES.MISSING_FIRST_NAME })
  @IsString({ message:  VALIDATION_ERRORS_MESSAGES.INVALID_FIRST_NAME })
  firstName: string;

  @IsNotEmpty({ message: VALIDATION_ERRORS_MESSAGES.MISSING_LAST_NAME })
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_LAST_NAME })
  lastName: string;

  @IsOptional()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_CITIZEN_ID })
  citizenId?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: VALIDATION_ERRORS_MESSAGES.INVALID_DOB })
  dateOfBirth?: Date;

  @IsOptional()
  @Transform(({ value }) => constantNumberMapping(value, SEX_MAPPING))
  @IsIn(Object.values(SEX_MAPPING), { message: VALIDATION_ERRORS_MESSAGES.INVALID_SEX })
  sex?: number;

  @IsOptional()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_NATIONALITY })
  @Transform(({ value }) => convertToComparableFormat(value))
  nationality?: string;

  @IsOptional()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_RELIGION })
  @Transform(({ value }) => convertToComparableFormat(value))
  religion?: string;

  @IsOptional()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_PERMANENT_RESIDENCE_PROVINCE_ID })
  @Transform(({ value }) => convertProvinceNameToComparableFormat(value))
  permanentResidenceProvince?: string;

  @IsOptional()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_PERMANENT_RESIDENCE_WARD_ID })
  @Transform(({ value }) => convertWardNameToComparableFormat(value))
  permanentResidenceWard?: string;

  @IsOptional()
  @IsString({message: VALIDATION_ERRORS_MESSAGES.INVALID_PERMANENT_RESIDENCE_ADDRESS})
  permanentResidenceAddress?: string;

  @IsOptional()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_TEMPORARY_RESIDENCE_PROVINCE_ID })
  @Transform(({ value }) => convertProvinceNameToComparableFormat(value))
  temporaryResidenceProvince?: string;

  @IsOptional()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_TEMPORARY_RESIDENCE_WARD_ID })
  @Transform(({ value }) => convertWardNameToComparableFormat(value))
  temporaryResidenceWard?: string;

  @IsOptional()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_TEMPORARY_RESIDENCE_ADDRESS })
  temporaryResidenceAddress?: string;

  @Type(() => StudentGuardianDto)
  @IsArray({ message: VALIDATION_ERRORS_MESSAGES.INVALID_CONTACTS_LIST })
  @ArrayNotEmpty({ message: VALIDATION_ERRORS_MESSAGES.EMPTY_CONTACTS_LIST })
  @ValidateNested({ each: true })
  guardians: StudentGuardianDto[];

  @IsOptional()
  @Type(() => StudentAdmissionDto)
  @ValidateNested()
  admissionInfo?: StudentAdmissionDto;

  @IsOptional()
  @Type(() => StudentMedicalInfoDto)
  @ValidateNested()
  medicalInfo?: StudentMedicalInfoDto;
}


