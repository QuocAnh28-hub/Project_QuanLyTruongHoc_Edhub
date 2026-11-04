import { Inject, Injectable } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { lastValueFrom } from "rxjs";

import { EmailService } from "@gedu/email";
import {
  GRPC_SERVICE,
  StudentImport,
  ImportStudentRequest,
  StudentImportService as StudentImportServiceGrpc,
} from "@gedu/transport";
import { MinioService } from "@gedu/minio";

import { arrayToObjectMapping } from "../../../../utils/common.utils";
import { BatchItem, BatchResponse } from "../../types/import.types";
import { BaseImportService } from "./base-import.service";
import { StudentImportRowDto } from "../../dto/student-import-row.dto";
import { ImportRepository } from "../../repositories/import.repository";

const COLUMN_MAPPING = [
  "code",
  "lastName",
  "firstName",
  "citizenId",
  "dateOfBirth",
  "sex",
  "nationality",
  "religion",
  "permanentResidenceProvince",
  "permanentResidenceWard",
  "permanentResidenceAddress",
  "temporaryResidenceProvince",
  "temporaryResidenceWard",
  "temporaryResidenceAddress",
  "contactLastName",
  "contactFirstName",
  "contactPhone",
  "contactEmail",
  "relationship",
  "contactLastName2",
  "contactFirstName2",
  "contactPhone2",
  "contactEmail2",
  "relationship2",
  "admissionDate",
  "admissionSchoolYear",
  "admissionType",
  "gradeLevel",
  "className",
  "priorityPolicy",
  "disabilityPolicy",
  "youngPioneerJoinDate",
  "youngPioneerTitle",
  "youthUnionJoinDate",
  "youthUnionTitle",
  "communistPartyJoinDate",
  "communistPartyTitle",
  "foodAllergy",
  "drugAllergy",
  "disease",
  "note",
];

@Injectable()
export class StudentImportService extends BaseImportService<StudentImport> {
  private studentService: StudentImportServiceGrpc;

  constructor(
    protected readonly minioService: MinioService,
    protected readonly emailService: EmailService,
    protected readonly importRepository: ImportRepository,
    @Inject(GRPC_SERVICE) private readonly client: ClientGrpc
  ) {
    super(minioService, emailService, importRepository);

    this.studentService =
      this.client.getService<StudentImportServiceGrpc>("StudentImportService");
  }

  async processRow(row: any[]): Promise<StudentImport> {

    const studentRow = this.parseStudentRow(row);
    const validationErrors = await validate(studentRow);
    if (validationErrors.length > 0) {
      const messages = this.parseValidationErrors(validationErrors);
      throw new Error(`Validation Error: ${messages.map((m) => `${m.key}: ${m.values.join(', ')}`).join('; ')}`);
    }

    return {
      // CreateStudentRequestDto fields
      code: studentRow.code,
      // BaseStudentRequestDto fields
      firstName: studentRow.firstName,
      lastName: studentRow.lastName,
      citizenId: studentRow.citizenId,
      dateOfBirth: studentRow.dateOfBirth,
      sex: studentRow.sex,
      nationality: studentRow.nationality,
      religion: studentRow.religion,

      // Address fields
      permanentResidenceProvince: studentRow.permanentResidenceProvince,
      permanentResidenceWard: studentRow.permanentResidenceWard,
      permanentResidenceAddress: studentRow.permanentResidenceAddress,

      temporaryResidenceProvince: studentRow.temporaryResidenceProvince,
      temporaryResidenceWard: studentRow.temporaryResidenceWard,
      temporaryResidenceAddress: studentRow.temporaryResidenceAddress,

      guardians: studentRow.guardians,
      admissionInfo: studentRow.admissionInfo,
      medicalInfo: studentRow.medicalInfo,
    }
  }

  parseStudentRow(rawData: any): StudentImportRowDto {
    const typedRow = arrayToObjectMapping(rawData, COLUMN_MAPPING) as any;
    const guardians = []
    if (typedRow.contactFirstName && typedRow.contactPhone && typedRow.relationship) {
      guardians.push({
        firstName: typedRow.contactFirstName as string,
        lastName: typedRow.contactLastName as string,
        phone: typedRow.contactPhone as string,
        email: typedRow.contactEmail as string,
        relationship: typedRow.relationship as string,
        relationshipTitle: typedRow.relationship as string,
      })
    }
    if (typedRow.contactFirstName2 && typedRow.contactPhone2 && typedRow.relationship2) {
      guardians.push({
        firstName: typedRow.contactFirstName2 as string,
        lastName: typedRow.contactLastName2 as string,
        phone: typedRow.contactPhone2 as string,
        email: typedRow.contactEmail2 as string,
        relationship: typedRow.relationship2 as string,
        relationshipTitle: typedRow.relationship2 as string,
      })
    }
    typedRow.guardians = guardians;
    if (typedRow.admissionType || typedRow.gradeLevel) {
      typedRow.admissionInfo = {
        admissionDate: typedRow.admissionDate,
        admissionSchoolYear: typedRow.admissionSchoolYear,
        gradeLevel: typedRow.gradeLevel,
        admissionType: typedRow.admissionType,
        className: typedRow.className,
        priorityPolicy: typedRow.priorityPolicy,
        disabilityPolicy: typedRow.disabilityPolicy,
        youngPioneerJoinDate: typedRow.youngPioneerJoinDate,
        youngPioneerTitle: typedRow.youngPioneerTitle,
        youthUnionJoinDate: typedRow.youthUnionJoinDate,
        youthUnionTitle: typedRow.youthUnionTitle,
        communistPartyJoinDate: typedRow.communistPartyJoinDate,
        communistPartyTitle: typedRow.communistPartyTitle,
      }
    }
    if (typedRow.foodAllergy
      || typedRow.drugAllergy
      || typedRow.disease
      || typedRow.note) { // If have any field in medicalInfo, then set medicalInfo
      typedRow.medicalInfo = {
        foodAllergy: typedRow.foodAllergy,
        drugAllergy: typedRow.drugAllergy,
        disease: typedRow.disease,
        note: typedRow.note,
      }
    }
    return plainToInstance(StudentImportRowDto, typedRow);
  }

  async processBatch(
    jobId: string,
    orgId: number,
    batch: BatchItem<StudentImport>[],
    userId: number,
    userEmail: string,
    fileName: string
  ): Promise<BatchResponse> {
    const batchResponse: BatchResponse = {
      successCount: 0,
      errorDetails: [],
    };
    try {
      const request: ImportStudentRequest = {
        orgId,
        students: batch.map((item) => item.data),
        createdBy: userId,
        email: userEmail,
        fileName,
      };

      const response = await lastValueFrom(
        this.studentService.importStudents(request)
      );

      // Handle any failures in the batch
      response.results.forEach((result, index) => {
        if (!result.success) {
          batchResponse.errorDetails.push({
            line: batch[index].line,
            // data: batch[index].data,
            error: result.message,
          });
        } else {
          batchResponse.successCount++;
        }
      });
    } catch (error) {
      this.logger.error("Entire Batch Failed", error);
      // If the entire batch fails, add all students to error details
      batch.forEach((item) => {
        batchResponse.errorDetails.push({
          line: item.line,
          // data: item.data,
          error: error.message,
        });
      });
    }
    return batchResponse;
  }
}
