import {
  formatDate,
  removeVietnameseDiacritics,
  renameVietnameseDistrictToEnglish,
  renameVietnameseProvinceToEnglish,
} from '@gedu/shared';
import { AdministrativeUnitJson, AdministrativeUnitUnion, DATE_FORMATS, SOAPDistrict, DistrictType, SOAPProvince, ProvinceType, SoapProvinceType, SOAPWard } from '@gedu/shared';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as xml2js from 'xml2js';
import { SoapDistrictResponseDto, SoapProvinceResponseDto, SoapWardResponseDto } from '../dto/administrative-unit.response';

export class AdministrativeUnitSoapService {
  constructor() {}

  private readonly soapUrl = 'https://danhmuchanhchinh.gso.gov.vn/DMDVHC.asmx';
  private readonly defaultNamespace = 'http://tempuri.org/';

  async getSoapAdministrativeUnits(
    soapAction: AdministrativeUnitUnion,
  ): Promise<SOAPProvince[] | SOAPDistrict[]> {
    const actionElement = this.getSoapAction(soapAction);
    const today = formatDate(new Date(), DATE_FORMATS.DATE_FORMAT);

    const soapBodyForRequest = `<?xml version="1.0" encoding="utf-8"?>
      <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
        <soap12:Body>
          <${actionElement} xmlns="${this.defaultNamespace}">
          <DenNgay>${today}</DenNgay>
          </${actionElement}>
        </soap12:Body>
      </soap12:Envelope>`;

    const response = await axios.post(this.soapUrl, soapBodyForRequest, {
      headers: {
        'Content-Type': 'application/soap+xml; charset=utf-8',
      },
    });

    const jsonResponse = await xml2js.parseStringPromise(response.data, {
      explicitArray: false,
    });

    const soapBody = jsonResponse?.['soap:Envelope']?.['soap:Body'];
    const responseKey = `${this.getSoapAction(soapAction)}Response`;
    const resultKey = `${this.getSoapAction(soapAction)}Result`;
    const result = soapBody?.[responseKey]?.[resultKey];
    const diffgram = result?.['diffgr:diffgram'];
    const table = diffgram?.['DocumentElement']?.['TABLE'];

    if (!table || !Array.isArray(table)) {
      throw new Error('No data found in the SOAP response');
    }

    if (soapAction === 'province') {
      const provinces = await this.formatProvinces(
        table as SoapProvinceResponseDto[],
      );

      const provinceData: AdministrativeUnitJson<SOAPProvince> = {
        updatedAt: new Date(),
        data: provinces,
      };

      const filePath = this.getFilePath('provinces.json');
      this.writeJsonFile(filePath, provinceData);

      return provinces;
    }

    if (soapAction === 'district') {
      const districts = await this.formatDistricts(
        table as SoapDistrictResponseDto[],
      );

      const districtData: AdministrativeUnitJson<SOAPDistrict> = {
        updatedAt: new Date(),
        data: districts.map((district) => ({
          ...district,
          name: district.name.replace(/'/g, "''"),
        })),
      };

      const filePath = this.getFilePath('districts.json');
      this.writeJsonFile(filePath, districtData);

      return districts;
    }

    if (soapAction === 'ward') {
      const wards = await this.parseSOAPAndWriteWards(
        table as SoapWardResponseDto[],
      );

      const wardData: AdministrativeUnitJson<SOAPWard> = {
        updatedAt: new Date(),
        data: wards.map((ward) => ({
          name: ward.tenPhuongXa.replace(/'/g, "''"),
          code: Number(ward.maPhuongXa),

          districtCode: Number(ward.maQuanHuyen),
        })),
      };

      const filePath = this.getFilePath('wards.json');
      fs.writeFileSync(
        filePath,
        JSON.stringify(wardData, null, 2),
        'utf-8',
      );

      return [];
    }

    return [];
  }

  private parseSOAPAndWriteWards = async (tables: SoapWardResponseDto[]) => {
    if (!tables) throw new Error('No ward data found');

    const wards = Array.isArray(tables) ? tables : [tables];

    return wards.map((ward) => ({
      maTinh: ward.MaTinh,
      tenTinh: ward.TenTinh,
      maQuanHuyen: ward.MaQuanHuyen,
      tenQuanHuyen: ward.TenQuanHuyen,
      maPhuongXa: ward.MaPhuongXa,
      tenPhuongXa: ward.TenPhuongXa,
      loaiHinh: ward.LoaiHinh,
    }));
  };

  private getSoapAction(soapAction: AdministrativeUnitUnion): string {
    if (soapAction === 'province') return 'DanhMucTinh';
    if (soapAction === 'district') return 'DanhMucQuanHuyen';
    return 'DanhMucPhuongXa';
  }

  private async formatDistricts(table: SoapDistrictResponseDto[]) {
    const districtMap: { [key: number]: SOAPDistrict } = {};

    table.forEach((district) => {
      const districtCode = Number(district.MaQuanHuyen);

      if (!districtMap[districtCode]) {
        const districtTypeKey = removeVietnameseDiacritics(
          district.LoaiHinh || '',
        )
          .replaceAll(' ', '_')
          .toUpperCase() as keyof typeof DistrictType;

        const formattedDistrictType: DistrictType =
          DistrictType[districtTypeKey] ?? DistrictType.DISTRICT;

        districtMap[districtCode] = {
          code: districtCode,
          name: renameVietnameseDistrictToEnglish(district.TenQuanHuyen),
          type: formattedDistrictType,
          provinceCode: Number(district.MaTinh),
        };
      }
    });

    return Object.values(districtMap);
  }

  private getFilePath(fileName: `${'provinces' | 'districts' | 'wards'}.json`): string {
    return path.join(
      process.cwd(),
      'prisma',
      'data',
      fileName,
    );
  }

  private async formatProvinces(table: SoapProvinceResponseDto[]) {
    const provinceMap: { [key: number]: SOAPProvince } = {};

    table.forEach((province) => {
      const provinceCode = Number(province.MaTinh);
      if (!provinceMap[provinceCode]) {
        const provinceTypeKey = removeVietnameseDiacritics(province.LoaiHinh)
          .replaceAll(' ', '_')
          .toUpperCase() as keyof typeof SoapProvinceType;

        const formattedProvinceType: ProvinceType =
          (SoapProvinceType[provinceTypeKey] as unknown as ProvinceType) ?? ProvinceType.PROVINCE;

        provinceMap[provinceCode] = {
          code: provinceCode,
          name: renameVietnameseProvinceToEnglish(province.TenTinh),
          type: formattedProvinceType,
        };
      }
    });

    return Object.values(provinceMap);
  }

  private writeJsonFile(
    filePath: string,
    data: AdministrativeUnitJson<SOAPProvince | SOAPDistrict>,
  ) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  }
}
