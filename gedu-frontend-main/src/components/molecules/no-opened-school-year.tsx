import { Button, Card, Col, Flex, Row } from "antd";
import { Link } from "react-router-dom";
import { nav_links } from "../../utils/routes";
import ContentCover from "../atoms/content-cover";
import GTitle from "../atoms/g-title";
import { ArrowRightOutlined } from "../atoms/svg/outlined-icons";
import EmptyState from "./empty-state";

export default function NoOpenedSchoolYear({ title }: { title?: string }) {
  return <ContentCover size="stretch">
    <Row style={{ paddingBottom: 4 }} gutter={16}>
      <Col style={{ marginBottom: 16 }}>
        <GTitle level={3}>{title}</GTitle>
      </Col>
    </Row>
    <Card style={{ paddingTop: 60, paddingBottom: 60 }}>
      <EmptyState icon="lock"
        title='Bạn cần thiết lập Năm học trước'
        desc='Để có thể tạo và quản lý lớp học, bạn cần phải tạo ít nhất một năm học. Hãy bắt đầu bằng cách thiết lập năm học đầu tiên cho trường của bạn.'
      />
      <Flex gap={12} justify="center" style={{ marginTop: 24 }}>
        <Link to={nav_links.school_years.route}>
          <Button type='primary' icon={<ArrowRightOutlined />} iconPosition='end'>Đến trang Năm học & Học kỳ</Button>
        </Link>
      </Flex>
    </Card>
  </ContentCover>
}