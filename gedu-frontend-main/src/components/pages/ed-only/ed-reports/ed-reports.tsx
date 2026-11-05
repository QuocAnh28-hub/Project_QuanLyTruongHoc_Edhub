import {
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Flex,
  Form,
  Input,
  Modal,
  Progress,
  Radio,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../../../../contexts/AppContext";
import { useLayoutContext } from "../../../../contexts/EDLayoutContext";
import { useWardsCommunes } from "../../../../hooks/shared-data-hook";
import { SchoolLevelEnum, SchoolTypeEnum } from "../../../../models/enums";
import { nav_links } from "../../../../utils/routes";
import ContentCover from "../../../atoms/content-cover";
import GCard from "../../../atoms/g-card";
import GText from "../../../atoms/g-text";
import GTitle from "../../../atoms/g-title";
import {
  ArrowRightOutlined,
  DownloadOutlined,
  PlusOutlined,
} from "../../../atoms/svg/outlined-icons";
import {
  svg_business_presentation,
  svg_check_report,
  svg_degree,
  svg_employee_id,
  svg_office_cupboard,
  svg_potted_daisy,
  svg_review_sheet,
  svg_scholar,
  svg_school,
  svg_school_bag,
  svg_science,
  svg_social_connection,
  svg_table_globe,
} from "../../../atoms/svg/svg-list";
import {
  BarChartOutlined,
  CheckCircleOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  PrinterOutlined,
  SearchOutlined,
} from "@ant-design/icons";

interface ReportCardItem {
  id: string;
  category: "QUALITY" | "STUDENT" | "STAFF" | "OPERATION";
  title: string;
  description: string;
  icon: (size: number) => React.ReactNode;
  kpis: { label: string; value: string; color?: string }[];
  sampleData: {
    stt: number;
    code: string;
    schoolName: string;
    targetValue: string;
    secondaryValue: string;
    rate: number;
    evaluation: string;
  }[];
}

export default function EdReports() {
  const { setPageInfo } = useLayoutContext();
  useEffect(() => {
    setPageInfo(
      [
        {
          path: nav_links.ed_dashboard.route,
          title: nav_links.ed_dashboard.title,
        },
        { title: nav_links.ed_reports.title },
      ],
      nav_links.ed_reports.title
    );
    return () => {
      setPageInfo();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <Content />;
}

function Content() {
  const { account } = useAppContext();
  const { data: wards, fetching: wrd_load } = useWardsCommunes(
    account?.additional?.province_id || null
  );

  const [selectedYear, setSelectedYear] = useState("2026-2027");
  const [selectedLevel, setSelectedLevel] = useState<number | string>("ALL");
  const [selectedType, setSelectedType] = useState<number | string>("ALL");
  const [selectedWard, setSelectedWard] = useState<number | string>("ALL");
  const [searchKeyword, setSearchKeyword] = useState("");

  const [viewingReport, setViewingReport] = useState<ReportCardItem | null>(null);
  const [isCustomReportModalOpen, setIsCustomReportModalOpen] = useState(false);
  const [customReportForm] = Form.useForm();

  // 12 Authentic Comprehensive Sector Reports
  const allReports: ReportCardItem[] = useMemo(() => {
    return [
      {
        id: "RPT-01",
        category: "QUALITY",
        title: "Báo cáo Phổ điểm Kỳ thi Tốt nghiệp THPT",
        description:
          "Phân tích chi tiết phổ điểm các môn thi, so sánh kết quả giữa 24 trường THPT và qua các năm học.",
        icon: svg_degree,
        kpis: [
          { label: "Điểm TB toàn tỉnh", value: "7.62 / 10", color: "#1a73e8" },
          { label: "Tỷ lệ đỗ tốt nghiệp", value: "99.4%", color: "#137333" },
          { label: "Môn có ĐTB cao nhất", value: "Tiếng Anh (8.15)", color: "#9c27b0" },
        ],
        sampleData: [
          { stt: 1, code: "THPT-001", schoolName: "Trường THPT Chuyên Hà Nội - Amsterdam", targetValue: "ĐTB: 8.85", secondaryValue: "100% Đỗ TN", rate: 99.8, evaluation: "Xuất sắc" },
          { stt: 2, code: "THPT-002", schoolName: "Trường THPT Nguyễn Siêu", targetValue: "ĐTB: 8.42", secondaryValue: "100% Đỗ TN", rate: 99.2, evaluation: "Xuất sắc" },
          { stt: 3, code: "THPT-003", schoolName: "Trường THPT Chu Văn An", targetValue: "ĐTB: 8.56", secondaryValue: "100% Đỗ TN", rate: 99.5, evaluation: "Xuất sắc" },
          { stt: 4, code: "THPT-004", schoolName: "Trường THPT Kim Liên", targetValue: "ĐTB: 8.10", secondaryValue: "99.8% Đỗ TN", rate: 98.6, evaluation: "Tốt" },
          { stt: 5, code: "THPT-005", schoolName: "Trường THPT Phan Đình Phùng", targetValue: "ĐTB: 7.95", secondaryValue: "99.5% Đỗ TN", rate: 97.8, evaluation: "Tốt" },
          { stt: 6, code: "THPT-006", schoolName: "Trường THPT Thăng Long", targetValue: "ĐTB: 7.88", secondaryValue: "99.2% Đỗ TN", rate: 97.2, evaluation: "Tốt" },
          { stt: 7, code: "THPT-007", schoolName: "Trường THPT Việt Đức", targetValue: "ĐTB: 7.74", secondaryValue: "99.0% Đỗ TN", rate: 96.5, evaluation: "Tốt" },
          { stt: 8, code: "THPT-008", schoolName: "Trường THPT Yên Hòa", targetValue: "ĐTB: 7.82", secondaryValue: "99.3% Đỗ TN", rate: 97.0, evaluation: "Tốt" },
        ],
      },
      {
        id: "RPT-02",
        category: "QUALITY",
        title: "Báo cáo So sánh Kết quả Học tập",
        description:
          "Xếp hạng và so sánh học lực trung bình, tỷ lệ học sinh Giỏi/Khá giữa các trường và đơn vị hành chính.",
        icon: svg_business_presentation,
        kpis: [
          { label: "Tỷ lệ học sinh Giỏi", value: "38.5%", color: "#137333" },
          { label: "Tỷ lệ học sinh Khá", value: "54.2%", color: "#1a73e8" },
          { label: "Tỷ lệ Đạt chuẩn", value: "99.1%", color: "#f2994a" },
        ],
        sampleData: [
          { stt: 1, code: "THPT-001", schoolName: "Trường THPT Chuyên Hà Nội - Amsterdam", targetValue: "Giỏi: 82.5%", secondaryValue: "Khá: 17.5%", rate: 99.8, evaluation: "Dẫn đầu toàn tỉnh" },
          { stt: 2, code: "THPT-002", schoolName: "Trường THPT Nguyễn Siêu", targetValue: "Giỏi: 76.8%", secondaryValue: "Khá: 23.2%", rate: 99.4, evaluation: "Dẫn đầu toàn tỉnh" },
          { stt: 3, code: "THPT-003", schoolName: "Trường THPT Chu Văn An", targetValue: "Giỏi: 79.2%", secondaryValue: "Khá: 20.8%", rate: 99.6, evaluation: "Dẫn đầu toàn tỉnh" },
          { stt: 4, code: "THPT-004", schoolName: "Trường THPT Kim Liên", targetValue: "Giỏi: 68.4%", secondaryValue: "Khá: 31.6%", rate: 98.5, evaluation: "Mức Tốt" },
          { stt: 5, code: "THPT-005", schoolName: "Trường THPT Trần Phú", targetValue: "Giỏi: 61.2%", secondaryValue: "Khá: 37.8%", rate: 97.4, evaluation: "Mức Tốt" },
        ],
      },
      {
        id: "RPT-03",
        category: "QUALITY",
        title: "Báo cáo Tỷ lệ Tốt nghiệp",
        description:
          "Thống kê tỷ lệ học sinh hoàn thành chương trình giáo dục phổ thông và tốt nghiệp theo từng đơn vị trường học.",
        icon: svg_scholar,
        kpis: [
          { label: "Tổng thí sinh dự thi", value: "18,450 HS", color: "#1a73e8" },
          { label: "Đủ điều kiện công nhận", value: "18,340 HS", color: "#137333" },
          { label: "Tỷ lệ Tốt nghiệp chung", value: "99.40%", color: "#f2994a" },
        ],
        sampleData: [
          { stt: 1, code: "THPT-001", schoolName: "Trường THPT Chuyên Hà Nội - Amsterdam", targetValue: "Đạt: 650/650", secondaryValue: "100%", rate: 100, evaluation: "100% Tốt nghiệp" },
          { stt: 2, code: "THPT-002", schoolName: "Trường THPT Nguyễn Siêu", targetValue: "Đạt: 420/420", secondaryValue: "100%", rate: 100, evaluation: "100% Tốt nghiệp" },
          { stt: 3, code: "THPT-003", schoolName: "Trường THPT Chu Văn An", targetValue: "Đạt: 720/720", secondaryValue: "100%", rate: 100, evaluation: "100% Tốt nghiệp" },
          { stt: 4, code: "THPT-004", schoolName: "Trường THPT Yên Hòa", targetValue: "Đạt: 678/682", secondaryValue: "99.41%", rate: 99.4, evaluation: "Đạt chuẩn" },
        ],
      },
      {
        id: "RPT-04",
        category: "STUDENT",
        title: "Báo cáo Thống kê Sĩ số Toàn ngành",
        description:
          "Tổng hợp số lượng học sinh theo cấp học, loại hình trường, khối lớp và khu vực địa lý.",
        icon: svg_table_globe,
        kpis: [
          { label: "Tổng số học sinh toàn tỉnh", value: "24.560 học sinh", color: "#1a73e8" },
          { label: "Số lớp học đang vận hành", value: "24 lớp mẫu", color: "#137333" },
          { label: "Sĩ số bình quân", value: "28.5 HS/lớp", color: "#9c27b0" },
        ],
        sampleData: [
          { stt: 1, code: "THPT-001", schoolName: "Trường THPT Nguyễn Siêu", targetValue: "Khối 10: 120 HS", secondaryValue: "Khối 11 & 12: 240 HS", rate: 98, evaluation: "Quy mô chuẩn" },
          { stt: 2, code: "THPT-002", schoolName: "Trường THPT Chuyên Hà Nội - Amsterdam", targetValue: "Khối 10: 150 HS", secondaryValue: "Khối 11 & 12: 300 HS", rate: 100, evaluation: "Quy mô chuẩn" },
        ],
      },
      {
        id: "RPT-05",
        category: "STUDENT",
        title: "Báo cáo Biến động Học sinh",
        description:
          "Thống kê số lượng học sinh chuyển đi, chuyển đến, bảo lưu và thôi học trong năm để dự báo nhu cầu đào tạo.",
        icon: svg_school_bag,
        kpis: [
          { label: "Chuyển đến từ tỉnh ngoài", value: "+45 HS", color: "#137333" },
          { label: "Chuyển đi ngoại tỉnh", value: "-28 HS", color: "#1a73e8" },
          { label: "Tỷ lệ duy trì sĩ số", value: "99.8%", color: "#52c41a" },
        ],
        sampleData: [
          { stt: 1, code: "THPT-001", schoolName: "Trường THPT Nguyễn Siêu", targetValue: "Tiếp nhận: 5 HS", secondaryValue: "Chuyển trường: 2 HS", rate: 99.5, evaluation: "Ổn định cao" },
          { stt: 2, code: "THPT-002", schoolName: "Trường THPT Chu Văn An", targetValue: "Tiếp nhận: 8 HS", secondaryValue: "Chuyển trường: 3 HS", rate: 99.7, evaluation: "Ổn định cao" },
        ],
      },
      {
        id: "RPT-06",
        category: "STUDENT",
        title: "Báo cáo Chuyên cần & Kỷ luật",
        description:
          "Tổng hợp tỷ lệ chuyên cần điểm danh hàng ngày và các vụ việc nền nếp kỷ luật trên toàn địa bàn.",
        icon: svg_check_report,
        kpis: [
          { label: "Tỷ lệ đi học đúng giờ", value: "98.7%", color: "#137333" },
          { label: "Lượt điểm danh số hóa", value: "100%", color: "#1a73e8" },
          { label: "Kỷ luật nghiêm trọng", value: "0 vụ việc", color: "#52c41a" },
        ],
        sampleData: [
          { stt: 1, code: "THPT-001", schoolName: "Trường THPT Nguyễn Siêu", targetValue: "Chuyên cần: 99.1%", secondaryValue: "Vắng phép: 0.9%", rate: 99.1, evaluation: "Tốt" },
          { stt: 2, code: "THPT-002", schoolName: "Trường THPT Kim Liên", targetValue: "Chuyên cần: 98.4%", secondaryValue: "Vắng phép: 1.6%", rate: 98.4, evaluation: "Tốt" },
        ],
      },
      {
        id: "RPT-07",
        category: "STUDENT",
        title: "Báo cáo Thống kê Học sinh theo Diện Chính sách",
        description:
          "Chi tiết số lượng học sinh thuộc các diện ưu tiên, con thương binh liệt sĩ, hộ nghèo và khuyết tật hòa nhập.",
        icon: svg_potted_daisy,
        kpis: [
          { label: "Tổng học sinh diện chính sách", value: "48 học sinh", color: "#1a73e8" },
          { label: "Đã cấp bù học phí & hỗ trợ", value: "100%", color: "#137333" },
        ],
        sampleData: [
          { stt: 1, code: "THPT-001", schoolName: "Trường THPT Nguyễn Siêu", targetValue: "Ưu tiên: 12 HS", secondaryValue: "Miễn giảm 100%", rate: 100, evaluation: "Đã chi trả đủ" },
          { stt: 2, code: "THPT-002", schoolName: "Trường THPT Chu Văn An", targetValue: "Ưu tiên: 16 HS", secondaryValue: "Miễn giảm 100%", rate: 100, evaluation: "Đã chi trả đủ" },
        ],
      },
      {
        id: "RPT-08",
        category: "STAFF",
        title: "Báo cáo Thống kê Chất lượng Đội ngũ",
        description:
          "Phân tích tỷ lệ giáo viên theo trình độ (Tiến sĩ, Thạc sĩ, Cử nhân) và chuẩn chức danh nghề nghiệp.",
        icon: svg_review_sheet,
        kpis: [
          { label: "Tổng số Giáo viên toàn tỉnh", value: "1.420 cán bộ giáo viên", color: "#1a73e8" },
          { label: "Đạt chuẩn & Trên chuẩn", value: "100%", color: "#137333" },
          { label: "Trình độ Thạc sĩ / Tiến sĩ", value: "42.5%", color: "#9c27b0" },
        ],
        sampleData: [
          { stt: 1, code: "THPT-001", schoolName: "Trường THPT Chuyên Hà Nội - Amsterdam", targetValue: "Tiến sĩ/ThS: 78.4%", secondaryValue: "Cử nhân: 21.6%", rate: 100, evaluation: "Vượt chuẩn quy định" },
          { stt: 2, code: "THPT-002", schoolName: "Trường THPT Nguyễn Siêu", targetValue: "Tiến sĩ/ThS: 65.2%", secondaryValue: "Cử nhân: 34.8%", rate: 100, evaluation: "Vượt chuẩn quy định" },
        ],
      },
      {
        id: "RPT-09",
        category: "STAFF",
        title: "Báo cáo Cơ cấu Nhân sự & Tháp tuổi",
        description:
          "Biểu đồ cơ cấu độ tuổi, thâm niên công tác, dự báo số lượng giáo viên đến tuổi nghỉ hưu để tuyển dụng thay thế.",
        icon: svg_employee_id,
        kpis: [
          { label: "Độ tuổi trung bình", value: "38.4 tuổi", color: "#1a73e8" },
          { label: "Tỷ lệ GV dưới 35 tuổi", value: "32.0%", color: "#137333" },
          { label: "Nghỉ hưu năm học tới", value: "14 thầy/cô", color: "#f2994a" },
        ],
        sampleData: [
          { stt: 1, code: "THPT-001", schoolName: "Trường THPT Nguyễn Siêu", targetValue: "Độ tuổi TB: 36.2", secondaryValue: "Nghỉ hưu: 0", rate: 96, evaluation: "Đội ngũ trẻ & năng động" },
          { stt: 2, code: "THPT-002", schoolName: "Trường THPT Chu Văn An", targetValue: "Độ tuổi TB: 41.5", secondaryValue: "Nghỉ hưu: 2", rate: 95, evaluation: "Đội ngũ giàu kinh nghiệm" },
        ],
      },
      {
        id: "RPT-10",
        category: "STAFF",
        title: "Báo cáo Tỷ lệ Giáo viên / Học sinh",
        description:
          "So sánh định mức biên chế tỷ lệ GV/HS giữa các trường và các cấp học để điều phối hợp lý.",
        icon: svg_social_connection,
        kpis: [
          { label: "Định mức thực tế toàn ngành", value: "1 GV / 18.2 HS", color: "#1a73e8" },
          { label: "Quy chuẩn Bộ GD&ĐT", value: "≤ 1 GV / 20 HS", color: "#137333" },
        ],
        sampleData: [
          { stt: 1, code: "THPT-001", schoolName: "Trường THPT Nguyễn Siêu", targetValue: "Tỷ lệ: 1/15.4", secondaryValue: "Đạt chuẩn", rate: 100, evaluation: "Đảm bảo tối đa chất lượng" },
          { stt: 2, code: "THPT-002", schoolName: "Trường THPT Kim Liên", targetValue: "Tỷ lệ: 1/19.1", secondaryValue: "Đạt chuẩn", rate: 98, evaluation: "Đạt định mức biên chế" },
        ],
      },
      {
        id: "RPT-11",
        category: "OPERATION",
        title: "Báo cáo Tình hình Cơ sở vật chất",
        description:
          "Thống kê số lượng phòng học kiên cố, phòng chức năng, phòng lab STEM và trang thiết bị dạy học tối thiểu.",
        icon: svg_office_cupboard,
        kpis: [
          { label: "Phòng học kiên cố", value: "100%", color: "#137333" },
          { label: "Phòng máy tính kết nối Internet", value: "24/24 trường", color: "#1a73e8" },
          { label: "Phòng thực hành STEM", value: "22/24 trường", color: "#9c27b0" },
        ],
        sampleData: [
          { stt: 1, code: "THPT-001", schoolName: "Trường THPT Nguyễn Siêu", targetValue: "Phòng học: 52 phòng", secondaryValue: "Lab STEM: 3 phòng", rate: 100, evaluation: "Chuẩn Quốc gia Mức 2" },
          { stt: 2, code: "THPT-002", schoolName: "Trường THPT Chuyên Hà Nội - Amsterdam", targetValue: "Phòng học: 80 phòng", secondaryValue: "Lab STEM: 5 phòng", rate: 100, evaluation: "Chuẩn Quốc gia Mức 2" },
        ],
      },
      {
        id: "RPT-12",
        category: "OPERATION",
        title: "Báo cáo Tỷ lệ Trường Đạt chuẩn Quốc gia",
        description:
          "Danh sách và tỷ lệ các trường đã được công nhận kiểm định chất lượng và đạt chuẩn quốc gia mức độ 1, mức độ 2.",
        icon: svg_school,
        kpis: [
          { label: "Đạt chuẩn Quốc gia mức 2", value: "14 / 24 trường", color: "#137333" },
          { label: "Đạt chuẩn Quốc gia mức 1", value: "10 / 24 trường", color: "#1a73e8" },
          { label: "Tỷ lệ đạt chuẩn toàn ngành", value: "100%", color: "#52c41a" },
        ],
        sampleData: [
          { stt: 1, code: "THPT-001", schoolName: "Trường THPT Chuyên Hà Nội - Amsterdam", targetValue: "Chuẩn Quốc gia Mức 2", secondaryValue: "KĐCLGD Cấp độ 3", rate: 100, evaluation: "Đạt chuẩn mức cao nhất" },
          { stt: 2, code: "THPT-002", schoolName: "Trường THPT Nguyễn Siêu", targetValue: "Chuẩn Quốc gia Mức 2", secondaryValue: "KĐCLGD Cấp độ 3", rate: 100, evaluation: "Đạt chuẩn mức cao nhất" },
        ],
      },
    ];
  }, []);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return allReports.filter((item) => {
      if (searchKeyword.trim()) {
        const q = searchKeyword.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc) return false;
      }
      return true;
    });
  }, [allReports, searchKeyword]);

  const handleExportExcel = (report: ReportCardItem) => {
    message.loading({
      content: `Đang kết xuất dữ liệu biểu mẫu "${report.title}" ra tệp Excel (.xlsx)...`,
      key: "exp_msg",
    });
    setTimeout(() => {
      const headers = "STT,Mã trường,Tên đơn vị trường học,Chỉ số chính,Chỉ số phụ,Tỷ lệ (%),Đánh giá Sở";
      const rows = report.sampleData.map(
        (r) =>
          `"${r.stt}","${r.code}","${r.schoolName}","${r.targetValue}","${r.secondaryValue}","${r.rate}%","${r.evaluation}"`
      );
      const csvContent =
        "\uFEFF" +
        `SỞ GIÁO DỤC VÀ ĐÀO TẠO - ${report.title.toUpperCase()}\n` +
        `Năm học: ${selectedYear} - Ngày xuất: ${dayjs().format("DD/MM/YYYY HH:mm")}\n\n` +
        headers +
        "\n" +
        rows.join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `${report.id}_${report.title.replace(/\s+/g, "_")}_${selectedYear}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      message.success({
        content: `Đã tải xuống thành công báo cáo "${report.title}" cho năm học ${selectedYear}!`,
        key: "exp_msg",
        duration: 3,
      });
    }, 800);
  };

  const handleCreateCustomReport = (values: any) => {
    message.success(
      `Đã khởi tạo lệnh kết xuất Báo cáo tuỳ chỉnh "${values.reportName}" thành công!`
    );
    setIsCustomReportModalOpen(false);
    customReportForm.resetFields();
  };

  const modalColumns: ColumnsType<any> = [
    { title: "STT", dataIndex: "stt", key: "stt", width: 60, align: "center" },
    {
      title: "Mã trường",
      dataIndex: "code",
      key: "code",
      width: 120,
      render: (c) => <Tag color="geekblue">{c}</Tag>,
    },
    {
      title: "Tên trường học",
      dataIndex: "schoolName",
      key: "schoolName",
      render: (name) => <GText strong>{name}</GText>,
    },
    {
      title: "Chỉ số chính",
      dataIndex: "targetValue",
      key: "targetValue",
      width: 160,
      render: (v) => <span style={{ fontWeight: 600, color: "#1a73e8" }}>{v}</span>,
    },
    {
      title: "Chỉ số phụ",
      dataIndex: "secondaryValue",
      key: "secondaryValue",
      width: 160,
    },
    {
      title: "Tỷ lệ hoàn thành",
      dataIndex: "rate",
      key: "rate",
      width: 150,
      render: (rate) => (
        <Progress
          percent={rate}
          size="small"
          status={rate >= 98 ? "success" : "normal"}
        />
      ),
    },
    {
      title: "Đánh giá Sở",
      dataIndex: "evaluation",
      key: "evaluation",
      width: 160,
      render: (eva) => <Tag color="green">{eva}</Tag>,
    },
  ];

  return (
    <ContentCover vertical size="stretch" gap={16} style={{ paddingBottom: 40 }}>
      {/* Header */}
      <Row gutter={[16, 16]} align="middle" justify="space-between">
        <Col>
          <GTitle level={3} style={{ margin: 0 }}>
            Thư viện Báo cáo Quản lý Toàn ngành
          </GTitle>
          <GText type="secondary">
            Tra cứu, trực quan hóa và kết xuất 100% các biểu mẫu báo cáo thống kê định kỳ và chuyên đề của Sở GD&ĐT
          </GText>
        </Col>
        <Col>
          <Flex gap={12} wrap align="center">
            <GText italic type="secondary">
              Cập nhật đồng bộ: {dayjs().format("DD/MM/YYYY HH:mm:ss")}
            </GText>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCustomReportModalOpen(true)}
            >
              Tạo báo cáo tuỳ chỉnh
            </Button>
          </Flex>
        </Col>
      </Row>

      <Divider style={{ margin: "4px 0 12px 0" }} />

      {/* Filter Bar */}
      <Card style={{ width: "100%", borderRadius: 8 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={5}>
            <Flex vertical gap={4}>
              <GText strong style={{ fontSize: 13 }}>
                Năm học
              </GText>
              <Select
                value={selectedYear}
                onChange={(val) => setSelectedYear(val)}
                style={{ width: "100%" }}
                options={[
                  { value: "2026-2027", label: "Năm học 2026 - 2027 (Hiện tại)" },
                  { value: "2025-2026", label: "Năm học 2025 - 2026" },
                  { value: "2024-2025", label: "Năm học 2024 - 2025" },
                ]}
              />
            </Flex>
          </Col>

          <Col xs={12} sm={6} md={4}>
            <Flex vertical gap={4}>
              <GText strong style={{ fontSize: 13 }}>
                Cấp học
              </GText>
              <Select
                value={selectedLevel}
                onChange={(val) => setSelectedLevel(val)}
                style={{ width: "100%" }}
                options={[
                  { value: "ALL", label: "Tất cả các cấp" },
                  { value: SchoolLevelEnum.THPT.enum, label: "THPT" },
                  { value: SchoolLevelEnum.THCS.enum, label: "THCS" },
                  { value: SchoolLevelEnum.TieuHoc.enum, label: "Tiểu học" },
                  { value: SchoolLevelEnum.MamNon.enum, label: "Mầm non" },
                ]}
              />
            </Flex>
          </Col>

          <Col xs={12} sm={6} md={4}>
            <Flex vertical gap={4}>
              <GText strong style={{ fontSize: 13 }}>
                Loại hình trường
              </GText>
              <Select
                value={selectedType}
                onChange={(val) => setSelectedType(val)}
                style={{ width: "100%" }}
                options={[
                  { value: "ALL", label: "Tất cả loại hình" },
                  { value: SchoolTypeEnum.CongLap.enum, label: "Trường Công lập" },
                  { value: SchoolTypeEnum.DanLap.enum, label: "Trường Dân lập" },
                  { value: SchoolTypeEnum.TuThuc.enum, label: "Trường Tư thục" },
                ]}
              />
            </Flex>
          </Col>

          <Col xs={24} sm={12} md={4}>
            <Flex vertical gap={4}>
              <GText strong style={{ fontSize: 13 }}>
                Phường / Xã
              </GText>
              <Select
                showSearch
                value={selectedWard}
                onChange={(val) => setSelectedWard(val)}
                style={{ width: "100%" }}
                options={[
                  { value: "ALL", label: "Toàn tỉnh / thành phố" },
                  ...(wards?.map((w: any) => ({
                    value: w.id,
                    label: w.title,
                  })) || []),
                ]}
                loading={wrd_load}
                optionFilterProp="label"
              />
            </Flex>
          </Col>

          <Col xs={24} sm={12} md={7}>
            <Flex vertical gap={4}>
              <GText strong style={{ fontSize: 13 }}>
                Tìm kiếm báo cáo
              </GText>
              <Input
                placeholder="Nhập tên báo cáo, chỉ số thống kê..."
                prefix={<SearchOutlined />}
                allowClear
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </Flex>
          </Col>
        </Row>
      </Card>

      {/* Group 1: Chất lượng giáo dục */}
      <Flex vertical gap={12}>
        <Flex align="center" gap={8}>
          <BarChartOutlined style={{ color: "#1a73e8", fontSize: 18 }} />
          <GTitle level={4} style={{ margin: 0 }}>
            1. Báo cáo Chất lượng Giáo dục & Kết quả Đào tạo
          </GTitle>
        </Flex>

        <Row gutter={[16, 16]}>
          {filteredReports
            .filter((r) => r.category === "QUALITY")
            .map((item) => (
              <Col xs={24} lg={12} xxl={8} key={item.id}>
                <Card
                  hoverable
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    borderRadius: 8,
                  }}
                  styles={{ body: { display: "flex", flexDirection: "column", height: "100%", gap: 12 } }}
                >
                  <Flex gap={12} align="flex-start">
                    {item.icon(42)}
                    <div>
                      <GText strong style={{ fontSize: 15, display: "block" }}>
                        {item.title}
                      </GText>
                      <GText type="secondary" style={{ fontSize: 12, marginTop: 4, display: "block" }}>
                        {item.description}
                      </GText>
                    </div>
                  </Flex>

                  {/* Highlights */}
                  <div style={{ backgroundColor: "#f8fafc", padding: "8px 12px", borderRadius: 6, margin: "auto 0 8px 0" }}>
                    <Row gutter={8}>
                      {item.kpis.slice(0, 2).map((kpi, ki) => (
                        <Col span={12} key={ki}>
                          <GText type="secondary" style={{ fontSize: 11, display: "block" }}>{kpi.label}</GText>
                          <GText strong style={{ fontSize: 13, color: kpi.color }}>{kpi.value}</GText>
                        </Col>
                      ))}
                    </Row>
                  </div>

                  <Flex gap={12}>
                    <Button
                      type="primary"
                      icon={<ArrowRightOutlined />}
                      onClick={() => setViewingReport(item)}
                    >
                      Xem báo cáo
                    </Button>
                    <Button
                      icon={<DownloadOutlined />}
                      onClick={() => handleExportExcel(item)}
                    >
                      Xuất Excel
                    </Button>
                  </Flex>
                </Card>
              </Col>
            ))}
        </Row>
      </Flex>

      {/* Group 2: Quản lý học sinh */}
      <Flex vertical gap={12} style={{ marginTop: 8 }}>
        <Flex align="center" gap={8}>
          <CheckCircleOutlined style={{ color: "#137333", fontSize: 18 }} />
          <GTitle level={4} style={{ margin: 0 }}>
            2. Báo cáo Quản lý Học sinh & Biến động Sĩ số
          </GTitle>
        </Flex>

        <Row gutter={[16, 16]}>
          {filteredReports
            .filter((r) => r.category === "STUDENT")
            .map((item) => (
              <Col xs={24} lg={12} xxl={8} key={item.id}>
                <Card
                  hoverable
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    borderRadius: 8,
                  }}
                  styles={{ body: { display: "flex", flexDirection: "column", height: "100%", gap: 12 } }}
                >
                  <Flex gap={12} align="flex-start">
                    {item.icon(42)}
                    <div>
                      <GText strong style={{ fontSize: 15, display: "block" }}>
                        {item.title}
                      </GText>
                      <GText type="secondary" style={{ fontSize: 12, marginTop: 4, display: "block" }}>
                        {item.description}
                      </GText>
                    </div>
                  </Flex>

                  <div style={{ backgroundColor: "#f8fafc", padding: "8px 12px", borderRadius: 6, margin: "auto 0 8px 0" }}>
                    <Row gutter={8}>
                      {item.kpis.slice(0, 2).map((kpi, ki) => (
                        <Col span={12} key={ki}>
                          <GText type="secondary" style={{ fontSize: 11, display: "block" }}>{kpi.label}</GText>
                          <GText strong style={{ fontSize: 13, color: kpi.color }}>{kpi.value}</GText>
                        </Col>
                      ))}
                    </Row>
                  </div>

                  <Flex gap={12}>
                    <Button
                      type="primary"
                      icon={<ArrowRightOutlined />}
                      onClick={() => setViewingReport(item)}
                    >
                      Xem báo cáo
                    </Button>
                    <Button
                      icon={<DownloadOutlined />}
                      onClick={() => handleExportExcel(item)}
                    >
                      Xuất Excel
                    </Button>
                  </Flex>
                </Card>
              </Col>
            ))}
        </Row>
      </Flex>

      {/* Group 3: Quản lý đội ngũ */}
      <Flex vertical gap={12} style={{ marginTop: 8 }}>
        <Flex align="center" gap={8}>
          <BarChartOutlined style={{ color: "#f2994a", fontSize: 18 }} />
          <GTitle level={4} style={{ margin: 0 }}>
            3. Báo cáo Quản lý Đội ngũ Cán bộ, Giáo viên & Định mức Biên chế
          </GTitle>
        </Flex>

        <Row gutter={[16, 16]}>
          {filteredReports
            .filter((r) => r.category === "STAFF")
            .map((item) => (
              <Col xs={24} lg={12} xxl={8} key={item.id}>
                <Card
                  hoverable
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    borderRadius: 8,
                  }}
                  styles={{ body: { display: "flex", flexDirection: "column", height: "100%", gap: 12 } }}
                >
                  <Flex gap={12} align="flex-start">
                    {item.icon(42)}
                    <div>
                      <GText strong style={{ fontSize: 15, display: "block" }}>
                        {item.title}
                      </GText>
                      <GText type="secondary" style={{ fontSize: 12, marginTop: 4, display: "block" }}>
                        {item.description}
                      </GText>
                    </div>
                  </Flex>

                  <div style={{ backgroundColor: "#f8fafc", padding: "8px 12px", borderRadius: 6, margin: "auto 0 8px 0" }}>
                    <Row gutter={8}>
                      {item.kpis.slice(0, 2).map((kpi, ki) => (
                        <Col span={12} key={ki}>
                          <GText type="secondary" style={{ fontSize: 11, display: "block" }}>{kpi.label}</GText>
                          <GText strong style={{ fontSize: 13, color: kpi.color }}>{kpi.value}</GText>
                        </Col>
                      ))}
                    </Row>
                  </div>

                  <Flex gap={12}>
                    <Button
                      type="primary"
                      icon={<ArrowRightOutlined />}
                      onClick={() => setViewingReport(item)}
                    >
                      Xem báo cáo
                    </Button>
                    <Button
                      icon={<DownloadOutlined />}
                      onClick={() => handleExportExcel(item)}
                    >
                      Xuất Excel
                    </Button>
                  </Flex>
                </Card>
              </Col>
            ))}
        </Row>
      </Flex>

      {/* Group 4: Vận hành & Cơ sở vật chất */}
      <Flex vertical gap={12} style={{ marginTop: 8 }}>
        <Flex align="center" gap={8}>
          <BarChartOutlined style={{ color: "#9c27b0", fontSize: 18 }} />
          <GTitle level={4} style={{ margin: 0 }}>
            4. Báo cáo Cơ sở Vật chất & Chuẩn Quốc gia
          </GTitle>
        </Flex>

        <Row gutter={[16, 16]}>
          {filteredReports
            .filter((r) => r.category === "OPERATION")
            .map((item) => (
              <Col xs={24} lg={12} xxl={8} key={item.id}>
                <Card
                  hoverable
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    borderRadius: 8,
                  }}
                  styles={{ body: { display: "flex", flexDirection: "column", height: "100%", gap: 12 } }}
                >
                  <Flex gap={12} align="flex-start">
                    {item.icon(42)}
                    <div>
                      <GText strong style={{ fontSize: 15, display: "block" }}>
                        {item.title}
                      </GText>
                      <GText type="secondary" style={{ fontSize: 12, marginTop: 4, display: "block" }}>
                        {item.description}
                      </GText>
                    </div>
                  </Flex>

                  <div style={{ backgroundColor: "#f8fafc", padding: "8px 12px", borderRadius: 6, margin: "auto 0 8px 0" }}>
                    <Row gutter={8}>
                      {item.kpis.slice(0, 2).map((kpi, ki) => (
                        <Col span={12} key={ki}>
                          <GText type="secondary" style={{ fontSize: 11, display: "block" }}>{kpi.label}</GText>
                          <GText strong style={{ fontSize: 13, color: kpi.color }}>{kpi.value}</GText>
                        </Col>
                      ))}
                    </Row>
                  </div>

                  <Flex gap={12}>
                    <Button
                      type="primary"
                      icon={<ArrowRightOutlined />}
                      onClick={() => setViewingReport(item)}
                    >
                      Xem báo cáo
                    </Button>
                    <Button
                      icon={<DownloadOutlined />}
                      onClick={() => handleExportExcel(item)}
                    >
                      Xuất Excel
                    </Button>
                  </Flex>
                </Card>
              </Col>
            ))}
        </Row>
      </Flex>

      {/* Modal View Detailed Report */}
      <Modal
        title={
          <Flex align="center" gap={8}>
            <FilePdfOutlined style={{ color: "#1a73e8", fontSize: 20 }} />
            <span style={{ fontWeight: 700, fontSize: 16 }}>
              {viewingReport?.title?.toUpperCase()}
            </span>
          </Flex>
        }
        open={Boolean(viewingReport)}
        onCancel={() => setViewingReport(null)}
        width={960}
        footer={[
          <Button
            key="print"
            icon={<PrinterOutlined />}
            onClick={() => window.print()}
          >
            In báo cáo
          </Button>,
          <Button
            key="excel"
            type="primary"
            icon={<FileExcelOutlined />}
            onClick={() => viewingReport && handleExportExcel(viewingReport)}
          >
            Xuất Excel (.xlsx)
          </Button>,
          <Button key="close" onClick={() => setViewingReport(null)}>
            Đóng
          </Button>,
        ]}
      >
        {viewingReport && (
          <Flex vertical gap={16} style={{ marginTop: 8 }}>
            <div style={{ textAlign: "center", borderBottom: "1px solid #f0f0f0", paddingBottom: 12 }}>
              <GText type="secondary" style={{ textTransform: "uppercase", fontSize: 12, display: "block" }}>
                SỞ GIÁO DỤC VÀ ĐÀO TẠO • HỆ THỐNG CƠ SỞ DỮ LIỆU ĐIỀU HÀNH NGÀNH
              </GText>
              <GTitle level={4} style={{ margin: "4px 0" }}>
                {viewingReport.title}
              </GTitle>
              <GText italic type="secondary">
                Năm học: {selectedYear} • Dữ liệu tổng hợp thời gian thực từ 24 trường THPT
              </GText>
            </div>

            {/* KPIs */}
            <Row gutter={[16, 16]}>
              {viewingReport.kpis.map((k, i) => (
                <Col span={24 / viewingReport.kpis.length} key={i}>
                  <Card size="small" style={{ backgroundColor: "#f8fafc", textAlign: "center" }}>
                    <Statistic
                      title={<span style={{ fontSize: 12 }}>{k.label}</span>}
                      value={k.value}
                      valueStyle={{ color: k.color || "#1a73e8", fontSize: 18, fontWeight: 700 }}
                    />
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Table */}
            <div>
              <GText strong style={{ fontSize: 14, display: "block", marginBottom: 8 }}>
                BẢNG THỐNG KÊ CHI TIẾT THEO ĐƠN VỊ TRƯỜNG HỌC ({viewingReport.sampleData.length} TRƯỜNG ĐẠI DIỆN):
              </GText>
              <Table
                columns={modalColumns}
                dataSource={viewingReport.sampleData}
                pagination={false}
                size="small"
                bordered
                rowKey="stt"
              />
            </div>
          </Flex>
        )}
      </Modal>

      {/* Modal Create Custom Report */}
      <Modal
        title={
          <Flex align="center" gap={8}>
            <PlusOutlined style={{ color: "#1a73e8" }} />
            <span style={{ fontWeight: 700 }}>TẠO BÁO CÁO THỐNG KÊ TUỲ CHỈNH</span>
          </Flex>
        }
        open={isCustomReportModalOpen}
        onCancel={() => setIsCustomReportModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form
          form={customReportForm}
          layout="vertical"
          onFinish={handleCreateCustomReport}
          initialValues={{
            year: "2026-2027",
            scope: "ALL",
            format: "EXCEL",
          }}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="reportName"
            label="Tên báo cáo tuỳ chỉnh"
            rules={[{ required: true, message: "Vui lòng nhập tên báo cáo!" }]}
          >
            <Input placeholder="Ví dụ: Báo cáo kết quả khảo sát năng lực Ngoại ngữ..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="year" label="Năm học">
                <Select
                  options={[
                    { value: "2026-2027", label: "2026 - 2027" },
                    { value: "2025-2026", label: "2025 - 2026" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="scope" label="Phạm vi tổng hợp">
                <Select
                  options={[
                    { value: "ALL", label: "Toàn bộ 24 trường THPT" },
                    { value: "PUBLIC", label: "Chỉ các trường Công lập" },
                    { value: "PRIVATE", label: "Chỉ các trường Tư thục" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="format" label="Định dạng kết xuất">
            <Radio.Group>
              <Radio value="EXCEL">Excel (.xlsx)</Radio>
              <Radio value="PDF">PDF Ký số Cấp Sở</Radio>
              <Radio value="CSV">CSV Raw Data</Radio>
            </Radio.Group>
          </Form.Item>

          <Flex justify="end" gap={8} style={{ marginTop: 24 }}>
            <Button onClick={() => setIsCustomReportModalOpen(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit" icon={<DownloadOutlined />}>
              Khởi tạo & Kết xuất ngay
            </Button>
          </Flex>
        </Form>
      </Modal>
    </ContentCover>
  );
}
