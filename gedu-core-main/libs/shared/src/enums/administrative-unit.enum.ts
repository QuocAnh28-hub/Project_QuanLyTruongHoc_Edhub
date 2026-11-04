export enum AdministrativeUnit {
  PROVINCE = "province",
  DISTRICT = "district",
  WARD = "ward",
}

export type AdministrativeUnitUnion = `${AdministrativeUnit}`;

export enum ProvinceType {
  MUNICIPALITY = "municipality",
  PROVINCE = "province",
}

export enum SoapProvinceType {
  THANH_PHO_TRUNG_UONG = "MUNICIPALITY",
  TINH = "PROVINCE",
}

export enum DistrictType {
  CITY = "city",
  URBAN_DISTRICT = "urban_district",
  DISTRICT = "district",
  DISTRICT_LEVEL_TOWN = "district_level_town",
}

export enum SoapDistrictType {
  THANH_PHO = "CITY",
  QUAN = "URBAN_DISTRICT",
  HUYEN = "DISTRICT",
  THI_XA = "DISTRICT_LEVEL_TOWN",
}

export class SOAPProvince {
  code!: number;
  name!: string;
  type!: ProvinceType;
}

export class SOAPDistrict {
  code!: number;
  name!: string;
  type!: DistrictType;
  provinceCode!: number;
}

export class SOAPWard {
  code!: number;
  name!: string;
  districtCode!: number;
}
export class AdministrativeUnitJson<T> {
  updatedAt!: Date;
  data!: T[];
}