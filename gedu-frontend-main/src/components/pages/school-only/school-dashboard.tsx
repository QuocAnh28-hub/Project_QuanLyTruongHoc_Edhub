import { Button, Col, Divider, Flex, Row } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import { nav_links } from "../../../utils/routes";
import ContentCover from "../../atoms/content-cover";
import GCard from "../../atoms/g-card";
import GText from "../../atoms/g-text";
import GTitle from "../../atoms/g-title";
import { ArrowRightOutlined, ClassOutlined, OpenInNewOutlined, PlusOutlined, ScheduleOutlined, StudentOutlined, ThunderboltOutlined, UserGroupOutlined } from "../../atoms/svg/outlined-icons";
import { svg_class_table, svg_drum, svg_schedule, svg_school_bag, svg_stationery } from "../../atoms/svg/svg-list";

export default function SchoolDashboard() {
  const [item, setItem] = useState<number>(1)
  return <ContentCover size="small" style={{ paddingTop: 40, paddingBottom: 40 }}>
    <Flex vertical gap={24}>
      <Flex vertical gap={16}>
        <Flex vertical gap={8}>
          <GTitle level={4}>Các Danh mục Gedu đã Chuẩn bị sẵn</GTitle>
          <GText italic>Để giúp bạn tiết kiệm thời gian, chúng tôi đã khởi tạo sẵn các danh mục quan trọng dựa trên các quy định và mô hình phổ biến của ngành giáo dục Việt Nam.</GText>
        </Flex>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <GCard vertical gap={8} size='lg' align='start' style={{ position: 'relative', height: '100%' }}>
              <GText>Cấu trúc Tổ chức & Chức danh</GText>
              <GText type="secondary">Lưu ý: Trong giai đoạn đầu, các danh mục này sẽ được sử dụng chung. Chức năng tùy chỉnh chi tiết sẽ được cập nhật trong các phiên bản sau.</GText>
              <Link to={nav_links.school_departments.route}>
                <Button type="link"
                  iconPosition="end" icon={<ArrowRightOutlined />}
                  style={{ paddingLeft: 0, paddingRight: 0 }}
                >Xem Cấu trúc & Chức danh</Button>
              </Link>
              <img src='./org.png' style={{ position: 'absolute', right: 0, bottom: 0 }} />
            </GCard>
          </Col>
          <Col xs={24} lg={12}>
            <GCard vertical gap={8} size='lg' align='start' style={{ position: 'relative', height: '100%' }}>
              <GText>Chương trình học & Môn học</GText>
              <GText type="secondary">Danh sách các chương trình học (GDPT 2018) và các môn học tương ứng. Bạn có thể thực hiện thiết lập chi tiết cho từng Khối và Lớp học.</GText>
              <Link to={nav_links.curriculums.route}>
                <Button type="link"
                  iconPosition="end" icon={<ArrowRightOutlined />}
                  style={{ paddingLeft: 0, paddingRight: 0 }}
                >Xem Chương trình học & Môn học</Button>
              </Link>
              <img src='./curr.png' style={{ position: 'absolute', right: 0, bottom: 0 }} />
            </GCard>
          </Col>
        </Row>
      </Flex>
      <Flex vertical gap={16}>
        <GTitle level={4}>Lộ trình Thiết lập của bạn</GTitle>
        <GCard gap={8} size='lg' align='start'>
          <Col span={24}>
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={8}>
                <Flex vertical gap={6}>
                  {/* I */}
                  <Flex gap={24} className='cursor-pointer' style={{ color: item == 1 ? 'var(--primary)' : undefined }} onClick={() => { setItem(1) }}>
                    <Flex vertical>
                      <ScheduleOutlined size={24} />
                      <Divider type="vertical" style={{ margin: '6px 11px 0', height: 20 }} />
                    </Flex>
                    <GText style={{ color: item == 1 ? 'var(--primary)' : undefined }}>Tạo năm học</GText>
                  </Flex>
                  {/* II */}
                  <Flex gap={24} className='cursor-pointer' style={{ color: item == 2 ? 'var(--primary)' : undefined }} onClick={() => { setItem(2) }}>
                    <Flex vertical>
                      <ClassOutlined size={24} />
                      <Divider type="vertical" style={{ margin: '6px 11px 0', height: 20 }} />
                    </Flex>
                    <GText style={{ color: item == 2 ? 'var(--primary)' : undefined }}>Thiết lập Khối lớp & Lớp học</GText>
                  </Flex>
                  {/* III */}
                  <Flex gap={24} className='cursor-pointer' style={{ color: item == 3 ? 'var(--primary)' : undefined }} onClick={() => { setItem(3) }}>
                    <Flex vertical>
                      <UserGroupOutlined size={24} />
                      <Divider type="vertical" style={{ margin: '6px 11px 0', height: 20 }} />
                    </Flex>
                    <GText style={{ color: item == 3 ? 'var(--primary)' : undefined }}>Tải lên danh sách Cán bộ & Giáo viên & Phân công giảng dạy</GText>
                  </Flex>
                  {/* IV */}
                  <Flex gap={24} className='cursor-pointer' style={{ color: item == 4 ? 'var(--primary)' : undefined }} onClick={() => { setItem(4) }}>
                    <Flex vertical>
                      <StudentOutlined size={24} />
                      <Divider type="vertical" style={{ margin: '6px 11px 0', height: 20 }} />
                    </Flex>
                    <GText style={{ color: item == 4 ? 'var(--primary)' : undefined }}>Tải lên danh sách Học sinh & Xếp lớp</GText>
                  </Flex>
                  {/* V */}
                  <Flex gap={24} className='cursor-pointer' style={{ color: item == 5 ? 'var(--primary)' : undefined }} onClick={() => { setItem(5) }}>
                    <Flex vertical>
                      <ThunderboltOutlined size={24} />
                      <Divider type="vertical" style={{ margin: '6px 11px 0', height: 20 }} />
                    </Flex>
                    <GText style={{ color: item == 5 ? 'var(--primary)' : undefined }}>Kích hoạt Năm học mới</GText>
                  </Flex>
                </Flex>
              </Col>
              <Col xs={24} lg={16}>
                <Flex vertical gap={16} style={{ position: 'relative', minHeight: 280, padding: 24, backgroundColor: '#E2EFF8' }}>
                  {item == 1 && <SchoolYears />}
                  {item == 2 && <Classes />}
                  {item == 3 && <Staffs />}
                  {item == 4 && <Students />}
                  {item == 5 && <ActivateSchoolYear />}
                </Flex>
              </Col>
            </Row>
          </Col>
        </GCard>
      </Flex>
    </Flex>
  </ContentCover>
}
function SchoolYears() {
  return <>
    <GTitle level={3}>Xây dựng khung thời gian cho hoạt động giảng dạy của trường.</GTitle>
    <GText>Bao gồm thời gian diễn ra năm học, học kỳ và các kỳ thi chính.</GText>
    <Flex style={{ marginTop: 8 }}>
      <Link to={nav_links.school_year_new.route}>
        <Button type="primary"
          icon={<PlusOutlined />}
        >Tạo năm học</Button>
      </Link>
      <Button type="link" iconPosition="end" icon={<OpenInNewOutlined />}>Xem hướng dẫn</Button>
      <Flex style={{ position: 'absolute', right: 0, bottom: 12 }}>{svg_schedule(140)}</Flex>
    </Flex>
  </>
}
function Classes() {
  return <>
    <GTitle level={3}>Tổ chức Lớp học</GTitle>
    <GText>Tạo các khối lớp và các lớp học cụ thể cho năm học mới.</GText>
    <Flex style={{ marginTop: 8 }}>
      <Link to={nav_links.classes_new.route}>
        <Button type="primary"
          icon={<PlusOutlined />}
        >Tạo lớp hàng loạt</Button>
      </Link>
      <Button type="link" iconPosition="end" icon={<OpenInNewOutlined />}>Xem hướng dẫn</Button>
      <Flex style={{ position: 'absolute', right: 0, bottom: 12 }}>{svg_class_table(140)}</Flex>
    </Flex>
  </>
}

