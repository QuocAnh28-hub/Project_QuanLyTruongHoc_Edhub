import {
  Button,
  Card,
  Col,
  Empty,
  Flex,
  Input,
  InputNumber,
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
  callBulkRecordScores,
  callCalculateSummary,
  StudentScoreRow,
  useClassScoreboard,
} from "../../../../../../hooks/school-only/academic-hooks";
import { useCurriculumSubjects } from "../../../../../../hooks/school-only/curriculums-hook";
import {
  downloadAuthenticatedFile,
  fetching_apis,
} from "../../../../../../utils/api-helpers";
import GText from "../../../../../atoms/g-text";
import {
  DownloadOutlined,
  FileSaveOutlined,
  ReloadOutlined,
  ThunderboltOutlined,
} from "../../../../../atoms/svg/outlined-icons";

export default function ClassDetailScoreboardView() {
  const { data: classData } = useClassDetailContext();
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);

  const [saving, setSaving] = useState<boolean>(false);
  const [calculating, setCalculating] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);

  // Local scores edit buffer: { [studentId]: Partial<StudentScoreRow> }
  const [scoresBuffer, setScoresBuffer] = useState<Record<number, Partial<StudentScoreRow>>>({});

  // Curriculum subjects to choose from
  const { data: curriculumSubjects, fetching: loadingSubjects } = useCurriculumSubjects(
    classData?.curriculumId || undefined,
    1,
    100
  );

  // Subject selector options
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
      };
    });
  }, [curriculumSubjects]);

  // Auto-select first subject if not selected yet
  useEffect(() => {
    if (!selectedSubjectId && subjectOptions.length > 0) {
      setSelectedSubjectId(subjectOptions[0].value);
    }
  }, [subjectOptions, selectedSubjectId]);

  // Scoreboard data from server
  const {
    data: scoreboardData,
    fetching: loadingScoreboard,
    mutate: mutateScoreboard,
  } = useClassScoreboard(
    classData?.id,
    selectedSubjectId,
    classData?.schoolYearId,
    selectedSemester
  );

  // Reset scores buffer when scoreboard data changes
  useEffect(() => {
    if (scoreboardData && scoreboardData.students) {
      const buf: Record<number, Partial<StudentScoreRow>> = {};
      scoreboardData.students.forEach((s) => {
        buf[s.studentId] = {
          tx1: s.tx1,
          tx2: s.tx2,
          tx3: s.tx3,
          tx4: s.tx4,
          midterm: s.midterm,
          final: s.final,
          comment: s.comment,
        };
      });
      setScoresBuffer(buf);
    }
  }, [scoreboardData]);

  const handleScoreChange = (
    studentId: number,
    field: "tx1" | "tx2" | "tx3" | "tx4" | "midterm" | "final",
    val: number | null
  ) => {
    setScoresBuffer((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: val,
      },
    }));
  };

  const handleCommentChange = (studentId: number, comment: string) => {
    setScoresBuffer((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        comment,
      },
    }));
  };

  // Save all entered scores
  const handleSaveScores = async () => {
    if (!classData?.id || !selectedSubjectId) return;
    setSaving(true);
    try {
      const scoreTypes: ("TX1" | "TX2" | "TX3" | "TX4" | "MIDTERM" | "FINAL")[] = [
        "TX1",
        "TX2",
        "TX3",
        "TX4",
        "MIDTERM",
        "FINAL",
      ];

      const fieldMap = {
        TX1: "tx1",
        TX2: "tx2",
        TX3: "tx3",
        TX4: "tx4",
        MIDTERM: "midterm",
        FINAL: "final",
      } as const;

      let hasSavedAny = false;

      // Submit bulk for each score type
      for (const st of scoreTypes) {
        const fieldName = fieldMap[st];
        const studentScores: { studentId: number; score?: number; comment?: string }[] = [];

        Object.entries(scoresBuffer).forEach(([studentIdStr, studentObj]) => {
          const scoreVal = (studentObj as any)[fieldName];
          if (scoreVal !== undefined && scoreVal !== null) {
            studentScores.push({
              studentId: Number(studentIdStr),
              score: Number(scoreVal),
              comment: studentObj.comment || undefined,
            });
          }
        });

        if (studentScores.length > 0) {
          await callBulkRecordScores(classData.id, {
            schoolYearId: classData.schoolYearId || 1,
            semesterId: selectedSemester,
            subjectId: selectedSubjectId,
            scoreType: st,
            scores: studentScores,
          });
          hasSavedAny = true;
        }
      }

      message.success(
        hasSavedAny
          ? "Đã lưu sổ điểm môn học thành công!"
          : "Không có thay đổi điểm số mới để lưu"
      );
      mutateScoreboard();
    } catch (err: any) {
      message.error(err.message || "Có lỗi xảy ra khi lưu điểm");
    } finally {
      setSaving(false);
    }
  };

  // Auto calculate semester average
  const handleCalculateSummary = async () => {
    if (!classData?.id || !selectedSubjectId) return;
    setCalculating(true);
    try {
      const res = await callCalculateSummary(classData.id, {
        schoolYearId: classData.schoolYearId || 1,
        semesterId: selectedSemester,
        subjectId: selectedSubjectId,
      });

      if (res.error) {
        message.error(res.error.message || "Tính điểm trung bình thất bại");
      } else {
        message.success(
          `Đã tính xong ĐTB cho môn học (${res.data?.count || 0} học sinh được cập nhật)`
        );
        mutateScoreboard();
      }
    } catch (err: any) {
      message.error(err.message || "Lỗi khi tính điểm");
    } finally {
      setCalculating(false);
    }
  };

  // Export scoreboard to CSV
  const handleExportScoreboard = async () => {
    if (!classData?.id || !selectedSubjectId) return;
    setExporting(true);
    try {
      const path = `${fetching_apis.exports_class_scoreboard.replace(
        "{classId}",
        classData.id + ""
      )}?subjectId=${selectedSubjectId}&schoolYearId=${classData.schoolYearId || 1}&semesterId=${selectedSemester}`;

      await downloadAuthenticatedFile(
        path,
        `SoDiem_Lop_${classData.name || classData.id}_Mon_${selectedSubjectId}_HK${selectedSemester}.csv`
      );
      message.success("Xuất sổ điểm thành công!");
    } catch (err: any) {
      message.error(err.message || "Lỗi khi xuất sổ điểm");
    } finally {
      setExporting(false);
    }
  };

  // Summary statistics
  const stats = useMemo(() => {
    const list = scoreboardData?.students || [];
    const total = list.length;
    let scoredCount = 0;
    let passedCount = 0;
    let sumAvg = 0;
    let validAvgCount = 0;

    list.forEach((s) => {
      if (s.averageScore != null) {
        sumAvg += s.averageScore;
        validAvgCount++;
        if (s.averageScore >= 5.0) passedCount++;
      }
      if (s.tx1 != null || s.midterm != null || s.final != null) {
        scoredCount++;
      }
    });

    const classAverage = validAvgCount > 0 ? (sumAvg / validAvgCount).toFixed(2) : "0.00";
    const passRate = validAvgCount > 0 ? Math.round((passedCount / validAvgCount) * 100) : 0;

    return { total, scoredCount, classAverage, passRate };
  }, [scoreboardData]);

  const columns: ColumnsType<StudentScoreRow> = [
    {
      title: "STT",
      key: "index",
      width: 55,
      align: "center",
      render: (_val, _rec, idx) => idx + 1,
    },
    {
      title: "Mã học sinh",
      dataIndex: "studentCode",
      key: "studentCode",
      width: 130,
      render: (code) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: "Họ và tên",
      key: "fullName",
      width: 200,
      render: (_val, record) => (
        <GText strong>
          {record.lastName} {record.firstName}
        </GText>
      ),
    },
    // Evaluation Frequent (ĐGTX)
    {
      title: "TX 1",
      key: "tx1",
      width: 80,
      align: "center",
      render: (_val, record) => (
        <InputNumber
          min={0}
          max={10}
          step={0.1}
          size="small"
          style={{ width: "100%" }}
          value={scoresBuffer[record.studentId]?.tx1 ?? record.tx1 ?? undefined}
          onChange={(val) => handleScoreChange(record.studentId, "tx1", val)}
        />
      ),
    },
    {
      title: "TX 2",
      key: "tx2",
      width: 80,
      align: "center",
      render: (_val, record) => (
        <InputNumber
          min={0}
          max={10}
          step={0.1}
          size="small"
          style={{ width: "100%" }}
          value={scoresBuffer[record.studentId]?.tx2 ?? record.tx2 ?? undefined}
          onChange={(val) => handleScoreChange(record.studentId, "tx2", val)}
        />
      ),
    },
    {
      title: "TX 3",
      key: "tx3",
      width: 80,
      align: "center",
      render: (_val, record) => (
        <InputNumber
          min={0}
          max={10}
          step={0.1}
          size="small"
          style={{ width: "100%" }}
          value={scoresBuffer[record.studentId]?.tx3 ?? record.tx3 ?? undefined}
          onChange={(val) => handleScoreChange(record.studentId, "tx3", val)}
        />
      ),
    },
    {
      title: "TX 4",
      key: "tx4",
      width: 80,
      align: "center",
      render: (_val, record) => (
        <InputNumber
          min={0}
          max={10}
          step={0.1}
          size="small"
          style={{ width: "100%" }}
          value={scoresBuffer[record.studentId]?.tx4 ?? record.tx4 ?? undefined}
          onChange={(val) => handleScoreChange(record.studentId, "tx4", val)}
        />
      ),
    },
    // Midterm (ĐGĐK GK)
    {
      title: "Giữa kỳ (x2)",
      key: "midterm",
      width: 100,
      align: "center",
      render: (_val, record) => (
        <InputNumber
          min={0}
          max={10}
          step={0.1}
          size="small"
          style={{ width: "100%", borderColor: "#93c5fd" }}
          value={scoresBuffer[record.studentId]?.midterm ?? record.midterm ?? undefined}
          onChange={(val) => handleScoreChange(record.studentId, "midterm", val)}
        />
      ),
    },
    // Final (ĐGĐK CK)
    {
      title: "Cuối kỳ (x3)",
      key: "final",
      width: 100,
      align: "center",
      render: (_val, record) => (
        <InputNumber
          min={0}
          max={10}
          step={0.1}
          size="small"
          style={{ width: "100%", borderColor: "#fca5a5" }}
          value={scoresBuffer[record.studentId]?.final ?? record.final ?? undefined}
          onChange={(val) => handleScoreChange(record.studentId, "final", val)}
        />
      ),
    },
    // Average
    {
      title: "ĐTB Môn",
      dataIndex: "averageScore",
      key: "averageScore",
      width: 100,
      align: "center",
      render: (avg) => {
        if (avg == null) return <GText type="secondary">-</GText>;
        let color = "#ef4444";
        if (avg >= 8.0) color = "#15803d";
        else if (avg >= 6.5) color = "#2563eb";
        else if (avg >= 5.0) color = "#d97706";

        return (
          <Tag color={color} style={{ fontSize: 13, fontWeight: "bold", padding: "2px 8px" }}>
            {Number(avg).toFixed(1)}
          </Tag>
        );
      },
    },
    // Evaluation
    {
      title: "Đánh giá",
      dataIndex: "evaluation",
      key: "evaluation",
      width: 100,
      align: "center",
      render: (evalText) => {
        if (!evalText) return <Tag>Chưa xét</Tag>;
        const isGood = evalText === "Tốt" || evalText === "Đạt";
        return <Tag color={isGood ? "success" : "error"}>{evalText}</Tag>;
      },
    },
    // Comment
    {
      title: "Ghi chú / Nhận xét",
      key: "comment",
      render: (_val, record) => (
        <Input
          size="small"
          placeholder="Nhận xét giáo viên..."
          value={scoresBuffer[record.studentId]?.comment ?? record.comment ?? ""}
          onChange={(e) => handleCommentChange(record.studentId, e.target.value)}
        />
      ),
    },
  ];

  if (!classData) return null;

  return (
    <Fragment>
      <Flex vertical gap={20}>
        {/* KPI Summary Cards */}
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={6}>
            <Card size="small" bordered style={{ borderRadius: 8, background: "#f9fafb" }}>
              <GText type="secondary">Sĩ số lớp</GText>
              <h3 style={{ margin: "4px 0 0", fontSize: 20 }}>{stats.total} học sinh</h3>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card size="small" bordered style={{ borderRadius: 8, background: "#eff6ff" }}>
              <GText style={{ color: "#1e40af" }}>Đã nhập điểm</GText>
              <h3 style={{ margin: "4px 0 0", fontSize: 20, color: "#2563eb" }}>
                {stats.scoredCount} / {stats.total}
              </h3>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card size="small" bordered style={{ borderRadius: 8, background: "#f0fdf4" }}>
              <GText style={{ color: "#166534" }}>ĐTB chung môn</GText>
              <h3 style={{ margin: "4px 0 0", fontSize: 20, color: "#15803d" }}>
                {stats.classAverage}
              </h3>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card size="small" bordered style={{ borderRadius: 8, background: "#fefce8" }}>
              <GText style={{ color: "#854d0e" }}>Tỷ lệ đạt (&gt;=5.0)</GText>
              <h3 style={{ margin: "4px 0 0", fontSize: 20, color: "#ca8a04" }}>
                {stats.passRate}%
              </h3>
            </Card>
          </Col>
        </Row>

        {/* Toolbar & Actions */}
        <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
          <Space wrap size={12}>
            <Select
              style={{ width: 220 }}
              placeholder="Chọn môn học"
              value={selectedSubjectId}
              onChange={(val) => setSelectedSubjectId(val)}
              options={subjectOptions}
              loading={loadingSubjects}
            />
            <Select
              style={{ width: 140 }}
              value={selectedSemester}
              onChange={(val) => setSelectedSemester(val)}
              options={[
                { value: 1, label: "Học kỳ 1" },
                { value: 2, label: "Học kỳ 2" },
              ]}
            />
            <Button icon={<ReloadOutlined />} onClick={() => mutateScoreboard()}>
              Làm mới
            </Button>
          </Space>

          <Space size={12} wrap>
            <Popconfirm
              title="Tính điểm trung bình học kỳ?"
              description="Hệ thống sẽ tự động tính ĐTB theo trọng số Bộ GD&ĐT (TX*1, GK*2, CK*3) cho toàn bộ học sinh."
              onConfirm={handleCalculateSummary}
              okText="Tính ngay"
              cancelText="Hủy"
            >
              <Button
                icon={<ThunderboltOutlined />}
                loading={calculating}
              >
                Tính ĐTB Môn
              </Button>
            </Popconfirm>

            <Button
              icon={<DownloadOutlined />}
              loading={exporting}
              onClick={handleExportScoreboard}
            >
              Xuất Excel
            </Button>

            <Button
              type="primary"
              icon={<FileSaveOutlined />}
              loading={saving}
              onClick={handleSaveScores}
            >
              Lưu điểm
            </Button>
          </Space>
        </Flex>

        {/* Scoreboard Table */}
        <Spin spinning={loadingScoreboard || loadingSubjects}>
          {!scoreboardData?.students || scoreboardData.students.length === 0 ? (
            <Card style={{ padding: 40, textAlign: "center" }}>
              <Empty
                description={
                  <span>
                    Chưa có dữ liệu học sinh hoặc chưa chọn môn học.
                    <br />
                    Vui lòng chọn môn học ở thanh công cụ trên.
                  </span>
                }
              />
            </Card>
          ) : (
            <Table
              bordered
              columns={columns}
              dataSource={scoreboardData.students}
              pagination={false}
              size="middle"
              rowKey="studentId"
              scroll={{ x: 1200 }}
            />
          )}
        </Spin>
      </Flex>
    </Fragment>
  );
}
