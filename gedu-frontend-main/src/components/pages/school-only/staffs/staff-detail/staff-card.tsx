import { Avatar, Card, Flex, Typography } from "antd"
import { Fragment } from "react/jsx-runtime"
import { useStaffDetailContext } from "../../../../../contexts/school-only/staffs/StaffDetailContext"
import { ToFullNameByLocale } from "../../../../../utils/locale-helpers"
import CopyButton from "../../../../atoms/copy-button"
import GTitle from "../../../../atoms/g-title"
import { DepartmentOutlined, EmergencyOutlined, MailOutlined, PhoneOutlined, UserOutlined, WorkOutlined } from "../../../../atoms/svg/outlined-icons"

const { Text } = Typography
export default function StaffCard() {
  const { data } = useStaffDetailContext()
  if (!data) return
  return <Flex vertical gap={12}>
    <Card style={{ overflow: 'hidden', backgroundColor: 'var(--background-color)' }}>
      <Flex vertical gap={8}>
        <Avatar size={96} icon={<UserOutlined />}
          style={{ minWidth: 96, backgroundColor: '#DDD', border: '3px solid white' }}
        />
        <GTitle level={4} style={{ marginTop: 8 }}>{ToFullNameByLocale(data.firstName, data.lastName)}</GTitle>
        <Text strong>Mã nhân sự: {data.code || data.id}</Text>
        <Flex><CopyButton text={data.code} /></Flex>
      </Flex>
    </Card>
    {
      data.positionTitle ?
        <Flex gap={8} style={{ marginTop: 24 }}>
          <WorkOutlined />
          <Text>{data.positionTitle}</Text>
        </Flex> : null
    }
    {
      data.departmentName ? <Fragment>
        <Text style={{ marginTop: 24 }} strong>Phòng ban & Địa điểm làm việc</Text>
        <Flex gap={8}><DepartmentOutlined /><Text>{data.departmentName}</Text></Flex>
      </Fragment> : null
    }
    {/* <Flex gap={8}><LocationOutlined /><Text>Cơ sở 1</Text></Flex> */}
    <Text style={{ marginTop: 24 }} strong>Liên hệ</Text>
    <Flex gap={8}><MailOutlined /><Text>{data.email}</Text></Flex>
    <Flex gap={8}><PhoneOutlined /><Text>{data.phone}</Text></Flex>
    <Text style={{ marginTop: 24 }} strong>Liên hệ khẩn cấp</Text>
    <Flex gap={8}><EmergencyOutlined />
      <Text>{data.contactPhone1}</Text>
      <Text>{data.contactPhone2}</Text>
    </Flex>
  </Flex>
}