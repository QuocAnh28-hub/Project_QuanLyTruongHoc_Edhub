import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@gedu/prisma';

@Injectable()
export class ExportsService {
  constructor(private readonly prisma: PrismaService) {}

  private escapeCsv(val: any): string {
    if (val === null || val === undefined) return '';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  }

  async exportClassStudents(orgId: number, classId: number): Promise<{ filename: string; content: string }> {
    const cls = await this.prisma.class.findFirst({
      where: { id: classId, orgId },
      include: {
        schoolYear: true,
      },
    });

    if (!cls) {
      throw new NotFoundException(`Lớp học #${classId} không tồn tại`);
    }

    const students = await this.prisma.studentClass.findMany({
      where: { orgId, classId, status: { in: [1, 2] } },
      include: {
        student: {
          include: {
            user: {
              include: { personal: true },
            },
          },
        },
      },
      orderBy: [
        { student: { user: { lastName: 'asc' } } },
        { student: { user: { firstName: 'asc' } } },
      ],
    });

    const headers = [
      'STT',
      'Mã học sinh',
      'Họ đệm',
      'Tên',
      'Họ và tên đầy đủ',
      'Ngày sinh',
      'Giới tính',
      'Số điện thoại',
      'Trạng thái',
    ];

    const rows: string[] = [];
    rows.push(headers.map((h) => this.escapeCsv(h)).join(','));

    students.forEach((sc, idx) => {
      const u = sc.student.user;
      const p = u?.personal;
      const dob = p?.dateOfBirth ? new Date(p.dateOfBirth).toLocaleDateString('vi-VN') : '';
      const gender = p?.sex === 1 ? 'Nam' : p?.sex === 2 ? 'Nữ' : 'Khác';

      rows.push(
        [
          idx + 1,
          this.escapeCsv(sc.student.code ?? ''),
          this.escapeCsv(u?.lastName ?? ''),
          this.escapeCsv(u?.firstName ?? ''),
          this.escapeCsv(`${u?.lastName ?? ''} ${u?.firstName ?? ''}`.trim()),
          this.escapeCsv(dob),
          this.escapeCsv(gender),
          this.escapeCsv(u?.phone ?? ''),
          this.escapeCsv('Đang học'),
        ].join(','),
      );
    });

    // Add BOM for Excel compatibility with Vietnamese UTF-8
    const content = '\uFEFF' + rows.join('\r\n');
    const filename = `Danh_sach_lop_${cls.name.replace(/\s+/g, '_')}.csv`;

    return { filename, content };
  }

  async exportScoreboard(
    orgId: number,
    classId: number,
    subjectId: number,
    schoolYearId: number,
    semesterId: number,
  ): Promise<{ filename: string; content: string }> {
    const [cls, subject] = await Promise.all([
      this.prisma.class.findFirst({ where: { id: classId, orgId } }),
      this.prisma.subject.findFirst({ where: { id: subjectId, orgId } }),
    ]);

    if (!cls || !subject) {
      throw new NotFoundException('Lớp học hoặc Môn học không tồn tại');
    }

    const students = await this.prisma.studentClass.findMany({
      where: { orgId, classId, status: { in: [1, 2] } },
      include: {
        student: {
          include: {
            user: true,
          },
        },
      },
      orderBy: [
        { student: { user: { lastName: 'asc' } } },
        { student: { user: { firstName: 'asc' } } },
      ],
    });

    const [scores, summaries] = await Promise.all([
      this.prisma.scoreEntry.findMany({
        where: { orgId, classId, subjectId, schoolYearId, semesterId },
      }),
      this.prisma.subjectSemesterSummary.findMany({
        where: { orgId, classId, subjectId, schoolYearId, semesterId },
      }),
    ]);

    const summaryMap = new Map<number, any>();
    for (const sm of summaries) summaryMap.set(sm.studentId, sm);

    const scoresMap = new Map<number, any[]>();
    for (const se of scores) {
      if (!scoresMap.has(se.studentId)) scoresMap.set(se.studentId, []);
      scoresMap.get(se.studentId)!.push(se);
    }

    const headers = [
      'STT',
      'Mã học sinh',
      'Họ và tên',
      'Điểm miệng (TX1)',
      'Điểm 15P (TX2)',
      'Điểm 1 Tiết (TX3)',
      'Điểm Giữa kỳ (GK)',
      'Điểm Cuối kỳ (CK)',
      'Điểm TB Môn',
      'Đánh giá',
    ];

    const rows: string[] = [];
    rows.push(headers.map((h) => this.escapeCsv(h)).join(','));

    students.forEach((sc, idx) => {
      const studentId = sc.student.id;
      const u = sc.student.user;
      const studentScores = scoresMap.get(studentId) || [];
      const summary = summaryMap.get(studentId);

      const oral = studentScores.find((s) => s.scoreType === 1)?.scoreValue ?? '';
      const tx2 = studentScores.find((s) => s.scoreType === 2)?.scoreValue ?? '';
      const tx3 = studentScores.find((s) => s.scoreType === 3)?.scoreValue ?? '';
      const midterm = studentScores.find((s) => s.scoreType === 4)?.scoreValue ?? '';
      const finalScore = studentScores.find((s) => s.scoreType === 5)?.scoreValue ?? '';
      const avg = summary?.averageScore ?? '';
      const evaluation = summary?.evaluation ?? '';

      rows.push(
        [
          idx + 1,
          this.escapeCsv(sc.student.code ?? ''),
          this.escapeCsv(`${u?.lastName ?? ''} ${u?.firstName ?? ''}`.trim()),
          this.escapeCsv(oral),
          this.escapeCsv(tx2),
          this.escapeCsv(tx3),
          this.escapeCsv(midterm),
          this.escapeCsv(finalScore),
          this.escapeCsv(avg),
          this.escapeCsv(evaluation),
        ].join(','),
      );
    });

    const content = '\uFEFF' + rows.join('\r\n');
    const filename = `So_diem_${cls.name}_Mon_${subject.name.replace(/\s+/g, '_')}.csv`;

    return { filename, content };
  }