function Staffs() {
  return <>
    <GTitle level={3}>Quản lý Nhân sự & Phân công</GTitle>
    <GText>Nhập danh sách giáo viên và thực hiện phân công giảng dạy cho các lớp.</GText>
    <Flex style={{ marginTop: 8 }}>
      <Link to={nav_links.staff_import.route}>
        <Button type="primary"
          icon={<PlusOutlined />}
        >Tải lên danh sách</Button>
      </Link>
      <Button type="link" iconPosition="end" icon={<OpenInNewOutlined />}>Xem hướng dẫn</Button>
      <Flex style={{ position: 'absolute', right: 0, bottom: 12 }}>{svg_stationery(140)}</Flex>
    </Flex>
  </>
}
function Students() {
  return <>
    <GTitle level={3}>Quản lý Học sinh & Xếp lớp</GTitle>
    <GText>Nhập danh sách học sinh và xếp các em vào các lớp học tương ứng.</GText>
    <Flex style={{ marginTop: 8 }}>
      <Link to={nav_links.student_import.route}>
        <Button type="primary"
          icon={<PlusOutlined />}
        >Tải lên danh sách</Button>
      </Link>
      <Button type="link" iconPosition="end" icon={<OpenInNewOutlined />}>Xem hướng dẫn</Button>
      <Flex style={{ position: 'absolute', right: 0, bottom: 12 }}>{svg_school_bag(140)}</Flex>
    </Flex>
  </>
}
function ActivateSchoolYear() {
  return <>
    <GTitle level={3}>Kích hoạt Năm học</GTitle>
    <GText>Chính thức bắt đầu năm học mới và mở các tính năng vận hành hàng ngày.</GText>
    <Flex style={{ marginTop: 8 }}>
      <Link to={nav_links.school_years.route}>
        <Button type="primary"
          icon={<ThunderboltOutlined />}
        >Kích hoạt Năm học</Button>
      </Link>
      <Button type="link" iconPosition="end" icon={<OpenInNewOutlined />}>Xem hướng dẫn</Button>
      <Flex style={{ position: 'absolute', right: 0, bottom: 12 }}>{svg_drum(140)}</Flex>
    </Flex>
  </>
}