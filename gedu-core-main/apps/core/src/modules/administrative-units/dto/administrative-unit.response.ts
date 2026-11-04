export class SoapProvinceResponseDto {
  $: unknown;
  MaTinh: string;
  TenTinh: string;
  LoaiHinh: string;
}

export class SoapDistrictResponseDto extends SoapProvinceResponseDto {
  MaQuanHuyen: string;
  TenQuanHuyen: string;
}

export class SoapWardResponseDto extends SoapDistrictResponseDto {
  MaPhuongXa: string;
  TenPhuongXa: string;
}