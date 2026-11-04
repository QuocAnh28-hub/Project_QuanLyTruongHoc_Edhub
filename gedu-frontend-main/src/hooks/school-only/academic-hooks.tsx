import { useEffect, useMemo, useState } from "react";
import {
  callDelete,
  callPost,
  fetching_apis,
  useGetData,
} from "../../utils/api-helpers";

// ==========================================
// 1. TEACHING ASSIGNMENTS HOOKS
// ==========================================

export interface TeachingAssignmentItem {
  id: number;
  classId: number;
  subjectId: number;
  staffId: number;
  schoolYearId: number;
  semesterId?: number | null;
  subject?: { id: number; name: string; code: string };
  teacher?: {
    id: number;
    code: string;
    user: { id: number; firstName: string; lastName: string; phone?: string };
  };
}

export function useTeachingAssignments(
  classId?: number | null,
  schoolYearId?: number | null,
  semesterId?: number | null
) {
  const [request, setRequest] = useState<{ url: string | null; params: any }>({
    url: null,
    params: null,
  });
  const { data, fetching, refreshing, error, mutate } = useGetData(
    request.url,
    request.params,
    false
  );

  useEffect(() => {
    if (!classId) {
      setRequest({ url: null, params: null });
      return;
    }
    const params: any = { classId };
    if (schoolYearId) params.schoolYearId = schoolYearId;
    if (semesterId !== undefined && semesterId !== null)
      params.semesterId = semesterId;
    setRequest({ url: fetching_apis.teaching_assignments, params });
  }, [classId, schoolYearId, semesterId]);

  return {
    data: (data || []) as TeachingAssignmentItem[],
    fetching,
    refreshing,
    error,
    mutate,
  };
}

export async function callBatchAssignTeaching(
  classId: number,
  schoolYearId: number,
  semesterId: number | null,
  assignments: { subjectId: number; staffId: number }[]
) {
  const payload = {
    assignments: assignments.map((a) => ({
      classId,
      subjectId: a.subjectId,
      staffId: a.staffId,
      schoolYearId,
      semesterId: semesterId ?? undefined,
    })),
  };
  const res = await callPost(fetching_apis.teaching_assignments_batch, payload);
  return { data: res?.response, error: res?.error };
}

export async function callDeleteTeachingAssignment(id: number) {
  const res = await callDelete(
    fetching_apis.teaching_assignment_detail.replace("{id}", id + "")
  );
  return { data: res?.response, error: res?.error };
}

// ==========================================
// 2. ATTENDANCE HOOKS
// ==========================================

export interface AttendanceStudentRow {
  studentId: number;
  studentCode: string;
  firstName: string;
  lastName: string;
  gender?: string | null;
  attendanceId?: number | null;
  status: "PRESENT" | "ABSENT_EXCUSED" | "ABSENT_UNEXCUSED" | "LATE";
  note?: string;
}

export interface AttendanceSessionData {
  classId: number;
  className: string;
  date: string;
  shift: string;
  periodId?: number | null;
  summary: {
    totalStudents: number;
    present: number;
    absentExcused: number;
    absentUnexcused: number;
    late: number;
    attendanceRate: number;
  };
  students: AttendanceStudentRow[];
}

