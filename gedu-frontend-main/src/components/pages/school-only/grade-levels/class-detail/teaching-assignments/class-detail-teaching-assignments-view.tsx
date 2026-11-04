import {
  Button,
  Card,
  Col,
  Empty,
  Flex,
  message,
  Popconfirm,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Tooltip,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useMemo, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { useClassDetailContext } from "../../../../../../contexts/school-only/classes/ClassDetailContext";
import {
  callBatchAssignTeaching,
  callDeleteTeachingAssignment,
  useTeachingAssignments,
} from "../../../../../../hooks/school-only/academic-hooks";
import { useCurriculumSubjects } from "../../../../../../hooks/school-only/curriculums-hook";
import { useStaffs } from "../../../../../../hooks/school-only/staffs-hook";
import { ToFullNameByLocale } from "../../../../../../utils/locale-helpers";
import GText from "../../../../../atoms/g-text";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  FileSaveOutlined,
  FormOutlined,
  ReloadOutlined,
  TeacherOutlined,
} from "../../../../../atoms/svg/outlined-icons";
import TitleSegmentRow from "../../../../../atoms/title-segment-row";

interface SubjectRow {
  key: number;
  subjectId: number;
  subjectCode: string;
  subjectName: string;
  lessonsPerWeek: number;
  typeText: string;
  assignedStaffId: number | null;
  assignedStaffName: string;
  assignmentId: number | null;
}

