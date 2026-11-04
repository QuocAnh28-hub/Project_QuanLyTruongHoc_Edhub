import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { Injectable } from "@nestjs/common";

@ValidatorConstraint({ name: 'IsNumberText', async: true })
@Injectable()
export class NumberTextValidator implements ValidatorConstraintInterface {
	constructor() { }

	async validate(value: any, args: ValidationArguments) {
		const asNum = Number(value);
		return !Number.isNaN(asNum);
	}

	defaultMessage(args: ValidationArguments) {
		const [property] = args.constraints;
		return `${property} "${args.value}" must be number.`;
	}
}