export function useClassAttendanceSession(
  classId?: number | null,
  date?: string,
  shift?: string | number,
  periodId?: number | null
) {
  const [request, setRequest] = useState<{ url: string | null; params: any }>({
    url: null,
    params: null,
  });
  const { data, fetching, refreshing, error, mutate } = useGetData(
    request.url,
    request.params,
    false
  );

  useEffect(() => {
    if (!classId) {
      setRequest({ url: null, params: null });
      return;
    }
    const params: any = {};
    if (date) params.date = date;
    if (shift !== undefined && shift !== null) {
      const shiftNum =
        shift === "MORNING" || shift === "1" || shift === 1 ? 1 : 2;
      params.shift = shiftNum;
    }
    if (periodId) params.periodId = periodId;
    setRequest({
      url: fetching_apis.attendances_session.replace("{classId}", classId + ""),
      params,
    });
  }, [classId, date, shift, periodId]);

  const normalizedData: AttendanceSessionData | null = useMemo(() => {
    if (!data) return null;

    const statusMapToName: Record<
      number,
      "PRESENT" | "ABSENT_EXCUSED" | "ABSENT_UNEXCUSED" | "LATE"
    > = {
      1: "PRESENT",
      2: "ABSENT_EXCUSED",
      3: "ABSENT_UNEXCUSED",
      4: "LATE",
    };

    const rawRecords = Array.isArray(data?.records)
      ? data.records
      : Array.isArray(data?.students)
      ? data.students
      : [];

    const students: AttendanceStudentRow[] = rawRecords.map((r: any) => ({
      studentId: r.studentId,
      studentCode: r.studentCode || "",
      firstName: r.firstName || "",
      lastName: r.lastName || "",
      gender: r.gender,
      attendanceId: r.recordId ?? r.attendanceId,
      status:
        typeof r.status === "number"
          ? statusMapToName[r.status] || "PRESENT"
          : r.status || "PRESENT",
      note: r.note || "",
    }));

    const totalStudents = students.length;
    const present = students.filter((s) => s.status === "PRESENT").length;
    const absentExcused = students.filter(
      (s) => s.status === "ABSENT_EXCUSED"
    ).length;
    const absentUnexcused = students.filter(
      (s) => s.status === "ABSENT_UNEXCUSED"
    ).length;
    const late = students.filter((s) => s.status === "LATE").length;
    const attendanceRate =
      totalStudents > 0 ? Math.round((present / totalStudents) * 100) : 100;

    return {
      classId: data.classId ?? (classId as number),
      className: data.className || "",
      date: data.date
        ? typeof data.date === "string"
          ? data.date
          : new Date(data.date).toISOString().slice(0, 10)
        : date || "",
      shift:
        typeof data.shift === "number"
          ? data.shift === 1
            ? "MORNING"
            : "AFTERNOON"
          : data.shift || shift || "MORNING",
      periodId: data.period ?? data.periodId,
      summary: data.summary || {
        totalStudents,
        present,
        absentExcused,
        absentUnexcused,
        late,
        attendanceRate,
      },
      students,
    };
  }, [data, classId, date, shift]);

  return {
    data: normalizedData,
    fetching,
    refreshing,
    error,
    mutate,
  };
}

export async function callSubmitAttendance(
  classId: number,
  payload: {
    schoolYearId?: number;
    date: string;
    shift: string | number;
    periodId?: number;
    period?: number;
    records: { studentId: number; status: string | number; note?: string }[];
  }
) {
  const statusMapToNumber: Record<string, number> = {
    PRESENT: 1,
    ABSENT_EXCUSED: 2,
    ABSENT_UNEXCUSED: 3,
    LATE: 4,
  };

  const shiftNum =
    payload.shift === "MORNING" || payload.shift === 1 || payload.shift === "1"
      ? 1
      : 2;

  const backendPayload = {
    schoolYearId: payload.schoolYearId || 1,
    date: payload.date,
    shift: shiftNum,
    period: payload.period ?? payload.periodId ?? undefined,
    records: payload.records.map((r) => ({
      studentId: r.studentId,
      status:
        typeof r.status === "number"
          ? r.status
          : statusMapToNumber[r.status] ?? 1,
      note: r.note,
    })),
  };

  const res = await callPost(
    fetching_apis.attendances_submit.replace("{classId}", classId + ""),
    backendPayload
  );
  return { data: res?.response, error: res?.error };
}

export function useClassAttendanceStatistics(
  classId?: number | null,
  fromDate?: string,
  toDate?: string
) {
  const [request, setRequest] = useState<{ url: string | null; params: any }>({
    url: null,
    params: null,
  });
  const { data, fetching, refreshing, error, mutate } = useGetData(
    request.url,
    request.params,
    false
  );

  useEffect(() => {
    if (!classId) {
      setRequest({ url: null, params: null });
      return;
    }
    const params: any = {};
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;
    setRequest({
      url: fetching_apis.attendances_statistics.replace(
        "{classId}",
        classId + ""
      ),
      params,
    });
  }, [classId, fromDate, toDate]);

  return {
    data: data || null,
    fetching,
    refreshing,
    error,
    mutate,
  };
}

