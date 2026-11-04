import {
  Alert,
  Button,
  Card,
  DatePicker,
  Empty,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
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
  callInitTimetablePeriods,
  callSaveClassTimetable,
  ScheduleItem,
  useClassTimetable,
  useTeachingAssignments,
  useTimetablePeriods,
} from "../../../../../../hooks/school-only/academic-hooks";
import { useCurriculumSubjects } from "../../../../../../hooks/school-only/curriculums-hook";
import { useStaffs } from "../../../../../../hooks/school-only/staffs-hook";
import { ToFullNameByLocale } from "../../../../../../utils/locale-helpers";
import GText from "../../../../../atoms/g-text";
import {
  DeleteOutlined,
  FileSaveOutlined,
  FormOutlined,
  PlusOutlined,
  ReloadOutlined,
  ScheduleOutlined,
  TeacherOutlined,
} from "../../../../../atoms/svg/outlined-icons";

const DAYS_OF_WEEK = [
  { day: 2, label: "Thứ Hai" },
  { day: 3, label: "Thứ Ba" },
  { day: 4, label: "Thứ Tư" },
  { day: 5, label: "Thứ Năm" },
  { day: 6, label: "Thứ Sáu" },
  { day: 7, label: "Thứ Bảy" },
];

interface CellSchedule {
  id?: number;
  subjectId: number;
  subjectName: string;
  subjectCode: string;
  teacherId: number;
  teacherName: string;
  room?: string;
}

