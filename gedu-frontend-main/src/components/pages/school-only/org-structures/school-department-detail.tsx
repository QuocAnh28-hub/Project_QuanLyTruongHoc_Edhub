import { Badge, Button, Card, Col, Divider, Flex, Modal, Row, Skeleton, Tag } from "antd";
import { Fragment, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../../../../contexts/AppContext";
import SchoolDepartmentDetailProvider, { useSchoolDepartmentDetailContext } from "../../../../contexts/school-only/school-departments/SchoolDepartmentDetailContext";
import { ToFormatedNumber, ToFullNameByLocale } from "../../../../utils/locale-helpers";
import { nav_links } from "../../../../utils/routes";
import CopyButton from "../../../atoms/copy-button";
import GBack from "../../../atoms/g-back";
import GText from "../../../atoms/g-text";
import GTitle from "../../../atoms/g-title";
import { ArrowRightOutlined } from "../../../atoms/svg/outlined-icons";
import SchoolDepartmentMembersTable from "./school-departments/school-department-member-table";

const SHOWED_CHILDS = 3
const SchoolDepartmentDetail = () => <SchoolDepartmentDetailProvider><Content /></SchoolDepartmentDetailProvider>
export default SchoolDepartmentDetail

function Content() {
  const { account } = useAppContext()
  const navigate = useNavigate()
  const { data, fetching } = useSchoolDepartmentDetailContext()
  const [open, setOpen] = useState<boolean>(false)
  const { positionHead, head_count, childs, child_count } = useMemo(() => {
    let positionHead = null as any
    let head_count = 0
    let childs = null as any
    let child_count = 0
    if (data && data.headPositions?.length) {
      positionHead = data.headPositions[0]
      head_count = data.headPositions.length
    }
    if (data && data.subDepartments?.length) {
      childs = data.subDepartments
      child_count = data.subDepartments.length
    }
    return { positionHead, head_count, childs, child_count }
  }, [data])
  return <Flex vertical gap={24}>
    <Flex gap={12}>
      <GBack default_route={nav_links.school_departments.route} />
      {fetching ? <Skeleton.Input active /> : <GTitle level={4}>{data?.name}</GTitle>}
    </Flex>
    {data ? <Row gutter={[16, 16]}>
      <Col xs={24} xl={8}>
        <Flex vertical gap={8} style={{ height: '100%' }}>
          <Flex gap={8} justify='space-between'>
            <GTitle level={5}>Thông tin chung</GTitle>
          </Flex>
          <Card styles={{ body: { padding: 16 } }} style={{ flex: 'auto' }}>
            <Flex vertical gap={2}>
              <GText strong type="secondary">Tên Phòng ban</GText>
              <GText>{data.name}</GText>
              <Divider style={{ marginTop: 12, marginBottom: 12 }} />
              <GText strong type="secondary">Mã Đơn vị</GText>
              <GText>{data.code}</GText>
              <Divider style={{ marginTop: 12, marginBottom: 12 }} />
              <GText strong type="secondary">Trực thuộc Đơn vị cha</GText>
              <GText>{data.parentId ? data.parentDepartmentName : account?.additional.school_name}</GText>
              <Divider style={{ marginTop: 12, marginBottom: 12 }} />
              <GText strong type="secondary">Số lượng thành viên</GText>
              <GText>{ToFormatedNumber(data.memberCount)}</GText>
            </Flex>
          </Card>
        </Flex>
      </Col>
      <Col xs={24} xl={8}>
        <Flex vertical gap={8} style={{ height: '100%' }}>
          <Flex gap={8} justify='space-between'>
            <Flex gap={12} align="center">
              <GTitle level={5}>Trưởng bộ phận</GTitle>
              <Badge count={head_count > 1 ? head_count : 0} />
            </Flex>
          </Flex>
          <Card styles={{ body: { padding: 16 } }} style={{ flex: 'auto' }}>
            {positionHead ?
              <Flex vertical gap={2}>
                <GText strong type="secondary">Họ tên</GText>
                <GText>{ToFullNameByLocale(positionHead.firstName, positionHead.lastName)}</GText>
                <Divider style={{ marginTop: 12, marginBottom: 12 }} />
                <GText strong type="secondary">Chức danh</GText>
                <GText>{positionHead.positionTitle}</GText>
                <Divider style={{ marginTop: 12, marginBottom: 12 }} />
                <GText strong type="secondary">Email</GText>
                <Flex gap={8}>
                  <GText>{positionHead.email}</GText>
                  {positionHead.email && <CopyButton text={positionHead.email} status='simple' />}
                </Flex>
                <Divider style={{ marginTop: 12, marginBottom: 12 }} />
                <GText strong type="secondary">Số điện thoại</GText>
                <Flex gap={8}>
                  <GText>{positionHead.phone}</GText>
                  {positionHead.phone && <CopyButton text={positionHead.phone} status='simple' />}
                </Flex>
              </Flex> :
              <Flex vertical gap={2}>
                <GText italic>Chưa có nhân viên nào.</GText>
                <Link to={nav_links.staffs.route}>Vui lòng Nhập liệu hồ sơ Giáo viên & Cán bộ.</Link>
              </Flex>
            }
          </Card>
        </Flex>
      </Col>
      <Col xs={24} xl={8}>
        <Flex vertical gap={8} style={{ height: '100%' }}>
          <Flex gap={8} justify='space-between'>
            <Flex gap={12} align="center">
              <GTitle level={5}>Đơn vị con</GTitle>
              <Badge count={child_count ? child_count : 0} />
            </Flex>
            {child_count > SHOWED_CHILDS && <Button type="link" onClick={() => { setOpen(true) }}>Xem tất cả</Button>}
          </Flex>
          <Card styles={{ body: { padding: 16 } }} style={{ flex: 'auto' }}>
            <Flex vertical gap={2}>
              {!childs?.length && <GText italic>Không có đơn vị con.</GText>}
              {childs?.slice(0, SHOWED_CHILDS).map((child: any, idx: number) => {
                return <Fragment key={child.id}>
                  <Flex gap={12} justify="space-between">
                    <GText>{child.name}</GText>
                    <Button icon={<ArrowRightOutlined />}
                      onClick={() => navigate(nav_links.school_department_detail.route.replace(':id', child.id))}
                    />
                  </Flex>
                  {idx < childs.length - 1 ? <Divider style={{ marginTop: 12, marginBottom: 12 }} /> : null}
                </Fragment>
              })}
              {childs?.length > SHOWED_CHILDS ? <Flex justify="end">
                <Tag style={{ margin: 0 }}>+{childs.length - SHOWED_CHILDS}</Tag>
              </Flex> : null}
            </Flex>
          </Card>
        </Flex>
        {child_count > SHOWED_CHILDS &&
          <Modal
            open={open}
            maskClosable={false}
            title='Tất cả Đơn vị con'
            cancelText="Đóng"
            onCancel={() => {
              setOpen(false)
            }}
            footer={(_, { CancelBtn }) => (
              <CancelBtn />
            )}
          >
            <Flex vertical style={{ marginTop: 24, marginBottom: 24 }}>
              {childs?.map((child: any, idx: number) => {
                return <Fragment key={child.id}>
                  <Flex gap={12} justify="space-between">
                    <GText>{child.name}</GText>
                    <Button icon={<ArrowRightOutlined />}
                      onClick={() => {
                        setOpen(false)
                        navigate(nav_links.school_department_detail.route.replace(':id', child.id))
                      }}
                    />
                  </Flex>
                  {idx < childs.length - 1 ? <Divider style={{ marginTop: 12, marginBottom: 12 }} /> : null}
                </Fragment>
              })}
            </Flex>
          </Modal>
        }
      </Col>
    </Row> : null}
    <Row>
      <Flex vertical gap={16} flex={1} style={{ width: '100%' }}>
        <GTitle level={5}>Danh sách thành viên</GTitle>
        <SchoolDepartmentMembersTable />
      </Flex>
    </Row>
  </Flex>
}