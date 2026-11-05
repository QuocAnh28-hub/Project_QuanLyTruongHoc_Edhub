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
  Pagination,
  Rate,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Upload,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useLayoutContext } from "../../../../contexts/EDLayoutContext";
import { nav_links } from "../../../../utils/routes";
import ContentCover from "../../../atoms/content-cover";
import GCard from "../../../atoms/g-card";
import GText from "../../../atoms/g-text";
import GTitle from "../../../atoms/g-title";
import {
  CloudUploadOutlined,
  DownloadOutlined,
  EyeOutlined,
  FileDoneOutlined,
  FilePdfOutlined,
  FilePptOutlined,
  FileWordOutlined,
  FolderOpenOutlined,
  InboxOutlined,
  PlayCircleOutlined,
  ReadOutlined,
  SearchOutlined,
  StarOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";

interface MaterialItem {
  id: number;
  code: string;
  title: string;
  category: "E_LEARNING" | "EXAM_BANK" | "E_BOOK" | "LESSON_PLAN" | "INNOVATION";
  categoryLabel: string;
  subjectName: string;
  gradeLevel: number;
  fileFormat: "PDF" | "MP4" | "PPTX" | "DOCX" | "SCORM";
  fileSize: string;
  authorName: string;
  schoolName: string;
  rating: number;
  downloadsCount: number;
  viewsCount: number;
  verified: boolean;
  publishedDate: string;
}

export default function EdLearningMaterials() {
  const { setPageInfo } = useLayoutContext();
  useEffect(() => {
    setPageInfo(
      [
        {
          path: nav_links.ed_dashboard.route,
          title: nav_links.ed_dashboard.title,
        },
        { title: nav_links.ed_learning_materials.title },
      ],
      nav_links.ed_learning_materials.title
    );
    return () => {
      setPageInfo();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Content />;
}

function Content() {
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [selectedSubject, setSelectedSubject] = useState<string | "ALL">("ALL");
  const [selectedGrade, setSelectedGrade] = useState<number | "ALL">("ALL");
  const [selectedFormat, setSelectedFormat] = useState<string | "ALL">("ALL");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadForm] = Form.useForm();

  // Selected item for preview
  const [previewItem, setPreviewItem] = useState<MaterialItem | null>(null);

  // Mock list of 30 standard digital resources across subjects & types
  const materialsList: MaterialItem[] = useMemo(() => {
    return [
      // 1. E_LEARNING
      {
        id: 1,
        code: "HL-TOAN10-01",
        title: "Bài giảng E-Learning tương tác: Hàm số bậc hai và đồ thị",
        category: "E_LEARNING",
        categoryLabel: "Bài giảng E-Learning",
        subjectName: "Toán học",
        gradeLevel: 10,
        fileFormat: "SCORM",
        fileSize: "45.2 MB",
        authorName: "ThS. Phan Thanh Nam",
        schoolName: "Trường THPT Nguyễn Siêu",
        rating: 5,
        downloadsCount: 1420,
        viewsCount: 3890,
        verified: true,
        publishedDate: "15/09/2026",
      },
      {
        id: 3,
        code: "HL-ANH11-03",
        title: "Video tương tác thực hành kỹ năng Nghe - Nói Tiếng Anh 11 Global Success Unit 3",
        category: "E_LEARNING",
        categoryLabel: "Video & SCORM",
        subjectName: "Tiếng Anh",
        gradeLevel: 11,
        fileFormat: "MP4",
        fileSize: "185.0 MB",
        authorName: "Cô Hoàng Thu Trang",
        schoolName: "Trường THPT Chuyên Hà Nội - Amsterdam",
        rating: 5,
        downloadsCount: 3100,
        viewsCount: 7800,
        verified: true,
        publishedDate: "18/09/2026",
      },
      {
        id: 7,
        code: "HL-SU10-07",
        title: "Slide bài giảng chuyên sâu: Hiện thực lịch sử và nhận thức lịch sử (Có video tư liệu)",
        category: "E_LEARNING",
        categoryLabel: "Bài giảng số",
        subjectName: "Lịch sử",
        gradeLevel: 10,
        fileFormat: "PPTX",
        fileSize: "52.0 MB",
        authorName: "ThS. Phạm Thị Dung",
        schoolName: "Trường THPT Chu Văn An",
        rating: 4.8,
        downloadsCount: 1120,
        viewsCount: 2650,
        verified: true,
        publishedDate: "10/09/2026",
      },
      {
        id: 10,
        code: "HL-QPAN10-10",
        title: "Bài giảng đa phương tiện: Truyền thống đánh giặc giữ nước của dân tộc Việt Nam",
        category: "E_LEARNING",
        categoryLabel: "Bài giảng số",
        subjectName: "GDQP-AN",
        gradeLevel: 10,
        fileFormat: "PPTX",
        fileSize: "64.0 MB",
        authorName: "Đ/c Đặng Văn Nam",
        schoolName: "Trường THPT Chu Văn An",
        rating: 4.9,
        downloadsCount: 890,
        viewsCount: 1950,
        verified: true,
        publishedDate: "08/09/2026",
      },
      {
        id: 11,
        code: "HL-LY11-11",
        title: "Bài giảng số tương tác: Điện trường và Cường độ điện trường (Mô phỏng đường sức)",
        category: "E_LEARNING",
        categoryLabel: "Bài giảng E-Learning",
        subjectName: "Vật lí",
        gradeLevel: 11,
        fileFormat: "SCORM",
        fileSize: "58.4 MB",
        authorName: "Thầy Lê Hoàng Nam",
        schoolName: "Trường THPT Kim Liên",
        rating: 4.9,
        downloadsCount: 1680,
        viewsCount: 3950,
        verified: true,
        publishedDate: "22/09/2026",
      },
      {
        id: 12,
        code: "HL-HOA11-12",
        title: "Bài giảng E-Learning: Cân bằng hóa học và nguyên lí Le Chatelier",
        category: "E_LEARNING",
        categoryLabel: "Bài giảng E-Learning",
        subjectName: "Hóa học",
        gradeLevel: 11,
        fileFormat: "SCORM",
        fileSize: "41.6 MB",
        authorName: "Cô Trần Thị Mai",
        schoolName: "Trường THPT Phan Đình Phùng",
        rating: 4.7,
        downloadsCount: 1320,
        viewsCount: 3100,
        verified: true,
        publishedDate: "28/09/2026",
      },
      {
        id: 13,
        code: "HL-TIN10-13",
        title: "Khóa học mini trực tuyến: Lập trình Python cơ bản cho học sinh Khối 10",
        category: "E_LEARNING",
        categoryLabel: "Video & SCORM",
        subjectName: "Tin học",
        gradeLevel: 10,
        fileFormat: "MP4",
        fileSize: "210.0 MB",
        authorName: "TS. Hoàng Minh Đức",
        schoolName: "Trường THPT Nguyễn Siêu",
        rating: 5,
        downloadsCount: 3890,
        viewsCount: 8400,
        verified: true,
        publishedDate: "01/10/2026",
      },
      {
        id: 14,
        code: "HL-SINH11-14",
        title: "Bài giảng số 3D: Trao đổi nước và khoáng ở thực vật",
        category: "E_LEARNING",
        categoryLabel: "Bài giảng E-Learning",
        subjectName: "Sinh học",
        gradeLevel: 11,
        fileFormat: "SCORM",
        fileSize: "62.0 MB",
        authorName: "TS. Nguyễn Thị Mai",
        schoolName: "Trường THPT Chuyên Hà Nội - Amsterdam",
        rating: 4.9,
        downloadsCount: 1750,
        viewsCount: 4200,
        verified: true,
        publishedDate: "05/10/2026",
      },

      // 2. EXAM_BANK
      {
        id: 2,
        code: "HL-VAN10-02",
        title: "Ngân hàng 150 câu hỏi & Ma trận đề thi Giữa kỳ 1 Ngữ văn 10 (Bộ Cánh Diều)",
        category: "EXAM_BANK",
        categoryLabel: "Ngân hàng Đề thi",
        subjectName: "Ngữ văn",
        gradeLevel: 10,
        fileFormat: "DOCX",
        fileSize: "3.8 MB",
        authorName: "ThS. Bùi Thị Lan",
        schoolName: "Trường THPT Chu Văn An",
        rating: 4.8,
        downloadsCount: 2310,
        viewsCount: 5120,
        verified: true,
        publishedDate: "02/10/2026",
      },
      {
        id: 8,
        code: "HL-DIA11-08",
        title: "Ngân hàng 200 câu hỏi trắc nghiệm khách quan: Toàn cầu hóa và khu vực hóa kinh tế",
        category: "EXAM_BANK",
        categoryLabel: "Ngân hàng Đề thi",
        subjectName: "Địa lí",
        gradeLevel: 11,
        fileFormat: "DOCX",
        fileSize: "3.2 MB",
        authorName: "Thầy Ngô Văn Long",
        schoolName: "Trường THPT Nguyễn Siêu",
        rating: 4.6,
        downloadsCount: 980,
        viewsCount: 2100,
        verified: true,
        publishedDate: "28/09/2026",
      },
      {
        id: 15,
        code: "HL-TOAN12-15",
        title: "Bộ 10 đề thi thử Tốt nghiệp THPT môn Toán chuẩn cấu trúc ma trận Bộ GD&ĐT 2026",
        category: "EXAM_BANK",
        categoryLabel: "Ngân hàng Đề thi",
        subjectName: "Toán học",
        gradeLevel: 12,
        fileFormat: "PDF",
        fileSize: "6.5 MB",
        authorName: "Tổ Toán - Tin Sở GD&ĐT",
        schoolName: "Sở GD&ĐT Hà Nội",
        rating: 5,
        downloadsCount: 5640,
        viewsCount: 12400,
        verified: true,
        publishedDate: "15/10/2026",
      },
      {
        id: 16,
        code: "HL-ANH12-16",
        title: "Bộ đề trắc nghiệm Tiếng Anh ôn thi Tốt nghiệp THPT theo định dạng mới (Có file nghe Audio)",
        category: "EXAM_BANK",
        categoryLabel: "Ngân hàng Đề thi",
        subjectName: "Tiếng Anh",
        gradeLevel: 12,
        fileFormat: "PDF",
        fileSize: "14.2 MB",
        authorName: "Hội đồng Bộ môn Tiếng Anh Cấp Sở",
        schoolName: "Trường THPT Chuyên Hà Nội - Amsterdam",
        rating: 4.9,
        downloadsCount: 4890,
        viewsCount: 9950,
        verified: true,
        publishedDate: "18/10/2026",
      },
      {
        id: 17,
        code: "HL-LY10-17",
        title: "Ngân hàng câu hỏi trắc nghiệm đúng/sai và trả lời ngắn môn Vật lí 10 (Chương Động học)",
        category: "EXAM_BANK",
        categoryLabel: "Ngân hàng Đề thi",
        subjectName: "Vật lí",
        gradeLevel: 10,
        fileFormat: "DOCX",
        fileSize: "2.9 MB",
        authorName: "Thầy Đặng Quốc Huy",
        schoolName: "Trường THPT Kim Liên",
        rating: 4.7,
        downloadsCount: 1450,
        viewsCount: 3200,
        verified: true,
        publishedDate: "12/10/2026",
      },
      {
        id: 18,
        code: "HL-SU12-18",
        title: "Ma trận và đặc tả đề kiểm tra Cuối kỳ 1 môn Lịch sử 12 (Chuẩn Chương trình GDPT 2018)",
        category: "EXAM_BANK",
        categoryLabel: "Ngân hàng Đề thi",
        subjectName: "Lịch sử",
        gradeLevel: 12,
        fileFormat: "DOCX",
        fileSize: "1.8 MB",
        authorName: "Cô Phạm Thị Dung",
        schoolName: "Trường THPT Chu Văn An",
        rating: 4.8,
        downloadsCount: 1780,
        viewsCount: 3800,
        verified: true,
        publishedDate: "20/10/2026",
      },
      {
        id: 19,
        code: "HL-GDKTPL10-19",
        title: "Ngân hàng 180 câu hỏi tình huống thực tế môn Giáo dục kinh tế và pháp luật 10",
        category: "EXAM_BANK",
        categoryLabel: "Ngân hàng Đề thi",
        subjectName: "GDKTPL",
        gradeLevel: 10,
        fileFormat: "PDF",
        fileSize: "3.4 MB",
        authorName: "ThS. Trịnh Quốc Bảo",
        schoolName: "Trường THPT Thăng Long",
        rating: 4.6,
        downloadsCount: 1120,
        viewsCount: 2450,
        verified: true,
        publishedDate: "24/10/2026",
      },

      // 3. E_BOOK
      {
        id: 4,
        code: "HL-LY12-04",
        title: "Sách bài tập số & Mô phỏng Dao động điều hòa bằng đồ họa 3D tương tác",
        category: "E_BOOK",
        categoryLabel: "Sách số & Thí nghiệm",
        subjectName: "Vật lí",
        gradeLevel: 12,
        fileFormat: "PDF",
        fileSize: "28.5 MB",
        authorName: "ThS. Đặng Quốc Huy",
        schoolName: "Trường THPT Kim Liên",
        rating: 4.9,
        downloadsCount: 1980,
        viewsCount: 4200,
        verified: true,
        publishedDate: "20/08/2026",
      },
      {
        id: 9,
        code: "HL-SINH12-09",
        title: "Phần mềm mô phỏng cơ chế Di truyền và Biến dị cấp độ phân tử (ADN & ARN)",
        category: "E_BOOK",
        categoryLabel: "Thí nghiệm ảo & Phần mềm",
        subjectName: "Sinh học",
        gradeLevel: 12,
        fileFormat: "SCORM",
        fileSize: "88.0 MB",
        authorName: "TS. Nguyễn Thị Mai",
        schoolName: "Trường THPT Chuyên Hà Nội - Amsterdam",
        rating: 5,
        downloadsCount: 2850,
        viewsCount: 6300,
        verified: true,
        publishedDate: "12/08/2026",
      },
      {
        id: 20,
        code: "HL-HOA10-20",
        title: "Phòng thí nghiệm ảo Hóa học tương tác: Pha chế dung dịch và quan sát phản ứng oxi hóa khử",
        category: "E_BOOK",
        categoryLabel: "Thí nghiệm ảo & Phần mềm",
        subjectName: "Hóa học",
        gradeLevel: 10,
        fileFormat: "SCORM",
        fileSize: "94.5 MB",
        authorName: "ThS. Vũ Thị Hoa",
        schoolName: "Trường THPT Nguyễn Siêu",
        rating: 4.9,
        downloadsCount: 2190,
        viewsCount: 5100,
        verified: true,
        publishedDate: "14/09/2026",
      },
      {
        id: 21,
        code: "HL-DIA10-21",
        title: "Atlas Địa lí Việt Nam số tích hợp bản đồ GIS đa lớp phục vụ giảng dạy Chương trình 2018",
        category: "E_BOOK",
        categoryLabel: "Sách số & Bản đồ",
        subjectName: "Địa lí",
        gradeLevel: 10,
        fileFormat: "PDF",
        fileSize: "76.0 MB",
        authorName: "Thầy Ngô Văn Long",
        schoolName: "Trường THPT Nguyễn Siêu",
        rating: 5,
        downloadsCount: 3410,
        viewsCount: 7200,
        verified: true,
        publishedDate: "02/09/2026",
      },
      {
        id: 22,
        code: "HL-TIN11-22",
        title: "Sổ tay số hướng dẫn thực hành Cơ sở dữ liệu quan hệ SQL và thiết kế web HTML/CSS",
        category: "E_BOOK",
        categoryLabel: "Sách số & Thí nghiệm",
        subjectName: "Tin học",
        gradeLevel: 11,
        fileFormat: "PDF",
        fileSize: "18.3 MB",
        authorName: "TS. Hoàng Minh Đức",
        schoolName: "Trường THPT Nguyễn Siêu",
        rating: 4.8,
        downloadsCount: 2450,
        viewsCount: 5600,
        verified: true,
        publishedDate: "09/09/2026",
      },

      // 4. LESSON_PLAN
      {
        id: 5,
        code: "HL-HOA10-05",
        title: "Kế hoạch bài dạy (KHBD chuẩn Công văn 5512): Bảng tuần hoàn các nguyên tố hóa học",
        category: "LESSON_PLAN",
        categoryLabel: "Giáo án 5512",
        subjectName: "Hóa học",
        gradeLevel: 10,
        fileFormat: "DOCX",
        fileSize: "2.4 MB",
        authorName: "Cô Vũ Thị Hoa",
        schoolName: "Trường THPT Nguyễn Siêu",
        rating: 4.7,
        downloadsCount: 1560,
        viewsCount: 3400,
        verified: true,
        publishedDate: "05/09/2026",
      },
      {
        id: 23,
        code: "HL-TOAN11-23",
        title: "Kế hoạch bài dạy Công văn 5512 môn Toán 11: Dãy số, Cấp số cộng và Cấp số nhân",
        category: "LESSON_PLAN",
        categoryLabel: "Giáo án 5512",
        subjectName: "Toán học",
        gradeLevel: 11,
        fileFormat: "DOCX",
        fileSize: "3.1 MB",
        authorName: "ThS. Phan Thanh Nam",
        schoolName: "Trường THPT Nguyễn Siêu",
        rating: 4.9,
        downloadsCount: 2890,
        viewsCount: 6100,
        verified: true,
        publishedDate: "12/09/2026",
      },
      {
        id: 24,
        code: "HL-VAN11-24",
        title: "Kế hoạch bài dạy Công văn 5512: Đọc hiểu văn bản truyện ngắn hiện đại Việt Nam (Ngữ văn 11)",
        category: "LESSON_PLAN",
        categoryLabel: "Giáo án 5512",
        subjectName: "Ngữ văn",
        gradeLevel: 11,
        fileFormat: "DOCX",
        fileSize: "2.8 MB",
        authorName: "Cô Bùi Thị Lan",
        schoolName: "Trường THPT Chu Văn An",
        rating: 4.8,
        downloadsCount: 2340,
        viewsCount: 5200,
        verified: true,
        publishedDate: "19/09/2026",
      },
      {
        id: 25,
        code: "HL-ANH10-25",
        title: "Kế hoạch bài dạy Công văn 5512 môn Tiếng Anh 10: Unit 1 Family Life (4 kỹ năng tích hợp)",
        category: "LESSON_PLAN",
        categoryLabel: "Giáo án 5512",
        subjectName: "Tiếng Anh",
        gradeLevel: 10,
        fileFormat: "DOCX",
        fileSize: "3.5 MB",
        authorName: "Cô Hoàng Thu Trang",
        schoolName: "Trường THPT Chuyên Hà Nội - Amsterdam",
        rating: 5,
        downloadsCount: 3120,
        viewsCount: 6800,
        verified: true,
        publishedDate: "06/09/2026",
      },
      {
        id: 26,
        code: "HL-LY10-26",
        title: "Kế hoạch bài dạy Công văn 5512: Ba định luật Newton về chuyển động (Có phiếu học tập)",
        category: "LESSON_PLAN",
        categoryLabel: "Giáo án 5512",
        subjectName: "Vật lí",
        gradeLevel: 10,
        fileFormat: "DOCX",
        fileSize: "2.6 MB",
        authorName: "Thầy Lê Hoàng Nam",
        schoolName: "Trường THPT Kim Liên",
        rating: 4.7,
        downloadsCount: 1890,
        viewsCount: 4100,
        verified: true,
        publishedDate: "15/09/2026",
      },

      // 5. INNOVATION
      {
        id: 6,
        code: "HL-SKKN-06",
        title: "Sáng kiến kinh nghiệm cấp Tỉnh: Ứng dụng AI và lớp học đảo ngược trong dạy học Tin học THPT",
        category: "INNOVATION",
        categoryLabel: "Sáng kiến kinh nghiệm",
        subjectName: "Tin học",
        gradeLevel: 11,
        fileFormat: "PDF",
        fileSize: "6.1 MB",
        authorName: "TS. Hoàng Minh Đức",
        schoolName: "Trường THPT Nguyễn Siêu",
        rating: 5,
        downloadsCount: 4210,
        viewsCount: 8900,
        verified: true,
        publishedDate: "25/07/2026",
      },
      {
        id: 27,
        code: "HL-SKKN-27",
        title: "Sáng kiến kinh nghiệm Giải Nhất Cấp Tỉnh: Đổi mới phương pháp dạy học STEM trong môn Vật lí",
        category: "INNOVATION",
        categoryLabel: "Sáng kiến kinh nghiệm",
        subjectName: "Vật lí",
        gradeLevel: 10,
        fileFormat: "PDF",
        fileSize: "8.4 MB",
        authorName: "ThS. Đặng Quốc Huy",
        schoolName: "Trường THPT Kim Liên",
        rating: 5,
        downloadsCount: 3950,
        viewsCount: 8120,
        verified: true,
        publishedDate: "20/07/2026",
      },
      {
        id: 28,
        code: "HL-SKKN-28",
        title: "Sáng kiến kinh nghiệm: Rèn luyện năng lực tự học và phát triển tư duy phản biện qua môn Ngữ văn",
        category: "INNOVATION",
        categoryLabel: "Sáng kiến kinh nghiệm",
        subjectName: "Ngữ văn",
        gradeLevel: 12,
        fileFormat: "PDF",
        fileSize: "5.7 MB",
        authorName: "ThS. Bùi Thị Lan",
        schoolName: "Trường THPT Chu Văn An",
        rating: 4.9,
        downloadsCount: 3100,
        viewsCount: 6700,
        verified: true,
        publishedDate: "22/07/2026",
      },
      {
        id: 29,
        code: "HL-SKKN-29",
        title: "Sáng kiến kinh nghiệm: Xây dựng môi trường giao tiếp song ngữ tự nhiên trong trường phổ thông",
        category: "INNOVATION",
        categoryLabel: "Sáng kiến kinh nghiệm",
        subjectName: "Tiếng Anh",
        gradeLevel: 11,
        fileFormat: "PDF",
        fileSize: "7.2 MB",
        authorName: "Cô Hoàng Thu Trang",
        schoolName: "Trường THPT Chuyên Hà Nội - Amsterdam",
        rating: 5,
        downloadsCount: 3670,
        viewsCount: 7900,
        verified: true,
        publishedDate: "28/07/2026",
      },
      {
        id: 30,
        code: "HL-SKKN-30",
        title: "Sáng kiến kinh nghiệm: Tổ chức hoạt động trải nghiệm hướng nghiệp tích hợp công nghệ số 4.0",
        category: "INNOVATION",
        categoryLabel: "Sáng kiến kinh nghiệm",
        subjectName: "GDQP-AN",
        gradeLevel: 12,
        fileFormat: "PDF",
        fileSize: "6.9 MB",
        authorName: "Thầy Phan Thanh Nam",
        schoolName: "Trường THPT Nguyễn Siêu",
        rating: 4.8,
        downloadsCount: 2780,
        viewsCount: 5900,
        verified: true,
        publishedDate: "30/07/2026",
      },
    ];
  }, []);

  // Category counts
  const categoryCounts = useMemo(() => {
    return {
      ALL: materialsList.length,
      E_LEARNING: materialsList.filter((m) => m.category === "E_LEARNING").length,
      EXAM_BANK: materialsList.filter((m) => m.category === "EXAM_BANK").length,
      E_BOOK: materialsList.filter((m) => m.category === "E_BOOK").length,
      LESSON_PLAN: materialsList.filter((m) => m.category === "LESSON_PLAN").length,
      INNOVATION: materialsList.filter((m) => m.category === "INNOVATION").length,
    };
  }, [materialsList]);

  // Filter materials
  const filteredMaterials = useMemo(() => {
    return materialsList.filter((m) => {
      if (activeTab !== "ALL" && m.category !== activeTab) return false;
      if (selectedSubject !== "ALL" && m.subjectName !== selectedSubject)
        return false;
      if (selectedGrade !== "ALL" && m.gradeLevel !== selectedGrade)
        return false;
      if (selectedFormat !== "ALL" && m.fileFormat !== selectedFormat)
        return false;
      if (searchText.trim()) {
        const q = searchText.toLowerCase().trim();
        const matchTitle = m.title.toLowerCase().includes(q);
        const matchCode = m.code.toLowerCase().includes(q);
        const matchAuthor = m.authorName.toLowerCase().includes(q);
        const matchSchool = m.schoolName.toLowerCase().includes(q);
        if (!matchTitle && !matchCode && !matchAuthor && !matchSchool)
          return false;
      }
      return true;
    });
  }, [
    materialsList,
    activeTab,
    selectedSubject,
    selectedGrade,
    selectedFormat,
    searchText,
  ]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMaterials.slice(start, start + pageSize);
  }, [filteredMaterials, currentPage]);

  const handleExportList = () => {
    message.loading({
      content: "Đang kết xuất danh mục học liệu số ra tệp Excel (.xlsx)...",
      key: "exp_mat",
    });
    setTimeout(() => {
      const headers = "STT,Mã HL,Tiêu đề học liệu,Chuyên mục,Môn học,Khối,Định dạng,Dung lượng,Tác giả,Đơn vị trường,Lượt tải,Đánh giá";
      const rows = filteredMaterials.map(
        (m, i) =>
          `"${i + 1}","${m.code}","${m.title}","${m.categoryLabel}","${m.subjectName}","Khối ${m.gradeLevel}","${m.fileFormat}","${m.fileSize}","${m.authorName}","${m.schoolName}","${m.downloadsCount}","${m.rating} sao"`
      );
      const csvContent =
        "\uFEFF" +
        "DANH MỤC HỌC LIỆU SỐ TOÀN NGÀNH CẤP SỞ\n\n" +
        headers +
        "\n" +
        rows.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `Danh_muc_Hoc_lieu_So_${dayjs().format("YYYYMMDD_HHmm")}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      message.success({
        content: `Đã tải xuống thành công danh mục ${filteredMaterials.length} học liệu số!`,
        key: "exp_mat",
        duration: 3,
      });
    }, 800);
  };

  const handleUploadSubmit = (values: any) => {
    message.success(
      `Đã tải lên học liệu số "${values.title}" thành công! Học liệu đã được chuyển vào hàng đợi thẩm định của Sở GD&ĐT.`
    );
    setIsUploadModalOpen(false);
    uploadForm.resetFields();
  };

  const getFormatTag = (fmt: string) => {
    switch (fmt) {
      case "PDF":
        return <Tag color="red" icon={<FilePdfOutlined />}>PDF</Tag>;
      case "MP4":
        return <Tag color="blue" icon={<VideoCameraOutlined />}>MP4 Video</Tag>;
      case "SCORM":
        return <Tag color="purple" icon={<PlayCircleOutlined />}>SCORM / HTML5</Tag>;
      case "PPTX":
        return <Tag color="orange" icon={<FilePptOutlined />}>PPTX Slide</Tag>;
      case "DOCX":
        return <Tag color="geekblue" icon={<FileWordOutlined />}>Word DOCX</Tag>;
      default:
        return <Tag>{fmt}</Tag>;
    }
  };

  const columns: ColumnsType<MaterialItem> = [
    {
      title: "Mã HL",
      dataIndex: "code",
      key: "code",
      width: 120,
      onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      onCell: () => ({ style: { whiteSpace: "nowrap" } }),
      render: (code) => (
        <Tag color="geekblue" style={{ fontFamily: "monospace", fontWeight: 600 }}>
          {code}
        </Tag>
      ),
    },
    {
      title: "Tiêu đề Học liệu số",
      key: "title",
      width: 320,
      onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      render: (_, r) => (
        <div>
          <GText strong style={{ fontSize: 14 }}>
            {r.title}
          </GText>
          <Flex gap={8} align="center" style={{ marginTop: 4 }}>
            <Tag color="cyan">{r.categoryLabel}</Tag>
            <GText type="secondary" style={{ fontSize: 12 }}>
              Dung lượng: {r.fileSize} • Ngày đăng: {r.publishedDate}
            </GText>
          </Flex>
        </div>
      ),
    },
    {
      title: "Môn / Khối",
      key: "subject",
      width: 130,
      onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      onCell: () => ({ style: { whiteSpace: "nowrap" } }),
      render: (_, r) => (
        <div>
          <GText strong>{r.subjectName}</GText>
          <GText type="secondary" style={{ display: "block", fontSize: 12 }}>
            Khối {r.gradeLevel}
          </GText>
        </div>
      ),
    },
    {
      title: "Định dạng",
      dataIndex: "fileFormat",
      key: "fileFormat",
      width: 120,
      onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      onCell: () => ({ style: { whiteSpace: "nowrap" } }),
      render: (fmt) => getFormatTag(fmt),
    },
    {
      title: "Đơn vị & Tác giả",
      key: "author",
      width: 200,
      onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      render: (_, r) => (
        <div>
          <GText strong>{r.authorName}</GText>
          <GText type="secondary" style={{ display: "block", fontSize: 12 }}>
            {r.schoolName}
          </GText>
        </div>
      ),
    },
    {
      title: "Đánh giá & Lượt tải",
      key: "stats",
      width: 140,
      align: "center",
      onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      onCell: () => ({ style: { whiteSpace: "nowrap" } }),
      render: (_, r) => (
        <div>
          <Rate disabled defaultValue={r.rating} style={{ fontSize: 11 }} />
          <GText type="secondary" style={{ display: "block", fontSize: 12 }}>
            {r.downloadsCount.toLocaleString()} lượt tải
          </GText>
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 110,
      align: "center",
      onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      render: (_, r) => (
        <Space size={6}>
          <Tooltip title="Xem thông tin chi tiết">
            <Button
              type="primary"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => setPreviewItem(r)}
            />
          </Tooltip>
          <Tooltip title="Tải học liệu số về máy">
            <Button
              size="small"
              icon={<DownloadOutlined />}
              onClick={() =>
                message.success(`Đang tải học liệu "${r.title}" (${r.fileSize})...`)
              }
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <ContentCover vertical size="stretch" gap={16} style={{ paddingBottom: 40 }}>
      {/* Header */}
      <Row gutter={[16, 16]} align="middle" justify="space-between">
        <Col>
          <Flex vertical gap={4}>
            <GTitle level={3} style={{ margin: 0 }}>
              Kho Học liệu số & Tài nguyên Giáo dục Cấp Sở
            </GTitle>
            <GText type="secondary">
              Quản lý, thẩm định và chia sẻ bài giảng điện tử, ngân hàng câu hỏi, sách số và sáng kiến kinh nghiệm dùng chung
            </GText>
          </Flex>
        </Col>
        <Col>
          <Flex gap={12} wrap>
            <Button
              icon={<DownloadOutlined />}
              onClick={handleExportList}
            >
              Xuất danh mục (.xlsx)
            </Button>
            <Button
              type="primary"
              icon={<CloudUploadOutlined />}
              onClick={() => setIsUploadModalOpen(true)}
            >
              Đóng góp Học liệu mới
            </Button>
          </Flex>
        </Col>
      </Row>

      <Divider style={{ margin: "4px 0 12px 0" }} />

      {/* Stat Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <GCard vertical style={{ borderLeft: "4px solid #1a73e8" }}>
            <Statistic
              title="Tổng số Tài nguyên Học liệu"
              value={1480}
              suffix="tài liệu"
              prefix={<FolderOpenOutlined style={{ color: "#1a73e8" }} />}
            />
            <GText type="secondary" style={{ fontSize: 12, marginTop: 4, display: "block" }}>
              Được chuẩn hóa và kiểm duyệt Sở
            </GText>
          </GCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <GCard vertical style={{ borderLeft: "4px solid #137333" }}>
            <Statistic
              title="Bài giảng E-Learning & SCORM"
              value={420}
              suffix="bài giảng"
              prefix={<PlayCircleOutlined style={{ color: "#137333" }} />}
            />
            <GText type="secondary" style={{ fontSize: 12, marginTop: 4, display: "block" }}>
              Tích hợp tương tác & video bài giảng
            </GText>
          </GCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <GCard vertical style={{ borderLeft: "4px solid #f2994a" }}>
            <Statistic
              title="Ngân hàng Đề thi & Ma trận"
              value={650}
              suffix="bộ đề"
              prefix={<FileDoneOutlined style={{ color: "#f2994a" }} />}
            />
            <GText type="secondary" style={{ fontSize: 12, marginTop: 4, display: "block" }}>
              Bám sát cấu trúc đề thi Bộ GD&ĐT
            </GText>
          </GCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <GCard vertical style={{ borderLeft: "4px solid #9c27b0" }}>
            <Statistic
              title="Tổng lượt Tải & Truy cập"
              value={48250}
              suffix="lượt"
              prefix={<DownloadOutlined style={{ color: "#9c27b0" }} />}
            />
            <GText type="secondary" style={{ fontSize: 12, marginTop: 4, display: "block" }}>
              Phục vụ giáo viên & học sinh toàn tỉnh
            </GText>
          </GCard>
        </Col>
      </Row>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={(k) => {
          setActiveTab(k);
          setCurrentPage(1);
        }}
        items={[
          { key: "ALL", label: `Tất cả tài nguyên (${categoryCounts.ALL})` },
          { key: "E_LEARNING", label: `Bài giảng E-Learning & SCORM (${categoryCounts.E_LEARNING})` },
          { key: "EXAM_BANK", label: `Ngân hàng Đề thi & Ma trận (${categoryCounts.EXAM_BANK})` },
          { key: "E_BOOK", label: `Sách số & Thí nghiệm ảo (${categoryCounts.E_BOOK})` },
          { key: "LESSON_PLAN", label: `Kế hoạch bài dạy KHBD 5512 (${categoryCounts.LESSON_PLAN})` },
          { key: "INNOVATION", label: `Sáng kiến kinh nghiệm SKKN (${categoryCounts.INNOVATION})` },
        ]}
      />

      {/* Filters */}
      <Card style={{ width: "100%", borderRadius: 8 }}>
        <Row gutter={[12, 12]} align="middle">
          <Col xs={12} sm={6} md={4}>
            <Flex vertical gap={4}>
              <GText strong style={{ fontSize: 13 }}>
                Môn học
              </GText>
              <Select
                value={selectedSubject}
                onChange={(val) => {
                  setSelectedSubject(val);
                  setCurrentPage(1);
                }}
                style={{ width: "100%" }}
                options={[
                  { value: "ALL", label: "Tất cả môn" },
                  { value: "Toán học", label: "Toán học" },
                  { value: "Ngữ văn", label: "Ngữ văn" },
                  { value: "Tiếng Anh", label: "Tiếng Anh" },
                  { value: "Vật lí", label: "Vật lí" },
                  { value: "Hóa học", label: "Hóa học" },
                  { value: "Sinh học", label: "Sinh học" },
                  { value: "Lịch sử", label: "Lịch sử" },
                  { value: "Địa lí", label: "Địa lí" },
                  { value: "Tin học", label: "Tin học" },
                ]}
              />
            </Flex>
          </Col>

          <Col xs={12} sm={6} md={3}>
            <Flex vertical gap={4}>
              <GText strong style={{ fontSize: 13 }}>
                Khối lớp
              </GText>
              <Select
                value={selectedGrade}
                onChange={(val) => {
                  setSelectedGrade(val);
                  setCurrentPage(1);
                }}
                style={{ width: "100%" }}
                options={[
                  { value: "ALL", label: "Tất cả khối" },
                  { value: 10, label: "Khối 10" },
                  { value: 11, label: "Khối 11" },
                  { value: 12, label: "Khối 12" },
                ]}
              />
            </Flex>
          </Col>

          <Col xs={12} sm={6} md={4}>
            <Flex vertical gap={4}>
              <GText strong style={{ fontSize: 13 }}>
                Định dạng tệp
              </GText>
              <Select
                value={selectedFormat}
                onChange={(val) => {
                  setSelectedFormat(val);
                  setCurrentPage(1);
                }}
                style={{ width: "100%" }}
                options={[
                  { value: "ALL", label: "Tất cả định dạng" },
                  { value: "PDF", label: "PDF Document" },
                  { value: "SCORM", label: "SCORM / E-Learning" },
                  { value: "MP4", label: "MP4 Video" },
                  { value: "PPTX", label: "PowerPoint PPTX" },
                  { value: "DOCX", label: "Word DOCX" },
                ]}
              />
            </Flex>
          </Col>

          <Col xs={24} sm={12} md={13}>
            <Flex vertical gap={4}>
              <GText strong style={{ fontSize: 13 }}>
                Tìm kiếm tài nguyên
              </GText>
              <Input
                placeholder="Nhập tiêu đề học liệu, mã bài giảng, tác giả, trường..."
                prefix={<SearchOutlined />}
                allowClear
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </Flex>
          </Col>
        </Row>
      </Card>

      {/* Main Table */}
      <Card style={{ width: "100%", borderRadius: 8, overflow: "hidden" }}>
        <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
          <GText strong style={{ fontSize: 16 }}>
            Danh mục Học liệu Số Toàn ngành ({filteredMaterials.length} kết quả)
          </GText>
        </Flex>

        <Table
          columns={columns}
          dataSource={paginatedData}
          pagination={false}
          size="middle"
          scroll={{ x: 1200 }}
          bordered
          rowKey="id"
        />

        <Flex justify="end" style={{ marginTop: 16 }}>
          <Pagination
            current={currentPage}
            total={filteredMaterials.length}
            pageSize={pageSize}
            onChange={(p) => setCurrentPage(p)}
            showSizeChanger={false}
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} của ${total} học liệu`
            }
          />
        </Flex>
      </Card>

      {/* Preview Modal */}
      <Modal
        className="learning-material-modal"
        title={
          <Flex align="center" gap={8}>
            <ReadOutlined style={{ color: "#1a73e8", fontSize: 20 }} />
            <span style={{ fontWeight: 700, fontSize: 16 }}>
              Chi tiết Học liệu Số & Tài nguyên Giáo dục
            </span>
          </Flex>
        }
        open={Boolean(previewItem)}
        onCancel={() => setPreviewItem(null)}
        width={820}
        centered
        footer={[
          <Button
            key="dl"
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => {
              message.success(`Đang tải tệp "${previewItem?.title}"...`);
              setPreviewItem(null);
            }}
          >
            Tải học liệu số ({previewItem?.fileSize})
          </Button>,
          <Button key="close" onClick={() => setPreviewItem(null)}>
            Đóng
          </Button>,
        ]}
      >
        <style>{`
          .learning-material-modal .ant-descriptions table {
            table-layout: fixed !important;
            width: 100% !important;
          }
          .learning-material-modal .ant-descriptions-item-label {
            width: 170px !important;
            white-space: nowrap !important;
            font-weight: 600 !important;
            background-color: #f8fafc !important;
          }
          .learning-material-modal .ant-descriptions-item-content {
            word-break: break-word !important;
          }
        `}</style>

        {previewItem && (
          <Descriptions
            bordered
            size="small"
            column={2}
            labelStyle={{
              width: 170,
              minWidth: 170,
              maxWidth: 180,
              fontWeight: 600,
              backgroundColor: "#fafafa",
              whiteSpace: "nowrap",
            }}
            contentStyle={{ minWidth: 200, wordBreak: "break-word" }}
          >
            <Descriptions.Item label="Mã học liệu">
              <Tag color="geekblue" style={{ fontFamily: "monospace", fontWeight: 600 }}>
                {previewItem.code}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Phân loại">
              <Tag color="cyan">{previewItem.categoryLabel}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Tiêu đề học liệu" span={2}>
              <GText strong style={{ fontSize: 14, color: "#1a73e8" }}>
                {previewItem.title}
              </GText>
            </Descriptions.Item>
            <Descriptions.Item label="Môn học">
              <Tag color="purple">{previewItem.subjectName}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Khối áp dụng">
              Khối {previewItem.gradeLevel} (THPT)
            </Descriptions.Item>
            <Descriptions.Item label="Định dạng tệp">
              {getFormatTag(previewItem.fileFormat)}
            </Descriptions.Item>
            <Descriptions.Item label="Dung lượng tệp">
              {previewItem.fileSize}
            </Descriptions.Item>
            <Descriptions.Item label="Tác giả đóng góp">
              <GText strong>{previewItem.authorName}</GText>
            </Descriptions.Item>
            <Descriptions.Item label="Đơn vị trường">
              <Tag color="blue">{previewItem.schoolName}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Đánh giá chất lượng">
              <Rate disabled defaultValue={previewItem.rating} style={{ fontSize: 13 }} />
            </Descriptions.Item>
            <Descriptions.Item label="Thống kê tương tác">
              {previewItem.downloadsCount.toLocaleString()} lượt tải • {previewItem.viewsCount.toLocaleString()} lượt xem
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái kiểm duyệt" span={2}>
              <Tag color="success" style={{ fontWeight: 600, padding: "2px 10px" }}>
                ĐÃ ĐƯỢC HỘI ĐỒNG THẨM ĐỊNH SỞ GD&ĐT PHÊ DUYỆT
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Upload Modal */}
      <Modal
        title="Đóng góp Học liệu số & Tài nguyên Mới"
        open={isUploadModalOpen}
        onCancel={() => setIsUploadModalOpen(false)}
        footer={null}
        width={680}
      >
        <Form
          form={uploadForm}
          layout="vertical"
          onFinish={handleUploadSubmit}
          initialValues={{
            category: "E_LEARNING",
            subjectName: "Toán học",
            gradeLevel: 10,
            fileFormat: "PDF",
          }}
        >
          <Form.Item
            label="Tiêu đề học liệu số"
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề học liệu" }]}
          >
            <Input placeholder="VD: Bài giảng điện tử tương tác: Phương trình lượng giác cơ bản" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Phân loại học liệu" name="category">
                <Select
                  options={[
                    { value: "E_LEARNING", label: "Bài giảng E-Learning & SCORM" },
                    { value: "EXAM_BANK", label: "Ngân hàng Đề thi & Ma trận" },
                    { value: "E_BOOK", label: "Sách số & Thí nghiệm ảo" },
                    { value: "LESSON_PLAN", label: "Kế hoạch bài dạy KHBD 5512" },
                    { value: "INNOVATION", label: "Sáng kiến kinh nghiệm SKKN" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Môn học" name="subjectName">
                <Select
                  options={[
                    { value: "Toán học", label: "Toán học" },
                    { value: "Ngữ văn", label: "Ngữ văn" },
                    { value: "Tiếng Anh", label: "Tiếng Anh" },
                    { value: "Vật lí", label: "Vật lí" },
                    { value: "Hóa học", label: "Hóa học" },
                    { value: "Tin học", label: "Tin học" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Khối áp dụng" name="gradeLevel">
                <Select
                  options={[
                    { value: 10, label: "Khối 10" },
                    { value: 11, label: "Khối 11" },
                    { value: 12, label: "Khối 12" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Họ tên tác giả / Nhóm tác giả"
                name="author"
                rules={[{ required: true, message: "Vui lòng nhập tác giả" }]}
              >
                <Input placeholder="VD: ThS. Phan Thanh Nam" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Đơn vị trường học"
                name="school"
                rules={[{ required: true, message: "Vui lòng nhập đơn vị trường" }]}
              >
                <Input placeholder="VD: Trường THPT Nguyễn Siêu" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Mô tả tóm tắt nội dung học liệu" name="description">
            <Input.TextArea rows={3} placeholder="Tóm tắt nội dung, mục tiêu năng lực đạt được..." />
          </Form.Item>

          <Form.Item label="Tệp học liệu số đính kèm (PDF, SCORM zip, MP4, PPTX, DOCX)">
            <Upload.Dragger multiple={false} beforeUpload={() => false}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ fontSize: 36, color: "#1a73e8" }} />
              </p>
              <p className="ant-upload-text">
                Kéo thả tệp tin học liệu vào đây hoặc bấm để chọn tệp từ máy tính
              </p>
              <p className="ant-upload-hint">
                Hỗ trợ tệp SCORM .zip, Video MP4, Tài liệu PDF, Slide PPTX, Word DOCX (Tối đa 500MB)
              </p>
            </Upload.Dragger>
          </Form.Item>

          <Flex justify="end" gap={12}>
            <Button onClick={() => setIsUploadModalOpen(false)}>Hủy bỏ</Button>
            <Button type="primary" htmlType="submit">
              Xác nhận Tải lên & Đóng góp
            </Button>
          </Flex>
        </Form>
      </Modal>
    </ContentCover>
  );
}
