import {
  Button,
  Card,
  Col,
  DatePicker,
  Empty,
  Flex,
  Input,
  message,
  Progress,
  Radio,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Tooltip,
} from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { useClassDetailContext } from "../../../../../../contexts/school-only/classes/ClassDetailContext";
import {
  AttendanceStudentRow,
  callSubmitAttendance,
  useClassAttendanceSession,
} from "../../../../../../hooks/school-only/academic-hooks";
import {
  downloadAuthenticatedFile,
  fetching_apis,
} from "../../../../../../utils/api-helpers";
import GText from "../../../../../atoms/g-text";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  FileSaveOutlined,
  ReloadOutlined,
} from "../../../../../atoms/svg/outlined-icons";

export default function ClassDetailAttendanceView() {
  const { data: classData } = useClassDetailContext();
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());
  const [selectedShift, setSelectedShift] = useState<string>("MORNING");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);

  // Local student records: { studentId: { status, note } }
  const [attendanceRecords, setAttendanceRecords] = useState<
    Record<number, { status: "PRESENT" | "ABSENT_EXCUSED" | "ABSENT_UNEXCUSED" | "LATE"; note: string }>
  >({});

  const dateStr = selectedDate.format("YYYY-MM-DD");

  const {
    data: sessionData,
    fetching: loadingSession,
    mutate: mutateSession,
  } = useClassAttendanceSession(classData?.id, dateStr, selectedShift);

  // Sync attendance session data into local state
  useEffect(() => {
    if (sessionData && sessionData.students) {
      const records: Record<number, any> = {};
      sessionData.students.forEach((s) => {
        records[s.studentId] = {
          status: s.status || "PRESENT",
          note: s.note || "",
        };
      });
      setAttendanceRecords(records);
    }
  }, [sessionData]);

  // Quick action: Set all students to PRESENT
  const handleMarkAllPresent = () => {
    if (!sessionData?.students) return;
    const next: Record<number, any> = { ...attendanceRecords };
    sessionData.students.forEach((s) => {
      next[s.studentId] = {
        status: "PRESENT",
        note: next[s.studentId]?.note || "",
      };
    });
    setAttendanceRecords(next);
    message.success("Đã đánh dấu tất cả học sinh có mặt!");
  };

  const handleStatusChange = (
    studentId: number,
    status: "PRESENT" | "ABSENT_EXCUSED" | "ABSENT_UNEXCUSED" | "LATE"
  ) => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [studentId]: {
        status,
        note: prev[studentId]?.note || "",
      },
    }));
  };

  const handleNoteChange = (studentId: number, note: string) => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [studentId]: {
        status: prev[studentId]?.status || "PRESENT",
        note,
      },
    }));
  };

  // Submit attendance to backend
  const handleSubmitAttendance = async () => {
    if (!classData?.id) return;
    setSubmitting(true);
    try {
      const records = Object.entries(attendanceRecords).map(([studentIdStr, val]) => ({
        studentId: Number(studentIdStr),
        status: val.status,
        note: val.note || undefined,
      }));

      const res = await callSubmitAttendance(classData.id, {
        schoolYearId: classData.schoolYearId || 1,
        date: dateStr,
        shift: selectedShift,
        records,
      });

      if (res.error) {
        message.error(res.error.message || "Lưu điểm danh thất bại");
      } else {
        message.success("Lưu điểm danh thành công!");
        mutateSession();
      }
    } catch (err: any) {
      message.error(err.message || "Có lỗi xảy ra khi lưu điểm danh");
    } finally {
      setSubmitting(false);
    }
  };

  // Export attendance report
  const handleExportAttendance = async () => {
    if (!classData?.id) return;
    setExporting(true);
    try {
      const fromDate = selectedDate.startOf("month").format("YYYY-MM-DD");
      const toDate = selectedDate.endOf("month").format("YYYY-MM-DD");
      const path = `${fetching_apis.exports_class_attendance.replace(
        "{classId}",
        classData.id + ""
      )}?fromDate=${fromDate}&toDate=${toDate}`;

      await downloadAuthenticatedFile(
        path,
        `DiemDanh_Lop_${classData.name || classData.id}_${dateStr}.csv`
      );
      message.success("Xuất báo cáo chuyên cần thành công!");
    } catch (err: any) {
      message.error(err.message || "Có lỗi xảy ra khi xuất báo cáo");
    } finally {
      setExporting(false);
    }
  };

  // Realtime local stats computation
  const liveStats = useMemo(() => {
    const students = sessionData?.students || [];
    const total = students.length;
    let present = 0;
    let absentExcused = 0;
    let absentUnexcused = 0;
    let late = 0;

    students.forEach((s) => {
      const current = attendanceRecords[s.studentId]?.status || s.status || "PRESENT";
      if (current === "PRESENT") present++;
      else if (current === "ABSENT_EXCUSED") absentExcused++;
      else if (current === "ABSENT_UNEXCUSED") absentUnexcused++;
      else if (current === "LATE") late++;
    });

    const rate = total > 0 ? Math.round(((present + late) / total) * 100) : 100;
    return { total, present, absentExcused, absentUnexcused, late, rate };
  }, [sessionData, attendanceRecords]);

  const columns: ColumnsType<AttendanceStudentRow> = [
    {
      title: "STT",
      key: "index",
      width: 70,
      align: "center",
      render: (_val, _rec, idx) => idx + 1,
    },
    {
      title: "Mã học sinh",
      dataIndex: "studentCode",
      key: "studentCode",
      width: 140,
      render: (code) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: "Họ và tên",
      key: "fullName",
      width: 220,
      render: (_val, record) => (
        <GText strong>
          {record.lastName} {record.firstName}
        </GText>
      ),
    },
    {
      title: "Trạng thái điểm danh",
      key: "status",
      width: 440,
      render: (_val, record) => {
        const currentStatus =
          attendanceRecords[record.studentId]?.status || record.status || "PRESENT";

        return (
          <Radio.Group
            value={currentStatus}
            onChange={(e) => handleStatusChange(record.studentId, e.target.value)}
            size="small"
          >
            <Radio.Button
              value="PRESENT"
              style={{
                background: currentStatus === "PRESENT" ? "#f0fdf4" : undefined,
                borderColor: currentStatus === "PRESENT" ? "#22c55e" : undefined,
                color: currentStatus === "PRESENT" ? "#15803d" : undefined,
              }}
            >
              ✓ Có mặt
            </Radio.Button>
            <Radio.Button
              value="ABSENT_EXCUSED"
              style={{
                background: currentStatus === "ABSENT_EXCUSED" ? "#fffbeb" : undefined,
                borderColor: currentStatus === "ABSENT_EXCUSED" ? "#f59e0b" : undefined,
                color: currentStatus === "ABSENT_EXCUSED" ? "#b45309" : undefined,
              }}
            >
              P (Có phép)
            </Radio.Button>
            <Radio.Button
              value="ABSENT_UNEXCUSED"
              style={{
                background: currentStatus === "ABSENT_UNEXCUSED" ? "#fef2f2" : undefined,
                borderColor: currentStatus === "ABSENT_UNEXCUSED" ? "#ef4444" : undefined,
                color: currentStatus === "ABSENT_UNEXCUSED" ? "#b91c1c" : undefined,
              }}
            >
              K (Không phép)
            </Radio.Button>
            <Radio.Button
              value="LATE"
              style={{
                background: currentStatus === "LATE" ? "#fff7ed" : undefined,
                borderColor: currentStatus === "LATE" ? "#f97316" : undefined,
                color: currentStatus === "LATE" ? "#c2410c" : undefined,
              }}
            >
              M (Muộn)
            </Radio.Button>
          </Radio.Group>
        );
      },
    },
    {
      title: "Ghi chú lý do",
      key: "note",
      render: (_val, record) => {
        const currentNote = attendanceRecords[record.studentId]?.note ?? record.note ?? "";
        return (
          <Input
            size="small"
            placeholder="Lý do vắng / ghi chú..."
            value={currentNote}
            onChange={(e) => handleNoteChange(record.studentId, e.target.value)}
          />
        );
      },
    },
  ];

  if (!classData) return null;

  return (
    <Fragment>
      <Flex vertical gap={20}>
        {/* Statistics Cards */}
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={8} md={4}>
            <Card size="small" bordered style={{ borderRadius: 8, background: "#f9fafb" }}>
              <GText type="secondary">Sĩ số lớp</GText>
              <h3 style={{ margin: "4px 0 0", fontSize: 20 }}>{liveStats.total}</h3>
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card size="small" bordered style={{ borderRadius: 8, background: "#f0fdf4" }}>
              <GText style={{ color: "#166534" }}>Có mặt</GText>
              <h3 style={{ margin: "4px 0 0", fontSize: 20, color: "#15803d" }}>
                {liveStats.present}
              </h3>
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card size="small" bordered style={{ borderRadius: 8, background: "#fffbeb" }}>
              <GText style={{ color: "#92400e" }}>Có phép (P)</GText>
              <h3 style={{ margin: "4px 0 0", fontSize: 20, color: "#b45309" }}>
                {liveStats.absentExcused}
              </h3>
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card size="small" bordered style={{ borderRadius: 8, background: "#fef2f2" }}>
              <GText style={{ color: "#991b1b" }}>Không phép (K)</GText>
              <h3 style={{ margin: "4px 0 0", fontSize: 20, color: "#b91c1c" }}>
                {liveStats.absentUnexcused}
              </h3>
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card size="small" bordered style={{ borderRadius: 8, background: "#fff7ed" }}>
              <GText style={{ color: "#9a3412" }}>Đi muộn (M)</GText>
              <h3 style={{ margin: "4px 0 0", fontSize: 20, color: "#c2410c" }}>
                {liveStats.late}
              </h3>
            </Card>
          </Col>
          <Col xs={24} sm={8} md={4}>
            <Card size="small" bordered style={{ borderRadius: 8, background: "#f0f9ff" }}>
              <GText style={{ color: "#075985" }}>Chuyên cần</GText>
              <Flex align="center" gap={8} style={{ marginTop: 4 }}>
                <Progress
                  percent={liveStats.rate}
                  size="small"
                  status={liveStats.rate < 90 ? "exception" : "normal"}
                  strokeColor={liveStats.rate >= 90 ? "#10b981" : "#f59e0b"}
                />
              </Flex>
            </Card>
          </Col>
        </Row>

        {/* Toolbar & Filter */}
        <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
          <Space wrap size={12}>
            <DatePicker
              value={selectedDate}
              onChange={(date) => date && setSelectedDate(date)}
              format="DD/MM/YYYY"
              allowClear={false}
            />
            <Select
              style={{ width: 140 }}
              value={selectedShift}
              onChange={(val) => setSelectedShift(val)}
              options={[
                { value: "MORNING", label: "Buổi Sáng" },
                { value: "AFTERNOON", label: "Buổi Chiều" },
                { value: "FULL_DAY", label: "Cả Ngày" },
              ]}
            />
            <Button icon={<ReloadOutlined />} onClick={() => mutateSession()}>
              Làm mới
            </Button>
          </Space>

          <Space size={12} wrap>
            <Button
              onClick={handleMarkAllPresent}
              icon={<CheckCircleOutlined />}
            >
              Tất cả có mặt
            </Button>
            <Button
              icon={<DownloadOutlined />}
              loading={exporting}
              onClick={handleExportAttendance}
            >
              Xuất báo cáo Excel
            </Button>
            <Button
              type="primary"
              icon={<FileSaveOutlined />}
              loading={submitting}
              onClick={handleSubmitAttendance}
            >
              Lưu điểm danh
            </Button>
          </Space>
        </Flex>

        {/* Student Attendance Table */}
        <Spin spinning={loadingSession}>
          {!sessionData?.students || sessionData.students.length === 0 ? (
            <Card style={{ padding: 40, textAlign: "center" }}>
              <Empty
                description={
                  <span>
                    Lớp chưa có học sinh nào.
                    <br />
                    Vui lòng thêm hoặc chuyển học sinh vào lớp tại tab Danh sách học sinh.
                  </span>
                }
              />
            </Card>
          ) : (
            <Table
              bordered
              columns={columns}
              dataSource={sessionData.students}
              pagination={false}
              size="middle"
              rowKey="studentId"
            />
          )}
        </Spin>
      </Flex>
    </Fragment>
  );
}