// ==========================================
// 3. TIMETABLE HOOKS
// ==========================================

export interface PeriodItem {
  id: number;
  period?: number;
  periodNumber?: number;
  name?: string;
  shift: string | number;
  startTime: string;
  endTime: string;
}

export interface ScheduleItem {
  id?: number;
  dayOfWeek: number; // 2 to 7 (Mon=2..Sat=7)
  period?: number | PeriodItem | any;
  periodId?: number;
  periodNumber?: number;
  subjectId: number;
  teacherId?: number;
  room?: string | null;
  roomNumber?: string | null;
  subject?: { id: number; name: string; code: string };
  teacher?: {
    id: number;
    code?: string;
    user?: { id: number; firstName: string; lastName: string };
  };
}

export function useTimetablePeriods() {
  const { data, fetching, refreshing, error, mutate } = useGetData(
    fetching_apis.timetables_periods,
    null,
    false
  );
  return {
    data: (data || []) as PeriodItem[],
    fetching,
    refreshing,
    error,
    mutate,
  };
}

export async function callInitTimetablePeriods() {
  const res = await callPost(fetching_apis.timetables_periods_init, {});
  return { data: res?.response, error: res?.error };
}

export function useClassTimetable(
  classId?: number | null,
  schoolYearId?: number | null,
  semesterId?: number | null
) {
  const [request, setRequest] = useState<{ url: string | null; params: any }>({
    url: null,
    params: null,
  });
  const { data, fetching, refreshing, error, mutate } = useGetData(
    request.url,
    request.params,
    false
  );

  useEffect(() => {
    if (!classId) {
      setRequest({ url: null, params: null });
      return;
    }
    const params: any = {};
    if (schoolYearId) params.schoolYearId = schoolYearId;
    if (semesterId) params.semesterId = semesterId;
    setRequest({
      url: fetching_apis.timetables_class.replace("{classId}", classId + ""),
      params,
    });
  }, [classId, schoolYearId, semesterId]);

  const rawList = Array.isArray(data)
    ? data
    : Array.isArray(data?.schedules)
    ? data.schedules
    : [];

  return {
    data: rawList as ScheduleItem[],
    matrix: data?.matrix,
    fetching,
    refreshing,
    error,
    mutate,
  };
}

export async function callSaveClassTimetable(
  classId: number,
  payload: {
    schoolYearId: number;
    semesterId?: number;
    effectiveDate?: string;
    schedules: {
      periodId: number;
      dayOfWeek: number;
      subjectId: number;
      teacherId: number;
      room?: string;
    }[];
  }
) {
  const res = await callPost(
    fetching_apis.timetables_class_schedules.replace("{classId}", classId + ""),
    payload
  );
  return { data: res?.response, error: res?.error };
}

export async function callDeleteScheduleItem(id: number) {
  const res = await callDelete(
    fetching_apis.timetables_schedule_item.replace("{id}", id + "")
  );
  return { data: res?.response, error: res?.error };
}

// ==========================================
// 4. GRADES & SCOREBOARD HOOKS
// ==========================================

export interface StudentScoreRow {
  studentId: number;
  studentCode: string;
  firstName: string;
  lastName: string;
  tx1?: number | null;
  tx2?: number | null;
  tx3?: number | null;
  tx4?: number | null;
  midterm?: number | null;
  final?: number | null;
  averageScore?: number | null;
  evaluation?: string | null;
  passed?: boolean | null;
  comment?: string | null;
}

export interface ScoreboardData {
  classId: number;
  className: string;
  subjectId: number;
  subjectName: string;
  schoolYearId: number;
  semesterId?: number;
  students: StudentScoreRow[];
}

