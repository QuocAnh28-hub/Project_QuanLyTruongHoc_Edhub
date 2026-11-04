import {IsInt, Min} from "class-validator";
import {Type} from "class-transformer";
import {AppValidationException} from "@gedu/shared";

export class GetWardsCommunesQueryDto {
   @IsInt({ message: AppValidationException.INVALID_PROVINCE_ID })
   @Min(1, { message: AppValidationException.INVALID_PROVINCE_ID_TOO_LOW })
   @Type(() => Number)
   provincesCitiesId: number;
}