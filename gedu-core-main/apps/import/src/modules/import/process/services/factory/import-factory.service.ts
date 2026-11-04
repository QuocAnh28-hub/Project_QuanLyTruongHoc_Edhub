import { StaffProcessor } from "../../processors/staff.process";
import { Injectable, Logger } from "@nestjs/common";
import { ImportProcessor, ImportType } from "../../../types/import.types";
import { SchoolProcessor } from "../../processors/school.processor";
import { StudentProcessor } from "../../processors/student.process";

/**
 * Factory service for managing and retrieving import processors based on import type.
 * Registers processors during construction and provides lookup functionality.
 */
@Injectable()
export class ImportFactoryService {
  private readonly logger = new Logger(ImportFactoryService.name);
  private readonly processors = new Map<ImportType, ImportProcessor>();
  /**
   * Constructor that registers all available import processors.
   * @param schoolProcessor - Processor for school import operations
   * @param staffProcessor - Processor for staff import operations  
   * @param studentProcessor - Processor for student import operations
   */
  
  constructor(
    private readonly schoolProcessor: SchoolProcessor,
    private readonly staffProcessor: StaffProcessor,
    // Add other processors here as they are created
    private readonly studentProcessor: StudentProcessor,
    // private readonly teacherProcessor: TeacherImportProcessor,
  ) {
    this.registerProcessor(this.schoolProcessor);
    this.registerProcessor(this.staffProcessor);
    // Register other processors as they are created
    this.registerProcessor(this.studentProcessor);
    // this.registerProcessor(this.teacherProcessor);
  }

  private registerProcessor(processor: ImportProcessor): void {
    this.processors.set(processor.type, processor);
    this.logger.log(`Registered processor for type: ${processor.type}`);
  }
  /**
   * Retrieves a registered processor for the specified import type.
   * @param type - The import type to get processor for
   * @returns The registered processor instance
   * @throws Error if no processor is registered for the given type
   */
  
  getProcessor(type: ImportType): ImportProcessor {
    const processor = this.processors.get(type);
    if (!processor) {
      throw new Error(`No processor registered for import type: ${type}`);
    }
    return processor;
  }
}
