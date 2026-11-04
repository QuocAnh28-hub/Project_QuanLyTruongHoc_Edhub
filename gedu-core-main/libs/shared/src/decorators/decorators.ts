import { registerDecorator, ValidationOptions } from 'class-validator';
import { NumberTextValidator } from "../validators/number.text.validator";
import { SpecialCharacterValidator } from "../validators/special.character.validator";

export function IsNumberText(validationOptions?: ValidationOptions) {
	return function (object: object, propertyName: string) {
		registerDecorator({
			name: 'IsNumberText',
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: NumberTextValidator,
		});
	};
}

export function IsNotContainSpecialCharacter(validationOptions?: ValidationOptions) {
	return function (object: object, propertyName: string) {
		registerDecorator({
			name: 'IsNotContainSpecialCharacter',
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: SpecialCharacterValidator,
		});
	};
}