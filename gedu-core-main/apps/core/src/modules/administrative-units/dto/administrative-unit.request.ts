import { SearchBaseDto } from "@gedu/shared";
import { PickType } from "@nestjs/mapped-types";
import { IsNotEmpty } from "class-validator";
import { Type } from "class-transformer";

export class DistrictRequestDto extends PickType(SearchBaseDto, ["q"]) {
  @Type(() => Number)
  @IsNotEmpty()
  provinceId: number;
}
export class WardRequestDto extends PickType(SearchBaseDto, ["q"]) {
  @Type(() => Number)
  @IsNotEmpty()
  districtId: number;
}

export class ProvinceRequestDto extends PickType(SearchBaseDto, ["q"]) {}