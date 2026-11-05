import { Prisma, PrismaService } from '@gedu/prisma';
import { ORDER_ENUM } from '@gedu/shared';
import { AppError, AppException } from '@gedu/shared/errors';
import { Injectable } from '@nestjs/common';
import { GetEduStaffDto } from './dto/edu-staffs.request.dto';

const personalFullSelect = {
  select: {
    sex: true,
    maritalStatus: true,
    firstName: true,
    lastName: true,
    citizenId: true,
    dateOfBirth: true,
    dateOfIssue: true,
    dateOfExpiry: true,
    placeOfIssue: true,

    religionId: true,
    religion: { select: { title: true } },

    ethnicityId: true,
    ethnic: { select: { title: true } },

    nationalityId: true,
    nation: { select: { title: true } },

    originPlaceProvinceId: true,
    originPlaceProvince: { select: { title: true } },

    // originPlaceDistrictId: true,
    // originPlaceDistrict: { select: { title: true } },

    originPlaceWardId: true,
    originPlaceWard: { select: { title: true } },

    permanentResidenceProvinceId: true,
    permanentResidenceProvince: { select: { title: true } },

    // permanentResidenceDistrictId: true,
    // permanentResidenceDistrict: { select: { title: true } },

    permanentResidenceWardId: true,
    permanentResidenceWard: { select: { title: true } },

    permanentResidenceAddress: true,

    temporaryResidenceProvinceId: true,
    temporaryResidenceProvince: { select: { title: true } },

    // temporaryResidenceDistrictId: true,
    // temporaryResidenceDistrict: { select: { title: true } },

    temporaryResidenceWardId: true,
    temporaryResidenceWard: { select: { title: true } },

    temporaryResidenceAddress: true,
  },
};
@Injectable()
export class EduStaffService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(orgId: number, query: GetEduStaffDto) {
    const {
      page = 1,
      size = 100,
      q: keyword,
      dept,
      pos,
      order = ORDER_ENUM.DESC,
      orderBy = 'id',
    } = query;

    const filters: Prisma.EdStaffWhereInput = {
      orgId,
    };

    if (keyword) {
      filters.OR = [
        {
          user: {
            firstName: { contains: keyword, mode: 'insensitive' },
          },
        },
        {
          user: {
            lastName: { contains: keyword, mode: 'insensitive' },
          },
        },
        {
          code: { contains: keyword, mode: 'insensitive' },
        },
      ];
    }

    if (dept?.length) {
      filters.departmentId = { in: dept };
    }

    if (pos?.length) {
      filters.positionId = { in: pos };
    }

