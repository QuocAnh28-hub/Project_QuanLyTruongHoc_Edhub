import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'IsNotContainSpecialCharacter', async: false })
@Injectable()
export class SpecialCharacterValidator implements ValidatorConstraintInterface {
  validate(value: string, _args: ValidationArguments): boolean {
    if (typeof value !== 'string') return false;

    return /^[a-zA-Z0-9\- \u00C0-\u1EF9]*$/.test(value);
  }

  defaultMessage(args: ValidationArguments): string {
    return `"${args.property}" contains invalid special characters: "${args.value}"`;
  }
}
