import { Injectable } from '@nestjs/common';
import { GradeRepository } from './repository/grade.repository';
import {
  BulkRecordScoreDto,
  CalculateSummaryDto,
  ScoreType,
} from './dto/grade.dto';

@Injectable()
export class GradesService {
  constructor(private readonly repository: GradeRepository) {}

  async bulkRecordScores(
    orgId: number,
    classId: number,
    dto: BulkRecordScoreDto,
  ) {
    return this.repository.bulkUpsertScores(orgId, classId, dto);
  }

  async getClassSubjectScoreboard(
    orgId: number,
    classId: number,
    subjectId: number,
    schoolYearId: number,
    semesterId: number,
  ) {
    const students = await this.repository.getClassStudents(orgId, classId);
    const scoreEntries = await this.repository.findClassSubjectScores(
      orgId,
      classId,
      subjectId,
      schoolYearId,
      semesterId,
    );
    const summaries = await this.repository.findSummaries(
      orgId,
      classId,
      subjectId,
      schoolYearId,
      semesterId,
    );

    const summaryMap = new Map<number, any>();
    for (const sm of summaries) {
      summaryMap.set(sm.studentId, sm);
    }

    const scoresByStudent = new Map<number, any[]>();
    for (const se of scoreEntries) {
      if (!scoresByStudent.has(se.studentId)) {
        scoresByStudent.set(se.studentId, []);
      }
      scoresByStudent.get(se.studentId)!.push(se);
    }

    const scoreboard = students.map((sc) => {
      const studentId = sc.student.id;
      const studentScores = scoresByStudent.get(studentId) || [];
      const summary = summaryMap.get(studentId);

      const oral = studentScores.find((s) => s.scoreType === ScoreType.ORAL);
      const shortTest = studentScores.find(
        (s) => s.scoreType === ScoreType.SHORT_TEST,
      );
      const longTest = studentScores.find(
        (s) => s.scoreType === ScoreType.LONG_TEST,
      );
      const midterm = studentScores.find(
        (s) => s.scoreType === ScoreType.MIDTERM,
      );
      const finalScore = studentScores.find(
        (s) => s.scoreType === ScoreType.FINAL,
      );

      return {
        studentId,
        studentCode: sc.student.code,
        firstName: sc.student.user?.firstName ?? '',
        lastName: sc.student.user?.lastName ?? '',
        tx1: oral ? oral.scoreValue : null,
        tx2: shortTest ? shortTest.scoreValue : null,
        tx3: longTest ? longTest.scoreValue : null,
        tx4: null,
        oral: oral ? oral.scoreValue : null,
        shortTest: shortTest ? shortTest.scoreValue : null,
        longTest: longTest ? longTest.scoreValue : null,
        midterm: midterm ? midterm.scoreValue : null,
        final: finalScore ? finalScore.scoreValue : null,
        averageScore: summary ? summary.averageScore : null,
        evaluation: summary ? summary.evaluation : null,
        comment: finalScore?.comment || midterm?.comment || longTest?.comment || shortTest?.comment || oral?.comment || null,
      };
    });

    return {
      classId,
      subjectId,
      schoolYearId,
      semesterId,
      totalStudents: students.length,
      scoreboard,
      students: scoreboard,
    };
  }