export function useClassScoreboard(
  classId?: number | null,
  subjectId?: number | null,
  schoolYearId?: number | null,
  semesterId?: number | null
) {
  const [request, setRequest] = useState<{ url: string | null; params: any }>({
    url: null,
    params: null,
  });
  const { data, fetching, refreshing, error, mutate } = useGetData(
    request.url,
    request.params,
    false
  );

  useEffect(() => {
    if (!classId || !subjectId) {
      setRequest({ url: null, params: null });
      return;
    }
    const params: any = {};
    if (schoolYearId) params.schoolYearId = schoolYearId;
    if (semesterId) params.semesterId = semesterId;
    setRequest({
      url: fetching_apis.grades_scoreboard
        .replace("{classId}", classId + "")
        .replace("{subjectId}", subjectId + ""),
      params,
    });
  }, [classId, subjectId, schoolYearId, semesterId]);

  const normalizedData: ScoreboardData | null = useMemo(() => {
    if (!data) return null;

    const rawList = Array.isArray(data?.students)
      ? data.students
      : Array.isArray(data?.scoreboard)
      ? data.scoreboard
      : [];

    const students: StudentScoreRow[] = rawList.map((s: any) => ({
      studentId: s.studentId,
      studentCode: s.studentCode || "",
      firstName: s.firstName || "",
      lastName: s.lastName || "",
      tx1: s.tx1 !== undefined ? s.tx1 : s.oral,
      tx2: s.tx2 !== undefined ? s.tx2 : s.shortTest,
      tx3: s.tx3 !== undefined ? s.tx3 : s.longTest,
      tx4: s.tx4 ?? null,
      midterm: s.midterm ?? null,
      final: s.final ?? null,
      averageScore: s.averageScore ?? null,
      evaluation: s.evaluation ?? null,
      passed:
        s.passed ?? (s.averageScore != null ? s.averageScore >= 5.0 : null),
      comment: s.comment ?? null,
    }));

    return {
      classId: data.classId ?? (classId as number),
      className: data.className || "",
      subjectId: data.subjectId ?? (subjectId as number),
      subjectName: data.subjectName || "",
      schoolYearId: data.schoolYearId ?? (schoolYearId as number),
      semesterId: data.semesterId ?? (semesterId as number),
      students,
    };
  }, [data, classId, subjectId, schoolYearId, semesterId]);

  return {
    data: normalizedData,
    fetching,
    refreshing,
    error,
    mutate,
  };
}

export async function callBulkRecordScores(
  classId: number,
  payload: {
    schoolYearId: number;
    semesterId: number;
    subjectId: number;
    scoreType: string | number;
    scores: {
      studentId: number;
      score?: number;
      scoreValue?: number;
      comment?: string;
    }[];
  }
) {
  const scoreTypeMap: Record<string, number> = {
    TX1: 1,
    ORAL: 1,
    TX2: 2,
    SHORT_TEST: 2,
    TX3: 3,
    LONG_TEST: 3,
    TX4: 3,
    MIDTERM: 4,
    FINAL: 5,
  };

  const scoreTypeNum =
    typeof payload.scoreType === "number"
      ? payload.scoreType
      : scoreTypeMap[payload.scoreType] ?? 1;

  const backendPayload = {
    schoolYearId: payload.schoolYearId,
    semesterId: payload.semesterId,
    subjectId: payload.subjectId,
    scoreType: scoreTypeNum,
    scores: payload.scores.map((s) => ({
      studentId: s.studentId,
      scoreValue: s.scoreValue !== undefined ? s.scoreValue : s.score,
      comment: s.comment,
    })),
  };

  const res = await callPost(
    fetching_apis.grades_bulk.replace("{classId}", classId + ""),
    backendPayload
  );
  return { data: res?.response, error: res?.error };
}

export async function callCalculateSummary(
  classId: number,
  payload: {
    schoolYearId: number;
    semesterId: number;
    subjectId?: number;
  }
) {
  const res = await callPost(
    fetching_apis.grades_calculate.replace("{classId}", classId + ""),
    payload
  );
  return { data: res?.response, error: res?.error };
}