  async exportAttendance(
    orgId: number,
    classId: number,
    fromDateStr?: string,
    toDateStr?: string,
  ): Promise<{ filename: string; content: string }> {
    const cls = await this.prisma.class.findFirst({
      where: { id: classId, orgId },
    });
    if (!cls) throw new NotFoundException(`Lớp #${classId} không tồn tại`);

    const students = await this.prisma.studentClass.findMany({
      where: { orgId, classId, status: { in: [1, 2] } },
      include: {
        student: { include: { user: true } },
      },
      orderBy: [
        { student: { user: { lastName: 'asc' } } },
        { student: { user: { firstName: 'asc' } } },
      ],
    });

    const fromDate = fromDateStr ? new Date(fromDateStr) : undefined;
    const toDate = toDateStr ? new Date(toDateStr) : undefined;

    const sessions = await this.prisma.attendanceSession.findMany({
      where: {
        orgId,
        classId,
        ...(fromDate || toDate
          ? {
              date: {
                ...(fromDate ? { gte: fromDate } : {}),
                ...(toDate ? { lte: toDate } : {}),
              },
            }
          : {}),
      },
      include: {
        records: true,
      },
      orderBy: { date: 'asc' },
    });

    const headers = [
      'STT',
      'Mã học sinh',
      'Họ và tên',
      'Tổng số buổi',
      'Có mặt',
      'Vắng có phép',
      'Vắng không phép',
      'Đi muộn',
      'Tỷ lệ chuyên cần (%)',
    ];

    const rows: string[] = [];
    rows.push(headers.map((h) => this.escapeCsv(h)).join(','));

    students.forEach((sc, idx) => {
      const studentId = sc.student.id;
      const u = sc.student.user;

      let present = 0;
      let excused = 0;
      let unexcused = 0;
      let late = 0;

      for (const ses of sessions) {
        const rec = ses.records.find((r) => r.studentId === studentId);
        if (rec) {
          if (rec.status === 1) present++;
          else if (rec.status === 2) excused++;
          else if (rec.status === 3) unexcused++;
          else if (rec.status === 4) late++;
        }
      }

      const total = sessions.length;
      const rate = total > 0 ? Math.round((present / total) * 1000) / 10 : 100;

      rows.push(
        [
          idx + 1,
          this.escapeCsv(sc.student.code ?? ''),
          this.escapeCsv(`${u?.lastName ?? ''} ${u?.firstName ?? ''}`.trim()),
          total,
          present,
          excused,
          unexcused,
          late,
          rate,
        ].join(','),
      );
    });

    const content = '\uFEFF' + rows.join('\r\n');
    const filename = `Bao_cao_chuyen_can_lop_${cls.name.replace(/\s+/g, '_')}.csv`;

    return { filename, content };
  }
}