  async calculateSummary(
    orgId: number,
    classId: number,
    dto: CalculateSummaryDto,
  ) {
    const students = await this.repository.getClassStudents(orgId, classId);

    // If subjectId is provided, calculate for this subject, otherwise find all subjects scored in class
    const subjectIds = dto.subjectId ? [dto.subjectId] : [];
    if (subjectIds.length === 0) {
      // Find distinct subjects in class score entries
      const entries = await this.repository.findClassSubjectScores(
        orgId,
        classId,
        dto.subjectId || 0,
        dto.schoolYearId,
        dto.semesterId,
      );
      // If none, return empty
      if (entries.length === 0) return { updated: 0 };
    }

    let updatedCount = 0;

    for (const subId of subjectIds) {
      const scoreEntries = await this.repository.findClassSubjectScores(
        orgId,
        classId,
        subId,
        dto.schoolYearId,
        dto.semesterId,
      );

      const scoresByStudent = new Map<number, any[]>();
      for (const se of scoreEntries) {
        if (!scoresByStudent.has(se.studentId)) {
          scoresByStudent.set(se.studentId, []);
        }
        scoresByStudent.get(se.studentId)!.push(se);
      }

      for (const sc of students) {
        const studentId = sc.student.id;
        const studentScores = scoresByStudent.get(studentId) || [];

        // Calculation according to MOET regulations:
        // Regular (Oral, 15-min, 1-period): weight 1
        // Midterm: weight 2
        // Final: weight 3
        let sumWeighted = 0;
        let totalWeights = 0;

        for (const s of studentScores) {
          if (s.scoreValue !== null && s.scoreValue !== undefined) {
            let weight = 1;
            if (s.scoreType === ScoreType.MIDTERM) weight = 2;
            else if (s.scoreType === ScoreType.FINAL) weight = 3;

            sumWeighted += s.scoreValue * weight;
            totalWeights += weight;
          }
        }

        const avg =
          totalWeights > 0
            ? Math.round((sumWeighted / totalWeights) * 10) / 10
            : null;

        let evaluation = null;
        if (avg !== null) {
          if (avg >= 8.0) evaluation = 'Tốt / Giỏi';
          else if (avg >= 6.5) evaluation = 'Khá';
          else if (avg >= 5.0) evaluation = 'Đạt';
          else evaluation = 'Chưa đạt';
        }

        await this.repository.upsertSubjectSummary({
          orgId,
          studentId,
          classId,
          subjectId: subId,
          schoolYearId: dto.schoolYearId,
          semesterId: dto.semesterId,
          averageScore: avg,
          evaluation,
        });

        updatedCount++;
      }
    }

    return {
      success: true,
      updatedCount,
      message: `Đã tính toán và cập nhật điểm trung bình cho ${updatedCount} lượt học sinh thành công!`,
    };
  }

  async getStudentTranscript(
    studentId: number,
    schoolYearId: number,
    semesterId?: number,
  ) {
    const { scores, summaries } = await this.repository.findStudentTranscript(
      studentId,
      schoolYearId,
      semesterId,
    );

    // Group by subject
    const subjectMap = new Map<number, any>();

    for (const se of scores as any[]) {
      const subId = se.subjectId;
      if (!subjectMap.has(subId)) {
        subjectMap.set(subId, {
          subjectId: subId,
          subjectName: se.subject?.name,
          subjectCode: se.subject?.code,
          scores: [],
          averageScore: null,
          evaluation: null,
        });
      }
      subjectMap.get(subId).scores.push({
        scoreType: se.scoreType,
        scoreValue: se.scoreValue,
        comment: se.comment,
      });
    }

    for (const sm of summaries as any[]) {
      const subId = sm.subjectId;
      if (!subjectMap.has(subId)) {
        subjectMap.set(subId, {
          subjectId: subId,
          subjectName: sm.subject?.name,
          subjectCode: sm.subject?.code,
          scores: [],
          averageScore: sm.averageScore,
          evaluation: sm.evaluation,
        });
      } else {
        subjectMap.get(subId).averageScore = sm.averageScore;
        subjectMap.get(subId).evaluation = sm.evaluation;
      }
    }

    const transcript = Array.from(subjectMap.values());

    // Calculate overall GPA across all subjects
    let totalAvg = 0;
    let countAvg = 0;
    for (const item of transcript) {
      if (item.averageScore !== null && item.averageScore !== undefined) {
        totalAvg += item.averageScore;
        countAvg++;
      }
    }

    const semesterGPA =
      countAvg > 0 ? Math.round((totalAvg / countAvg) * 10) / 10 : null;

    return {
      studentId,
      schoolYearId,
      semesterId,
      semesterGPA,
      transcript,
    };
  }
}
