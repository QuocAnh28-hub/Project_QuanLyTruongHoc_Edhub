import { Button, Card, Col, Divider, Flex, Steps, Typography } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StaffNewProvider, { useStaffCreateContext } from "../../../../contexts/school-only/staffs/StaffNewContext";
import { useLayoutContext } from "../../../../contexts/SchoolLayoutContext";
import { SplitNameByLocale } from "../../../../utils/locale-helpers";
import { nav_links } from "../../../../utils/routes";
import ContentCover from "../../../atoms/content-cover";
import { ArrowLeftOutlined, ArrowRightOutlined, CheckOutlined, DoubleArrowOutlined } from "../../../atoms/svg/outlined-icons";
import StaffNewStep1 from "./staff-new/staff-new-step1";
import StaffNewStep2 from "./staff-new/staff-new-step2";
import StaffNewStep3 from "./staff-new/staff-new-step3";

const { Title } = Typography
export default function SchoolStaffNew() {
  const { setPageInfo } = useLayoutContext()
  useEffect(() => {
    setPageInfo([
      { path: nav_links.school_dashboard.route, title: nav_links.school_dashboard.title },
      { path: nav_links.staffs.route, title: nav_links.staffs.title },
      { title: nav_links.staff_new.title },
    ], nav_links.staff_new.title)
    return () => { setPageInfo() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <StaffNewProvider>
    <Content />
  </StaffNewProvider>
}
function Content() {
  const { callMessage } = useLayoutContext()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const { staff, form_step1, form_step2, createStaff, updateStaffDeptPos, loading } = useStaffCreateContext()

  // SAVE STEP 1
  async function onSaveStep1() {
    form_step1?.validateFields().catch(() => { return }).finally(async () => {
      const is_err = form_step1.getFieldsError().some((err) => { return err.errors.length ? true : false })
      if (is_err) {
        callMessage('Chưa điền hết thông tin bắt buộc', 'warning')
        return
      }
      const __staff = form_step1.getFieldsValue()
      __staff.id = staff.id
      const { firstName, lastName } = SplitNameByLocale(__staff.fullName)
      __staff.firstName = firstName
      __staff.lastName = lastName
      const res = await createStaff(__staff)
      if (!res) return
      setStep(2)
    })
  }
  async function onSaveStep2() {
    form_step2?.validateFields().catch(() => { return }).finally(async () => {
      const is_err = form_step2.getFieldsError().some((err) => { return err.errors.length ? true : false })
      if (is_err) {
        callMessage('Chưa điền hết thông tin bắt buộc', 'warning')
        return
      }
      const form_data = form_step2.getFieldsValue()
      const res = await updateStaffDeptPos(form_data)
      if (!res) return
      setStep(3)
    })
  }
  return <ContentCover>
    <Flex style={{ paddingBottom: 20 }} justify="space-between">
      <Title level={3} style={{ margin: 0 }}>Tạo hồ sơ Cán bộ & Giáo viên</Title>
      {step == 1 ?
        <Flex gap={12}>
          <Button loading={loading} type='primary' icon={<ArrowRightOutlined />} iconPosition="end" onClick={() => onSaveStep1()}>Lưu & Tiếp tục</Button>
        </Flex> : null
      }
      {step == 2 ?
        <Flex gap={12}>
          <Button loading={loading} type='text' icon={<ArrowLeftOutlined />} onClick={() => setStep(1)}>Quay lại</Button>
          <Button loading={loading} icon={<DoubleArrowOutlined />} iconPosition="end" onClick={() => { form_step2?.resetFields(); setStep(3) }}>Bỏ qua</Button>
          <Button loading={loading} type='primary' icon={<ArrowRightOutlined />} iconPosition="end" onClick={() => onSaveStep2()}>Lưu & Tiếp tục</Button>
        </Flex> : null
      }
      {step == 3 ?
        <Flex gap={12}>
          <Button loading={loading} type='text' icon={<ArrowLeftOutlined />} onClick={() => setStep(2)}>Quay lại</Button>
          <Button loading={loading} type='primary' icon={<CheckOutlined />} onClick={() => navigate(nav_links.staffs.route)}>Hoàn tất</Button>
        </Flex> : null
      }
    </Flex>
    <Card>
      <Flex>
        <Col flex='none' style={{ margin: "16px 24px 16px 0", maxWidth: 227, borderRight: 1 }}>
          <Steps className="responsive"
            direction="vertical"
            current={step - 1}
            items={[
              {
                title: 'Thông tin Cá nhân',
                description: "Nhập thông tin định danh",
              },
              {
                title: 'Thông tin Chuyên môn & Công việc',
                description: 'Trình độ & vị trí công tác',
              },
              {
                title: 'Tài khoản Hệ thống & Phân quyền',
                description: 'Tạo tài khoản Gedu & gán vai trò',
              },
            ]}
          />
        </Col>
        <Divider type="vertical" style={{ height: 'auto', margin: 0 }} />
        {step == 1 && <StaffNewStep1 />}
        {step == 2 && <StaffNewStep2 />}
        {step == 3 && <StaffNewStep3 />}
      </Flex>
    </Card>
  </ContentCover>
}