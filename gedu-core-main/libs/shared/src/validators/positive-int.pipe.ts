import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

/**
 *  Pipe that validates and transforms a value to a positive integer.
 *  Throws BadRequestException if the value is not a positive integer.
 */
@Injectable()
export class PositiveIntPipe implements PipeTransform {
  transform(value: string | number): number {
    const val = parseInt(value.toString(), 10);
    if (isNaN(val) || val <= 0) {
      throw new BadRequestException(
        `Invalid value "${value}": ID must be a positive integer`,
      );
    }
    return val;
  }
}