export default function ClassDetailTimetableView() {
  const { data: classData } = useClassDetailContext();
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [effectiveDate, setEffectiveDate] = useState<dayjs.Dayjs>(dayjs());
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [initializingPeriods, setInitializingPeriods] = useState<boolean>(false);

  // Cell Edit Modal state
  const [editingCell, setEditingCell] = useState<{
    periodId: number;
    periodNumber: number;
    dayOfWeek: number;
    dayLabel: string;
    currentData?: CellSchedule | null;
  } | null>(null);
  const [cellForm] = Form.useForm();

  // Local grid matrix: { `${periodId}_${dayOfWeek}`: CellSchedule }
  const [gridMatrix, setGridMatrix] = useState<Record<string, CellSchedule>>({});

  // 1. Periods (1 to 10)
  const {
    data: periods,
    fetching: loadingPeriods,
    mutate: mutatePeriods,
  } = useTimetablePeriods();

  // 2. Class Timetable schedules
  const {
    data: schedules,
    fetching: loadingSchedules,
    mutate: mutateSchedules,
  } = useClassTimetable(classData?.id, classData?.schoolYearId, selectedSemester);

  // 3. Teaching assignments for teacher recommendation
  const { data: assignments } = useTeachingAssignments(
    classData?.id,
    classData?.schoolYearId,
    selectedSemester
  );

  // 4. Curriculum subjects
  const { data: curriculumSubjects } = useCurriculumSubjects(
    classData?.curriculumId || undefined,
    1,
    100
  );

  // 5. Teachers list
  const { data: staffs } = useStaffs(1, 200, undefined, undefined, undefined, true);

  // Sync server schedules into local matrix
  useEffect(() => {
    const map: Record<string, CellSchedule> = {};
    if (schedules && schedules.length > 0) {
      schedules.forEach((item: ScheduleItem) => {
        const pNum = Number(
          typeof item.period === "object"
            ? (item.period as any)?.period
            : (item.period ?? item.periodId ?? item.periodNumber)
        );
        const key = `${pNum}_${item.dayOfWeek}`;
        const teacherName = item.teacher?.user
          ? ToFullNameByLocale(item.teacher.user.firstName, item.teacher.user.lastName)
          : "Chưa phân công";

        map[key] = {
          id: item.id,
          subjectId: item.subjectId,
          subjectName: item.subject?.name || "Môn học",
          subjectCode: item.subject?.code || "",
          teacherId: item.teacherId || 0,
          teacherName,
          room: item.room || item.roomNumber || undefined,
        };
      });
    }
    setGridMatrix(map);
  }, [schedules]);

  // Subject options
  const subjectOptions = useMemo(() => {
    if (!curriculumSubjects || !Array.isArray(curriculumSubjects)) return [];
    return curriculumSubjects.map((item: any) => {
      const s = item.subject || {};
      const subjectId = item.subjectId || s.id || item.id;
      const subjectName = item.name || s.name || item.subjectName || "Môn học";
      const subjectCode = item.code || s.code || item.subjectCode || "";
      return {
        value: subjectId,
        label: subjectCode ? `${subjectName} (${subjectCode})` : subjectName,
        code: subjectCode,
        name: subjectName,
      };
    });
  }, [curriculumSubjects]);

  // Teacher options
  const teacherOptions = useMemo(() => {
    if (!staffs) return [];
    return staffs.map((staff: any) => ({
      value: staff.id,
      label: `${ToFullNameByLocale(staff.firstName, staff.lastName)}`,
    }));
  }, [staffs]);

  // Initialize standard 10 periods
  const handleInitPeriods = async () => {
    setInitializingPeriods(true);
    try {
      const res = await callInitTimetablePeriods();
      if (res.error) {
        message.error(res.error.message || "Khởi tạo tiết học thất bại");
      } else {
        message.success("Khởi tạo 10 tiết chuẩn (Sáng 1-5, Chiều 6-10) thành công!");
        mutatePeriods();
      }
    } catch (err: any) {
      message.error(err.message || "Lỗi khởi tạo tiết học");
    } finally {
      setInitializingPeriods(false);
    }
  };

  // Open modal to assign period cell
  const handleOpenCellModal = (period: any, dayOfWeek: number) => {
    if (!isEditing) return;
    const pNum = Number(period.period ?? period.periodNumber ?? period.id);
    const key = `${pNum}_${dayOfWeek}`;
    const current = gridMatrix[key] || null;
    const dayLabel = DAYS_OF_WEEK.find((d) => d.day === dayOfWeek)?.label || `Thứ ${dayOfWeek}`;

    setEditingCell({
      periodId: pNum,
      periodNumber: pNum,
      dayOfWeek,
      dayLabel,
      currentData: current,
    });

    if (current) {
      cellForm.setFieldsValue({
        subjectId: current.subjectId,
        teacherId: current.teacherId,
        room: current.room || "",
      });
    } else {
      cellForm.resetFields();
    }
  };

  // When subject changes in modal, auto-suggest the assigned teacher
  const handleModalSubjectChange = (subjectId: number) => {
    const assignment = assignments?.find((a) => a.subjectId === subjectId);
    if (assignment) {
      cellForm.setFieldValue("teacherId", assignment.staffId);
    }
  };

  // Save single cell from modal into local matrix
  const handleSaveCell = () => {
    cellForm.validateFields().then((values) => {
      if (!editingCell) return;
      const key = `${editingCell.periodNumber}_${editingCell.dayOfWeek}`;

      const selectedSub = subjectOptions.find((s) => s.value === values.subjectId);
      const selectedTeacher = teacherOptions.find((t) => t.value === values.teacherId);

      setGridMatrix((prev) => ({
        ...prev,
        [key]: {
          id: editingCell.currentData?.id,
          subjectId: values.subjectId,
          subjectName: selectedSub?.name || "Môn học",
          subjectCode: selectedSub?.code || "",
          teacherId: values.teacherId,
          teacherName: selectedTeacher?.label || "Giáo viên",
          room: values.room || undefined,
        },
      }));

      setEditingCell(null);
      cellForm.resetFields();
    });
  };

  // Remove single cell
  const handleClearCell = (periodNumber: number, dayOfWeek: number) => {
    const key = `${periodNumber}_${dayOfWeek}`;
    setGridMatrix((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  // Save all schedules to backend
  const handleSaveTimetable = async () => {
    if (!classData?.id) return;
    setSubmitting(true);
    try {
      const scheduleItems = Object.entries(gridMatrix).map(([key, item]) => {
        const [periodStr, dayOfWeekStr] = key.split("_");
        return {
          period: Number(periodStr),
          periodId: Number(periodStr),
          dayOfWeek: Number(dayOfWeekStr),
          subjectId: item.subjectId,
          teacherId: item.teacherId,
          room: item.room,
          roomNumber: item.room,
        };
      });

      const payload = {
        schoolYearId: classData.schoolYearId || 1,
        semesterId: selectedSemester,
        effectiveDate: effectiveDate.format("YYYY-MM-DD"),
        schedules: scheduleItems,
      };

      const res = await callSaveClassTimetable(classData.id, payload);
      if (res.error) {
        message.error(res.error.message || "Lưu thời khóa biểu thất bại");
      } else {
        message.success("Lưu thời khóa biểu thành công!");
        setIsEditing(false);
        mutateSchedules();
      }
    } catch (err: any) {
      message.error(err.message || "Có lỗi khi lưu thời khóa biểu");
    } finally {
      setSubmitting(false);
    }
  };

  // Generate table rows sorted by periodNumber
  const sortedPeriods = useMemo(() => {
    if (!periods || !Array.isArray(periods)) return [];
    return [...periods].sort(
      (a, b) =>
        Number(a.periodNumber ?? a.period ?? a.id) -
        Number(b.periodNumber ?? b.period ?? b.id)
    );
  }, [periods]);

  // Construct Columns for 6 Days
  const columns: ColumnsType<any> = [
    {
      title: "Tiết / Ca",
      key: "period",
      width: 140,
      fixed: "left",
      align: "center",
      render: (_val, record) => {
        const isMorning =
          record.shift === "MORNING" ||
          record.shift === 1 ||
          Number(record.period ?? record.periodNumber) <= 5;
        const pNum = record.periodNumber ?? record.period ?? record.id;
        const start = record.startTime ?? record.start_time ?? "";
        const end = record.endTime ?? record.end_time ?? "";
        return (
          <Flex vertical align="center" gap={4}>
            <Tag color={isMorning ? "blue" : "purple"} style={{ margin: 0 }}>
              {record.name || `Tiết ${pNum} (${isMorning ? "Sáng" : "Chiều"})`}
            </Tag>
            {start && end && (
              <GText style={{ fontSize: 11, color: "#6b7280" }}>
                {start} - {end}
              </GText>
            )}
          </Flex>
        );
      },
    },
    ...DAYS_OF_WEEK.map((day) => ({
      title: day.label,
      key: `day_${day.day}`,
      align: "center" as const,
      render: (_val: any, record: any) => {
        const pNum = Number(record.period ?? record.periodNumber ?? record.id);
        const key = `${pNum}_${day.day}`;
        const cell = gridMatrix[key];

        if (cell) {
          return (
            <Card
              size="small"
              bordered
              style={{
                borderRadius: 6,
                background: "#f0fdf4",
                borderColor: "#bbf7d0",
                cursor: isEditing ? "pointer" : "default",
                minHeight: 70,
                position: "relative",
              }}
              onClick={() => handleOpenCellModal(record, day.day)}
            >
              <Flex vertical align="flex-start" gap={2}>
                <GText strong style={{ color: "#166534", fontSize: 13 }}>
                  {cell.subjectName}
                </GText>
                <Flex align="center" gap={4}>
                  <TeacherOutlined style={{ fontSize: 12, color: "#15803d" }} />
                  <GText style={{ fontSize: 11, color: "#15803d" }}>
                    {cell.teacherName.split("(")[0]}
                  </GText>
                </Flex>
                {cell.room && (
                  <Tag color="cyan" style={{ fontSize: 10, margin: 0, padding: "0 4px" }}>
                    {cell.room}
                  </Tag>
                )}
              </Flex>
              {isEditing && (
                <Popconfirm
                  title="Xóa tiết này?"
                  onConfirm={(e) => {
                    e?.stopPropagation();
                    handleClearCell(pNum, day.day);
                  }}
                  okText="Xóa"
                  cancelText="Hủy"
                >
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    style={{ position: "absolute", top: 2, right: 2 }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </Popconfirm>
              )}
            </Card>
          );
        }

        if (isEditing) {
          return (
            <Button
              type="dashed"
              size="small"
              icon={<PlusOutlined />}
              style={{ width: "100%", height: 60, borderRadius: 6, color: "#9ca3af" }}
              onClick={() => handleOpenCellModal(record, day.day)}
            >
              Thêm
            </Button>
          );
        }

        return <GText style={{ color: "#d1d5db" }}>-</GText>;
      },
    })),
  ];

  if (!classData) return null;

  return (
    <Fragment>
      <Flex vertical gap={20}>
        {/* If no periods exist, prompt to initialize */}
        {sortedPeriods.length === 0 && !loadingPeriods && (
          <Alert
            message="Chưa có cấu hình tiết học"
            description={
              <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
                <span>
                  Hệ thống chưa tìm thấy cấu hình danh sách các tiết học cho nhà trường.
                  Nhấn nút dưới đây để tự động tạo 10 tiết chuẩn (Tiết 1-5 buổi sáng, Tiết 6-10 buổi chiều).
                </span>
                <Button
                  type="primary"
                  loading={initializingPeriods}
                  onClick={handleInitPeriods}
                >
                  Khởi tạo 10 tiết chuẩn
                </Button>
              </Flex>
            }
            type="info"
            showIcon
          />
        )}

        {/* Toolbar */}
        <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
          <Space wrap size={12}>
            <Select
              style={{ width: 170 }}
              value={selectedSemester}
              onChange={(val) => setSelectedSemester(val)}
              options={[
                { value: 1, label: "Học kỳ 1" },
                { value: 2, label: "Học kỳ 2" },
              ]}
            />
            <DatePicker
              value={effectiveDate}
              onChange={(date) => date && setEffectiveDate(date)}
              format="DD/MM/YYYY"
              placeholder="Ngày áp dụng"
            />
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                mutatePeriods();
                mutateSchedules();
              }}
            >
              Làm mới
            </Button>
          </Space>

          <Space size={12}>
            {isEditing ? (
              <>
                <Button onClick={() => setIsEditing(false)}>Hủy bỏ</Button>
                <Button
                  type="primary"
                  icon={<FileSaveOutlined />}
                  loading={submitting}
                  onClick={handleSaveTimetable}
                >
                  Lưu thời khóa biểu
                </Button>
              </>
            ) : (
              <Button
                type="primary"
                icon={<FormOutlined />}
                onClick={() => setIsEditing(true)}
              >
                Chỉnh sửa thời khóa biểu
              </Button>
            )}
          </Space>
        </Flex>

        {/* Matrix Table */}
        <Spin spinning={loadingPeriods || loadingSchedules}>
          {sortedPeriods.length === 0 ? (
            <Card style={{ padding: 40, textAlign: "center" }}>
              <Empty
                description="Chưa có dữ liệu tiết học. Vui lòng bấm Khởi tạo 10 tiết chuẩn ở trên."
              />
            </Card>
          ) : (
            <Table
              bordered
              columns={columns}
              dataSource={sortedPeriods}
              pagination={false}
              size="middle"
              rowKey="id"
              scroll={{ x: 1000 }}
            />
          )}
        </Spin>

        {/* Modal: Assign Subject & Teacher to Cell */}
        <Modal
          title={
            editingCell
              ? `Xếp tiết: ${editingCell.dayLabel} - Tiết ${editingCell.periodNumber}`
              : "Xếp thời khóa biểu"
          }
          open={!!editingCell}
          onOk={handleSaveCell}
          onCancel={() => {
            setEditingCell(null);
            cellForm.resetFields();
          }}
          okText="Cập nhật vào TKB"
          cancelText="Đóng"
          destroyOnClose
        >
          <Form form={cellForm} layout="vertical" style={{ marginTop: 16 }}>
            <Form.Item
              name="subjectId"
              label="Môn học"
              rules={[{ required: true, message: "Vui lòng chọn môn học" }]}
            >
              <Select
                showSearch
                placeholder="Chọn môn học"
                options={subjectOptions}
                onChange={handleModalSubjectChange}
                filterOption={(input, option) =>
                  (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>

            <Form.Item
              name="teacherId"
              label="Giáo viên giảng dạy"
              rules={[{ required: true, message: "Vui lòng chọn giáo viên" }]}
            >
              <Select
                showSearch
                placeholder="Chọn giáo viên"
                options={teacherOptions}
                filterOption={(input, option) =>
                  (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>

            <Form.Item name="room" label="Phòng học / Ghi chú (tùy chọn)">
              <Input placeholder="Ví dụ: P.201, Phòng máy tính 1..." />
            </Form.Item>
          </Form>
        </Modal>
      </Flex>
    </Fragment>
  );
}
