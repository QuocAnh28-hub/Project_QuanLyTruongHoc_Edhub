// common/exceptions/validation-app.exception.ts
import { BadRequestException } from "@nestjs/common";

export class ClassValidationException extends BadRequestException {
  constructor(public validationErrors: string[]) {
    super({
      message: validationErrors,
      type: "class-validator",
    });
  }
}