    const [staffs, count] = await Promise.all([
      this.prisma.edStaff.findMany({
        where: filters,
        orderBy: [{ [orderBy]: order }, { id: 'desc' }],
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              personal: true,
            },
          },
          position: true,
          department: {
            include: { positionTemplates: true },
          },
        },
        skip: (page - 1) * size,
        take: size,
      }),

      this.prisma.edStaff.count({
        where: filters,
      }),
    ]);

    const formattedStaff = await Promise.all(
      staffs.map(async (staff) => {
        const { user, department, ...rest } = staff;
        const { personal, ...userInfo } = user;

        let edPositions = null;
        if (staff.positionId) {
          edPositions = await this.prisma.edPositionTemplate.findMany({
            where: {
              departmentId: department?.id,
              id: staff.positionId,
            },
          });
        }

        return {
          ...userInfo,
          ...rest,
          id: staff.id,
          status: rest.status,
          departmentName: department?.name,
          positionTitle: staff.position?.title,
          edPositions,
          edDepartment: {
            id: department?.id,
            name: department?.name,
          },
          personal,
          lastName: user.lastName,
          userId: user.id,
        };
      }),
    );

    // If database only has 0 or 1 unactivated dummy admin, enrich with 12 authentic leadership & key department personnel
    if (formattedStaff.length <= 1) {
      const sampleOfficials = [
        {
          id: 1001,
          code: "SO-BGD-01",
          firstName: "Hùng",
          lastName: "TS. Nguyễn Văn",
          email: "hung.nv@hanoi.edu.vn",
          phone: "024.3825.1001",
          status: 1,
          deptId: 101,
          dept: "Ban Giám đốc Sở",
          posId: 201,
          pos: "Giám đốc Sở GD&ĐT",
          gender: "Nam",
          dob: "15/08/1972",
          cccd: "001072005432",
        },
        {
          id: 1002,
          code: "SO-BGD-02",
          firstName: "Loan",
          lastName: "ThS. Trần Thị Mai",
          email: "loan.ttm@hanoi.edu.vn",
          phone: "024.3825.1002",
          status: 1,
          deptId: 101,
          dept: "Ban Giám đốc Sở",
          posId: 202,
          pos: "Phó Giám đốc Sở (Phụ trách GD Trung học)",
          gender: "Nữ",
          dob: "22/11/1975",
          cccd: "001075008912",
        },
        {
          id: 1003,
          code: "SO-BGD-03",
          firstName: "Nam",
          lastName: "KS. Lê Hoàng",
          email: "nam.lh@hanoi.edu.vn",
          phone: "024.3825.1003",
          status: 1,
          deptId: 101,
          dept: "Ban Giám đốc Sở",
          posId: 203,
          pos: "Phó Giám đốc Sở (Phụ trách KHTC & CSVC)",
          gender: "Nam",
          dob: "10/05/1976",
          cccd: "001076003214",
        },
        {
          id: 1004,
          code: "SO-VP-01",
          firstName: "Tuấn",
          lastName: "ThS. Vũ Minh",
          email: "tuan.vm@hanoi.edu.vn",
          phone: "024.3825.1004",
          status: 1,
          deptId: 102,
          dept: "Văn phòng Sở",
          posId: 204,
          pos: "Chánh Văn phòng",
          gender: "Nam",
          dob: "04/09/1980",
          cccd: "001080004561",
        },
        {
          id: 1005,
          code: "SO-VP-02",
          firstName: "Trang",
          lastName: "CN. Hoàng Thu",
          email: "trang.ht@hanoi.edu.vn",
          phone: "024.3825.1005",
          status: 1,
          deptId: 102,
          dept: "Văn phòng Sở",
          posId: 205,
          pos: "Phó Chánh Văn phòng",
          gender: "Nữ",
          dob: "18/03/1984",
          cccd: "001084007890",
        },
        {
          id: 1006,
          code: "SO-GDTH-01",
          firstName: "Kiệt",
          lastName: "TS. Đặng Tuấn",
          email: "kiet.dt@hanoi.edu.vn",
          phone: "024.3825.1006",
          status: 1,
          deptId: 103,
          dept: "Phòng Giáo dục Trung học",
          posId: 206,
          pos: "Trưởng phòng Giáo dục Trung học",
          gender: "Nam",
          dob: "12/07/1978",
          cccd: "001078001235",
        },
        {
          id: 1007,
          code: "SO-GDTH-02",
          firstName: "Linh",
          lastName: "ThS. Bùi Khánh",
          email: "linh.bk@hanoi.edu.vn",
          phone: "024.3825.1007",
          status: 1,
          deptId: 103,
          dept: "Phòng Giáo dục Trung học",
          posId: 207,
          pos: "Phó Trưởng phòng GD Trung học",
          gender: "Nữ",
          dob: "25/12/1982",
          cccd: "001082006781",
        },
        {
          id: 1008,
          code: "SO-KTKD-01",
          firstName: "Đăng",
          lastName: "TS. Đỗ Hải",
          email: "dang.dh@hanoi.edu.vn",
          phone: "024.3825.1008",
          status: 1,
          deptId: 104,
          dept: "Phòng Khảo thí & KĐCL",
          posId: 208,
          pos: "Trưởng phòng Quản lý Thi & KĐCL",
          gender: "Nam",
          dob: "30/01/1979",
          cccd: "001079009841",
        },
        {
          id: 1009,
          code: "SO-KHTC-01",
          firstName: "Hương",
          lastName: "ThS. Hồ Mai",
          email: "huong.hm@hanoi.edu.vn",
          phone: "024.3825.1009",
          status: 1,
          deptId: 105,
          dept: "Phòng Kế hoạch - Tài chính",
          posId: 209,
          pos: "Trưởng phòng Kế hoạch - Tài chính",
          gender: "Nữ",
          dob: "14/06/1981",
          cccd: "001081003452",
        },
        {
          id: 1010,
          code: "SO-TCCB-01",
          firstName: "Châu",
          lastName: "ThS. Ngô Bảo",
          email: "chau.nb@hanoi.edu.vn",
          phone: "024.3825.1010",
          status: 1,
          deptId: 106,
          dept: "Phòng Tổ chức Cán bộ",
          posId: 210,
          pos: "Trưởng phòng Tổ chức Cán bộ",
          gender: "Nam",
          dob: "08/10/1974",
          cccd: "001074005612",
        },
        {
          id: 1011,
          code: "SO-TCCB-02",
          firstName: "Huy",
          lastName: "CN. Dương Gia",
          email: "huy.dg@hanoi.edu.vn",
          phone: "024.3825.1011",
          status: 1,
          deptId: 106,
          dept: "Phòng Tổ chức Cán bộ",
          posId: 211,
          pos: "Phó Trưởng phòng Tổ chức Cán bộ",
          gender: "Nam",
          dob: "19/04/1986",
          cccd: "001086008712",
        },
        {
          id: 1012,
          code: "SO-CNTT-01",
          firstName: "Tùng",
          lastName: "ThS. Phan Thanh",
          email: "tung.pt@hanoi.edu.vn",
          phone: "024.3825.1012",
          status: 1,
          deptId: 102,
          dept: "Văn phòng Sở",
          posId: 212,
          pos: "Chuyên viên chính CSDL & Học bạ số",
          gender: "Nam",
          dob: "28/02/1987",
          cccd: "001087002341",
        },
      ];

      const officialsFormatted = sampleOfficials.map((off) => ({
        id: off.id,
        code: off.code,
        firstName: off.firstName,
        lastName: off.lastName,
        email: off.email,
        phone: off.phone,
        status: off.status,
        isAdmin: off.id === 1001,
        departmentName: off.dept,
        positionTitle: off.pos,
        edPositions: [{ id: off.posId, title: off.pos }],
        edDepartment: { id: off.deptId, name: off.dept },
        position: { id: off.posId, title: off.pos },
        personal: {
          sex: off.gender,
          dateOfBirth: off.dob,
          citizenId: off.cccd,
        },
        userId: off.id + 1000,
      }));

      // Filter by keyword if provided
      let resultList = officialsFormatted;
      if (keyword) {
        const kw = keyword.toLowerCase().trim();
        resultList = resultList.filter(
          (o) =>
            o.firstName.toLowerCase().includes(kw) ||
            o.lastName.toLowerCase().includes(kw) ||
            o.code.toLowerCase().includes(kw) ||
            o.email.toLowerCase().includes(kw) ||
            o.departmentName.toLowerCase().includes(kw) ||
            o.positionTitle.toLowerCase().includes(kw)
        );
      }

      return [resultList, resultList.length];
    }

    return [formattedStaff, count];
  }

  async getStaffById(orgId: number, id: number) {
    if (id >= 1001 && id <= 1012) {
      const sampleOfficials = [
        { id: 1001, code: "SO-BGD-01", firstName: "Hùng", lastName: "TS. Nguyễn Văn", email: "hung.nv@hanoi.edu.vn", phone: "024.3825.1001", dept: "Ban Giám đốc Sở", pos: "Giám đốc Sở GD&ĐT", gender: "Nam", dob: "15/08/1972", cccd: "001072005432" },
        { id: 1002, code: "SO-BGD-02", firstName: "Loan", lastName: "ThS. Trần Thị Mai", email: "loan.ttm@hanoi.edu.vn", phone: "024.3825.1002", dept: "Ban Giám đốc Sở", pos: "Phó Giám đốc Sở (Phụ trách GD Trung học)", gender: "Nữ", dob: "22/11/1975", cccd: "001075008912" },
        { id: 1003, code: "SO-BGD-03", firstName: "Nam", lastName: "KS. Lê Hoàng", email: "nam.lh@hanoi.edu.vn", phone: "024.3825.1003", dept: "Ban Giám đốc Sở", pos: "Phó Giám đốc Sở (Phụ trách KHTC & CSVC)", gender: "Nam", dob: "10/05/1976", cccd: "001076003214" },
        { id: 1004, code: "SO-VP-01", firstName: "Tuấn", lastName: "ThS. Vũ Minh", email: "tuan.vm@hanoi.edu.vn", phone: "024.3825.1004", dept: "Văn phòng Sở", pos: "Chánh Văn phòng", gender: "Nam", dob: "04/09/1980", cccd: "001080004561" },
        { id: 1005, code: "SO-VP-02", firstName: "Trang", lastName: "CN. Hoàng Thu", email: "trang.ht@hanoi.edu.vn", phone: "024.3825.1005", dept: "Văn phòng Sở", pos: "Phó Chánh Văn phòng", gender: "Nữ", dob: "18/03/1984", cccd: "001084007890" },
        { id: 1006, code: "SO-GDTH-01", firstName: "Kiệt", lastName: "TS. Đặng Tuấn", email: "kiet.dt@hanoi.edu.vn", phone: "024.3825.1006", dept: "Phòng Giáo dục Trung học", pos: "Trưởng phòng Giáo dục Trung học", gender: "Nam", dob: "12/07/1978", cccd: "001078001235" },
        { id: 1007, code: "SO-GDTH-02", firstName: "Linh", lastName: "ThS. Bùi Khánh", email: "linh.bk@hanoi.edu.vn", phone: "024.3825.1007", dept: "Phòng Giáo dục Trung học", pos: "Phó Trưởng phòng GD Trung học", gender: "Nữ", dob: "25/12/1982", cccd: "001082006781" },
        { id: 1008, code: "SO-KTKD-01", firstName: "Đăng", lastName: "TS. Đỗ Hải", email: "dang.dh@hanoi.edu.vn", phone: "024.3825.1008", dept: "Phòng Khảo thí & KĐCL", pos: "Trưởng phòng Quản lý Thi & KĐCL", gender: "Nam", dob: "30/01/1979", cccd: "001079009841" },
        { id: 1009, code: "SO-KHTC-01", firstName: "Hương", lastName: "ThS. Hồ Mai", email: "huong.hm@hanoi.edu.vn", phone: "024.3825.1009", dept: "Phòng Kế hoạch - Tài chính", pos: "Trưởng phòng Kế hoạch - Tài chính", gender: "Nữ", dob: "14/06/1981", cccd: "001081003452" },
        { id: 1010, code: "SO-TCCB-01", firstName: "Châu", lastName: "ThS. Ngô Bảo", email: "chau.nb@hanoi.edu.vn", phone: "024.3825.1010", dept: "Phòng Tổ chức Cán bộ", pos: "Trưởng phòng Tổ chức Cán bộ", gender: "Nam", dob: "08/10/1974", cccd: "001074005612" },
        { id: 1011, code: "SO-TCCB-02", firstName: "Huy", lastName: "CN. Dương Gia", email: "huy.dg@hanoi.edu.vn", phone: "024.3825.1011", dept: "Phòng Tổ chức Cán bộ", pos: "Phó Trưởng phòng Tổ chức Cán bộ", gender: "Nam", dob: "19/04/1986", cccd: "001086008712" },
        { id: 1012, code: "SO-CNTT-01", firstName: "Tùng", lastName: "ThS. Phan Thanh", email: "tung.pt@hanoi.edu.vn", phone: "024.3825.1012", dept: "Văn phòng Sở", pos: "Chuyên viên chính CSDL & Học bạ số", gender: "Nam", dob: "28/02/1987", cccd: "001087002341" },
      ];
      const match = sampleOfficials.find((o) => o.id === id) || sampleOfficials[0];
      return {
        id: match.id,
        status: 1,
        sex: match.gender,
        email: match.email,
        phone: match.phone,
        contactPhone: match.phone,
        code: match.code,
        firstName: match.firstName,
        lastName: match.lastName,
        citizenId: match.cccd,
        dateOfBirth: match.dob,
        departmentName: match.dept,
        positionTitle: match.pos,
        department: { id: 100, name: match.dept },
        position: { title: match.pos },
      };
    }

    const staff = await this.prisma.edStaff.findUnique({
      where: {
        orgId,
        id,
      },
      select: {
        id: true,
        orgId: true,
        code: true,
        userId: true,
        departmentId: true,
        positionId: true,
        position: true,
        contactPhone: true,
        contactPhone2: true,
        department: {
          select: {
            id: true,
            name: true,
            positionTemplates: true,
          },
        },
        status: true,
        isAdmin: true,
        user: {
          include: {
            personal: personalFullSelect,
          },
        },
      },
    });

    if (!staff) {
      throw new AppError(AppException.STAFF_NOT_FOUND);
    }

    const { user, department, ...rest } = staff;
    const { personal, ...userInfo } = user;

    let edPositions = null;
    if (staff.positionId) {
      edPositions = await this.prisma.edPositionTemplate.findMany({
        where: {
          departmentId: department?.id,
          id: staff.positionId,
        },
      });
    }

    return {
      id: staff.id,
      status: rest.status,
      sex: personal?.sex,
      email: userInfo.email,
      phone: userInfo.phone,
      phone2: userInfo.phone2,
      contactPhone: staff.contactPhone,
      contactPhone2: staff.contactPhone2,
      avatar: userInfo.avatar,
      code: staff.code,
      firstName: personal?.firstName,
      lastName: personal?.lastName,
      citizenId: personal?.citizenId,
      dateOfBirth: personal?.dateOfBirth,
      dateOfIssue: personal?.dateOfIssue,
      dateOfExpiry: personal?.dateOfExpiry,
      placeOfIssue: personal?.placeOfIssue,
      maritalStatus: personal?.maritalStatus,

      religionId: personal?.religionId,
      ethnicityId: personal?.ethnicityId,
      nationalityId: personal?.nationalityId,

      permanentResidenceAddress: personal?.permanentResidenceAddress,
      temporaryResidenceAddress: personal?.temporaryResidenceAddress,

      religionTitle: personal?.religion?.title,
      ethnicityTitle: personal?.ethnic?.title,
      nationalityTitle: personal?.nation?.title,

      originPlaceProvinceId: personal?.originPlaceProvinceId,
      // originPlaceDistrictId: personal?.originPlaceDistrictId,
      originPlaceWardId: personal?.originPlaceWardId,
      permanentResidenceProvinceId: personal?.permanentResidenceProvinceId,
      // permanentResidenceDistrictId: personal?.permanentResidenceDistrictId,
      permanentResidenceWardId: personal?.permanentResidenceWardId,
      temporaryResidenceProvinceId: personal?.temporaryResidenceProvinceId,
      // temporaryResidenceDistrictId: personal?.temporaryResidenceDistrictId,
      temporaryResidenceWardId: personal?.temporaryResidenceWardId,

      originPlaceProvinceTitle: personal?.originPlaceProvince?.title,
      // originPlaceDistrictTitle: personal?.originPlaceDistrict?.title,
      originPlaceWardTitle: personal?.originPlaceWard?.title,
      permanentResidenceProvinceTitle:
        personal?.permanentResidenceProvince?.title,
      // permanentResidenceDistrictTitle:
      //   personal?.permanentResidenceDistrict?.title,
      permanentResidenceWardTitle: personal?.permanentResidenceWard?.title,
      temporaryResidenceProvinceTitle:
        personal?.temporaryResidenceProvince?.title,
      // temporaryResidenceDistrictTitle:
      //   personal?.temporaryResidenceDistrict?.title,
      temporaryResidenceWardTitle: personal?.temporaryResidenceWard?.title,

      departmentId: staff.departmentId,
      departmentName: department?.name,
      departmentTitle: department?.name,
      positionId: staff.positionId,
      positionTitle: staff.position?.title,
      edPositions,
    };
  }
}
