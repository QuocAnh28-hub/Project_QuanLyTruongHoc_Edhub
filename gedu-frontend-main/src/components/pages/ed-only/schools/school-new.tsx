import { Button, Card, Col, Divider, Flex, Steps } from "antd";
import { useEffect, useState } from "react";
import { useAppContext } from "../../../../contexts/AppContext";
import SchoolNewProvider, { useSchoolCreateContext } from "../../../../contexts/ed-only/SchoolNewContext";
import { useLayoutContext } from "../../../../contexts/EDLayoutContext";
import RouterBlockerProvider, { useRouterBlockerContext } from "../../../../contexts/RouterBlockerContext";
import { SplitNameByLocale } from "../../../../utils/locale-helpers";
import { nav_links } from "../../../../utils/routes";
import ContentCover from "../../../atoms/content-cover";
import GTitle from "../../../atoms/g-title";
import { ArrowLeftOutlined, ArrowRightOutlined, CheckOutlined, DoubleArrowOutlined } from "../../../atoms/svg/outlined-icons";
import SchoolNewStep1 from "./school-new/school-new-step1";
import SchoolNewStep2 from "./school-new/school-new-step2";
import SchoolNewStep3 from "./school-new/school-new-step3";

export default function SchoolNew() {
  const { setPageInfo } = useLayoutContext()
  useEffect(() => {
    setPageInfo([
      { path: nav_links.ed_dashboard.route, title: nav_links.ed_dashboard.title },
      { path: nav_links.schools.route, title: nav_links.schools.title },
      { title: nav_links.school_new.title },
    ], nav_links.school_new.title)
    return () => { setPageInfo() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <SchoolNewProvider>
    <RouterBlockerProvider><Content /></RouterBlockerProvider>
  </SchoolNewProvider>
}
function Content() {
  const { account } = useAppContext()
  const { callMessage } = useLayoutContext()
  const { callForceNavigate } = useRouterBlockerContext()
  const [step, setStep] = useState(1)
  const { school, form_step1, form_step2, form_step3, createSchool, updateSchool, createSchoolAdmin, loading } = useSchoolCreateContext()

  async function onSaveStep1() {
    form_step1?.validateFields().catch(() => { return }).finally(async () => {
      const is_err = form_step1.getFieldsError().some((err) => { return err.errors.length ? true : false })
      if (is_err) {
        callMessage('Chưa điền hết thông tin bắt buộc', 'warning')
        return
      }
      const __school = form_step1.getFieldsValue()
      __school.id = school.id
      const { firstName, lastName } = SplitNameByLocale(__school.principalName)
      __school.shortName = __school.name
      __school.principalFirstName = firstName
      __school.principalLastName = lastName
      __school.provinceId = account?.additional.province_id
      __school.canPreschool = __school.levels.find((l: string) => l == 'canPreschool') ? true : false
      __school.canPrimarySchool = __school.levels.find((l: string) => l == 'canPrimarySchool') ? true : false
      __school.canLowerSecondarySchool = __school.levels.find((l: string) => l == 'canLowerSecondarySchool') ? true : false
      __school.canUpperSecondarySchool = __school.levels.find((l: string) => l == 'canUpperSecondarySchool') ? true : false
      __school.canComplementaryEducation = __school.levels.find((l: string) => l == 'canComplementaryEducation') ? true : false
      const res = await createSchool(__school)
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
      const __school = { ...school }
      const form_data = form_step2.getFieldsValue()
      __school.dailyScheduleType = form_data.dailyScheduleType
      const res = await updateSchool(__school)
      if (!res) return
      setStep(3)
    })
  }
  async function onSaveAdmin() {
    form_step3?.validateFields().catch(() => { return }).finally(async () => {
      const is_err = form_step3.getFieldsError().some((err) => { return err.errors.length ? true : false })
      if (is_err) {
        callMessage('Chưa điền hết thông tin bắt buộc', 'warning')
        return false
      }
      const __admin = form_step3.getFieldsValue()
      const { firstName, lastName } = SplitNameByLocale(__admin.fullName)
      __admin.firstName = firstName
      __admin.lastName = lastName
      const res = await createSchoolAdmin(__admin)
      if (!res) return false
      //save and back to list
      callForceNavigate(nav_links.schools.route)
    })
  }
  return <ContentCover>
    <Flex style={{ paddingBottom: 20 }} justify="space-between">
      <GTitle level={3}>Tạo Trường học</GTitle>
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
          <Button loading={loading} type='primary' icon={<CheckOutlined />} onClick={() => onSaveAdmin()}>Hoàn tất</Button>
        </Flex> : null
      }
    </Flex>
    <Card style={{ flex: 1 }}>
      <Flex>
        <Col flex='none' style={{ margin: "16px 24px 16px 0", maxWidth: 227, borderRight: 1 }}>
          <Steps
            direction="vertical"
            current={step - 1}
            items={[
              {
                title: 'Thông tin Trường',
                description: "Cung cấp chi tiết chung & liên hệ",
              },
              {
                title: 'Đặc điểm & Chương trình',
                description: 'Mô tả chính sách, hình thức học & giảng dạy',
              },
              {
                title: 'Tài khoản Quản trị',
                description: 'Tài khoản Gedu cho Trường và Quản trị viên trường',
              },
            ]}
          />
        </Col>
        <Divider type="vertical" style={{ height: 'auto', margin: 0 }} />
        {step == 1 && <SchoolNewStep1 />}
        {step == 2 && <SchoolNewStep2 />}
        {step == 3 && <SchoolNewStep3 />}
      </Flex>
    </Card>
  </ContentCover>
}