export default function ClassDetailTeachingAssignmentsView() {
  const { data: classData, switchUpdateMode } = useClassDetailContext();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [assignmentMap, setAssignmentMap] = useState<Record<number, number | null>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Curriculum subjects for this class's curriculum
  const {
    data: curriculumSubjects,
    fetching: loadingSubjects,
    mutate: mutateSubjects,
  } = useCurriculumSubjects(classData?.curriculumId || undefined, 1, 100);

  // Existing teaching assignments
  const {
    data: assignments,
    fetching: loadingAssignments,
    mutate: mutateAssignments,
  } = useTeachingAssignments(
    classData?.id,
    classData?.schoolYearId,
    selectedSemester
  );

  // Staffs / Teachers list
  const { data: staffs, fetching: loadingStaffs } = useStaffs(1, 200, undefined, undefined, undefined, true);

  const teacherOptions = useMemo(() => {
    if (!staffs) return [];
    return staffs.map((staff: any) => ({
      value: staff.id,
      label: `${ToFullNameByLocale(staff.firstName, staff.lastName)}`,
    }));
  }, [staffs]);

  // Sync assignment map when assignments change
  useEffect(() => {
    const map: Record<number, number | null> = {};
    if (assignments && assignments.length > 0) {
      assignments.forEach((a) => {
        map[a.subjectId] = a.staffId;
      });
    }
    setAssignmentMap(map);
  }, [assignments]);

  // Transform curriculum subjects to table rows
  const tableData: SubjectRow[] = useMemo(() => {
    if (!curriculumSubjects || !Array.isArray(curriculumSubjects)) return [];

    return curriculumSubjects.map((item: any, idx: number) => {
      const subject = item.subject || {};
      const subjectId = item.subjectId || subject.id || item.id;
      const subjectName = item.name || subject.name || item.subjectName || "Môn học";
      const subjectCode = item.code || subject.code || item.subjectCode || `SUB-${subjectId}`;
      const currentStaffId = assignmentMap[subjectId] ?? null;

      const assignment = assignments?.find((a) => a.subjectId === subjectId);
      let staffName = "Chưa phân công";
      if (currentStaffId) {
        const found = staffs?.find((s: any) => s.id === currentStaffId);
        if (found) {
          staffName = ToFullNameByLocale(found.firstName, found.lastName);
        } else if (assignment?.teacher?.user) {
          staffName = ToFullNameByLocale(
            assignment.teacher.user.firstName,
            assignment.teacher.user.lastName
          );
        }
      }

      return {
        key: subjectId || idx,
        subjectId,
        subjectCode,
        subjectName,
        lessonsPerWeek: item.lessonsPerWeek || 0,
        typeText: item.type === 1 ? "Bắt buộc" : "Tự chọn",
        assignedStaffId: currentStaffId,
        assignedStaffName: staffName,
        assignmentId: assignment?.id || null,
      };
    });
  }, [curriculumSubjects, assignmentMap, assignments, staffs]);

  const stats = useMemo(() => {
    const total = tableData.length;
    const assigned = tableData.filter((r) => r.assignedStaffId != null).length;
    const unassigned = total - assigned;
    return { total, assigned, unassigned };
  }, [tableData]);

  const handleTeacherChange = (subjectId: number, staffId: number | null) => {
    setAssignmentMap((prev) => ({
      ...prev,
      [subjectId]: staffId,
    }));
  };

  const handleSaveAssignments = async () => {
    if (!classData?.id) return;
    setSubmitting(true);
    try {
      const payload = Object.entries(assignmentMap)
        .filter(([, staffId]) => staffId != null)
        .map(([subjectId, staffId]) => ({
          subjectId: Number(subjectId),
          staffId: Number(staffId),
        }));

      if (payload.length === 0) {
        message.warning("Vui lòng chọn ít nhất một giáo viên để phân công");
        setSubmitting(false);
        return;
      }

      const res = await callBatchAssignTeaching(
        classData.id,
        classData.schoolYearId || 1,
        selectedSemester,
        payload
      );

      if (res.error) {
        message.error(res.error.message || "Phân công giảng dạy thất bại");
      } else {
        message.success("Cập nhật phân công giảng dạy thành công!");
        setIsEditing(false);
        mutateAssignments();
      }
    } catch (err: any) {
      message.error(err.message || "Có lỗi xảy ra khi lưu phân công");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAssignment = async (assignmentId: number, subjectId: number) => {
    try {
      const res = await callDeleteTeachingAssignment(assignmentId);
      if (res.error) {
        message.error(res.error.message || "Xóa phân công thất bại");
      } else {
        message.success("Đã xóa phân công giảng dạy");
        setAssignmentMap((prev) => ({ ...prev, [subjectId]: null }));
        mutateAssignments();
      }
    } catch (err: any) {
      message.error(err.message || "Có lỗi khi xóa");
    }
  };

  const columns: ColumnsType<SubjectRow> = [
    {
      title: "STT",
      key: "index",
      width: 70,
      align: "center",
      render: (_val, _rec, idx) => idx + 1,
    },
    {
      title: "Mã môn",
      dataIndex: "subjectCode",
      key: "subjectCode",
      width: 130,
      render: (code) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: "Tên môn học",
      dataIndex: "subjectName",
      key: "subjectName",
      render: (name) => <GText strong>{name}</GText>,
    },
    {
      title: "Số tiết/tuần",
      dataIndex: "lessonsPerWeek",
      key: "lessonsPerWeek",
      width: 120,
      align: "center",
      render: (val) => `${val} tiết`,
    },
    {
      title: "Loại môn",
      dataIndex: "typeText",
      key: "typeText",
      width: 120,
      render: (txt) => (
        <Tag color={txt === "Bắt buộc" ? "cyan" : "default"}>{txt}</Tag>
      ),
    },
    {
      title: "Giáo viên giảng dạy",
      key: "teacher",
      width: 320,
      render: (_val, record) => {
        if (isEditing) {
          return (
            <Select
              style={{ width: "100%" }}
              placeholder="Chọn giáo viên bộ môn"
              allowClear
              showSearch
              value={record.assignedStaffId || undefined}
              onChange={(val) => handleTeacherChange(record.subjectId, val || null)}
              options={teacherOptions}
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
            />
          );
        }

        if (record.assignedStaffId) {
          return (
            <Space>
              <TeacherOutlined style={{ color: "#1890ff" }} />
              <GText strong style={{ color: "#1890ff" }}>
                {record.assignedStaffName}
              </GText>
            </Space>
          );
        }

        return <Tag color="warning">Chưa phân công</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      align: "center",
      render: (_val, record) => {
        if (!record.assignmentId) return null;
        return (
          <Popconfirm
            title="Xác nhận hủy phân công?"
            description={`Bạn có chắc muốn hủy phân công môn ${record.subjectName}?`}
            onConfirm={() =>
              record.assignmentId &&
              handleDeleteAssignment(record.assignmentId, record.subjectId)
            }
            okText="Hủy phân công"
            cancelText="Đóng"
          >
            <Tooltip title="Hủy phân công giáo viên">
              <Button
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        );
      },
    },
  ];

  if (!classData) return null;

  return (
    <Fragment>
      <Flex vertical gap={20}>
        {/* KPI / Statistics Banner */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Card size="small" bordered style={{ borderRadius: 8, background: "#f9fafb" }}>
              <Flex justify="space-between" align="center">
                <div>
                  <GText type="secondary">Tổng số môn học</GText>
                  <h3 style={{ margin: "4px 0 0", fontSize: 22, color: "#1f2937" }}>
                    {stats.total}
                  </h3>
                </div>
                <Tag color="processing" style={{ fontSize: 13, padding: "4px 10px" }}>
                  Chương trình chuẩn
                </Tag>
              </Flex>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card size="small" bordered style={{ borderRadius: 8, background: "#f0fdf4" }}>
              <Flex justify="space-between" align="center">
                <div>
                  <GText style={{ color: "#166534" }}>Đã phân công</GText>
                  <h3 style={{ margin: "4px 0 0", fontSize: 22, color: "#15803d" }}>
                    {stats.assigned}
                  </h3>
                </div>
                <CheckCircleOutlined style={{ fontSize: 26, color: "#22c55e" }} />
              </Flex>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card size="small" bordered style={{ borderRadius: 8, background: "#fffbeb" }}>
              <Flex justify="space-between" align="center">
                <div>
                  <GText style={{ color: "#92400e" }}>Chưa phân công</GText>
                  <h3 style={{ margin: "4px 0 0", fontSize: 22, color: "#b45309" }}>
                    {stats.unassigned}
                  </h3>
                </div>
                <CloseCircleOutlined style={{ fontSize: 26, color: "#f59e0b" }} />
              </Flex>
            </Card>
          </Col>
        </Row>

        {/* Toolbar & Controls */}
        <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
          <Space wrap size={12}>
            <Select
              style={{ width: 170 }}
              placeholder="Chọn học kỳ"
              allowClear
              value={selectedSemester}
              onChange={(val) => setSelectedSemester(val)}
              options={[
                { value: 1, label: "Học kỳ 1" },
                { value: 2, label: "Học kỳ 2" },
              ]}
            />
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                mutateSubjects();
                mutateAssignments();
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
                  onClick={handleSaveAssignments}
                >
                  Lưu phân công
                </Button>
              </>
            ) : (
              <Button
                type="primary"
                icon={<FormOutlined />}
                onClick={() => setIsEditing(true)}
              >
                Chỉnh sửa phân công
              </Button>
            )}
          </Space>
        </Flex>

        {/* Subjects & Teachers Table */}
        <Spin spinning={loadingSubjects || loadingAssignments || loadingStaffs}>
          {tableData.length === 0 && !loadingSubjects ? (
            <Card style={{ padding: 32, textAlign: "center" }}>
              <Empty
                description={
                  <span>
                    Lớp chưa có môn học thuộc chương trình đào tạo hoặc chưa gán chương trình học.
                    <br />
                    Vui lòng kiểm tra lại cấu hình lớp học tại tab Thông tin chung.
                  </span>
                }
              />
            </Card>
          ) : (
            <Table
              bordered
              columns={columns}
              dataSource={tableData}
              pagination={false}
              size="middle"
              rowKey="key"
            />
          )}
        </Spin>
      </Flex>
    </Fragment>
  );
}
