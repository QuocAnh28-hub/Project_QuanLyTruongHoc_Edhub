import { Button, Card, Col, Divider, Flex, Steps } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentNewProvider, { useStudentCreateContext } from "../../../../contexts/school-only/students/StudentNewContext";
import { useLayoutContext } from "../../../../contexts/SchoolLayoutContext";
import { StudentContactRelationshipEnum } from "../../../../models/enums";
import { StudentContact } from "../../../../models/student-model";
import { SplitNameByLocale } from "../../../../utils/locale-helpers";
import { nav_links } from "../../../../utils/routes";
import ContentCover from "../../../atoms/content-cover";
import GTitle from "../../../atoms/g-title";
import { ArrowLeftOutlined, ArrowRightOutlined, CheckOutlined, DoubleArrowOutlined } from "../../../atoms/svg/outlined-icons";
import StudentNewStep1 from "./student-new/student-new-step1";
import StudentNewStep2 from "./student-new/student-new-step2";
import StudentNewStep3 from "./student-new/student-new-step3";
import StudentNewStep4 from "./student-new/student-new-step4";
import StudentNewStep5 from "./student-new/student-new-step5";

export default function StudentNew() {
  const { setPageInfo } = useLayoutContext()
  useEffect(() => {
    setPageInfo([
      { path: nav_links.school_dashboard.route, title: nav_links.school_dashboard.title },
      { path: nav_links.students.route, title: nav_links.students.title },
      { title: nav_links.student_new.title },
    ], nav_links.student_new.title)
    return () => { setPageInfo() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <StudentNewProvider>
    <Content />
  </StudentNewProvider>
}
function Content() {
  const { callMessage } = useLayoutContext()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const {
    student, loading, grant_access_id,
    form_step1, form_step2, form_step3, form_step4,
    createStudent, createStudentContacts,
    updateStudentAcademicAndPolicies, updateStudentMedicalInfo,
    grantAccessContact
  } = useStudentCreateContext()

  // SAVE STEP 1
  async function onSaveStep1() {
    form_step1?.validateFields().catch(() => { return }).finally(async () => {
      const is_err = form_step1.getFieldsError().some((err) => { return err.errors.length ? true : false })
      if (is_err) {
        callMessage('Chưa điền hết thông tin bắt buộc', 'warning')
        return
      }
      const __student = form_step1.getFieldsValue()
      __student.id = student.id
      const { firstName, lastName } = SplitNameByLocale(__student.fullName)
      __student.firstName = firstName
      __student.lastName = lastName
      if (__student.same_as_permanent) {
        __student.temporaryResidenceProvinceId = __student.permanentResidenceProvinceId
        __student.temporaryResidenceWardId = __student.permanentResidenceWardId
        __student.temporaryResidenceAddress = __student.permanentResidenceAddress
      }
      const res = await createStudent(__student)
      if (!res) return
      setStep(2)
    })
  }

  // SAVE STEP 2
  async function onSaveStep2() {
    form_step2?.validateFields().catch(() => { return }).finally(async () => {
      const is_err = form_step2.getFieldsError().some((err) => { return err.errors.length ? true : false })
      if (is_err) {
        callMessage('Chưa điền hết thông tin bắt buộc', 'warning')
        return
      }
      const form_data = form_step2.getFieldsValue()
      if (!form_data.is_main_contact1 && !form_data.is_main_contact2 && !form_data.is_main_contact3) {
        callMessage('Chưa chọn người liên hệ chính', 'warning')
        return
      }
      const _value = [] as StudentContact[]
      if (form_data.fullName1) {
        const { firstName, lastName } = SplitNameByLocale(form_data.fullName1)
        let relationshipTitle = ''
        switch (form_data.relationship1) {
          case StudentContactRelationshipEnum.Cha.enum:
            relationshipTitle = StudentContactRelationshipEnum.Cha.title
            break
          case StudentContactRelationshipEnum.Me.enum:
            relationshipTitle = StudentContactRelationshipEnum.Me.title
            break
          case StudentContactRelationshipEnum.Khac.enum:
            relationshipTitle = form_data.relationshipTitle1
            break
          default:
            break
        }

        if (form_data.dateOfBirth1) {
          const year = new Date(form_data.dateOfBirth1).getFullYear();
          form_data.dateOfBirth1 = new Date(Date.UTC(year, 0, 1, 0, 30, 0));
        }

        const _new = {
          email: form_data.email1,
          firstName: firstName,
          lastName: lastName,
          isMainContact: form_data.is_main_contact1,
          phone: form_data.phone1,
          relationship: form_data.relationship1,
          relationshipTitle: relationshipTitle,
          dateOfBirth: form_data.dateOfBirth1,
          citizenId: form_data.citizenId1,
          occupation: form_data.occupation1
        } as StudentContact
        _value.push(_new)
      }
      if (form_data.fullName2) {
        const { firstName, lastName } = SplitNameByLocale(form_data.fullName2)
        let relationshipTitle = ''
        switch (form_data.relationship2) {
          case StudentContactRelationshipEnum.Cha.enum:
            relationshipTitle = StudentContactRelationshipEnum.Cha.title
            break
          case StudentContactRelationshipEnum.Me.enum:
            relationshipTitle = StudentContactRelationshipEnum.Me.title
            break
          case StudentContactRelationshipEnum.Khac.enum:
            relationshipTitle = form_data.relationshipTitle2
            break
          default:
            break
        }

        if (form_data.dateOfBirth2) {
          const year = new Date(form_data.dateOfBirth2).getFullYear();
          form_data.dateOfBirth2 = new Date(Date.UTC(year, 0, 1, 0, 30, 0));
        }

        const _new = {
          email: form_data.email2,
          firstName: firstName,
          lastName: lastName,
          isMainContact: form_data.is_main_contact2,
          phone: form_data.phone2,
          relationship: form_data.relationship2,
          relationshipTitle: relationshipTitle,
          dateOfBirth: form_data.dateOfBirth2,
          citizenId: form_data.citizenId2,
          occupation: form_data.occupation2
        } as StudentContact
        _value.push(_new)
      }
      if (form_data.fullName3) {
        const { firstName, lastName } = SplitNameByLocale(form_data.fullName3)
        let relationshipTitle = ''
        switch (form_data.relationship3) {
          case StudentContactRelationshipEnum.Cha.enum:
            relationshipTitle = StudentContactRelationshipEnum.Cha.title
            break
          case StudentContactRelationshipEnum.Me.enum:
            relationshipTitle = StudentContactRelationshipEnum.Me.title
            break
          case StudentContactRelationshipEnum.Khac.enum:
            relationshipTitle = form_data.relationshipTitle3
            break
          default:
            break
        }

        if (form_data.dateOfBirth3) {
          const year = new Date(form_data.dateOfBirth3).getFullYear();
          form_data.dateOfBirth3 = new Date(Date.UTC(year, 0, 1, 0, 30, 0));
        }

        const _new = {
          email: form_data.email3,
          firstName: firstName,
          lastName: lastName,
          isMainContact: form_data.is_main_contact3,
          phone: form_data.phone3,
          relationship: form_data.relationship3,
          relationshipTitle: relationshipTitle,
          dateOfBirth: form_data.dateOfBirth3,
          citizenId: form_data.citizenId3,
          occupation: form_data.occupation3
        } as StudentContact
        _value.push(_new)
      }
      const result = await createStudentContacts(student.id, _value, form_data)
      if (!result) return
      setStep(3)
    })
  }

  // SAVE STEP 3
  async function onSaveStep3() {
    form_step3?.validateFields().catch(() => { return }).finally(async () => {
      const is_err = form_step3.getFieldsError().some((err) => { return err.errors.length ? true : false })
      if (is_err) {
        callMessage('Chưa điền hết thông tin bắt buộc', 'warning')
        return
      }
      const form_data = form_step3.getFieldsValue()
      const result = await updateStudentAcademicAndPolicies(student.id, form_data)
      if (!result) return
      setStep(4)
    })
  }

  // SAVE STEP 4
  async function onSaveStep4() {
    form_step4?.validateFields().catch(() => { return }).finally(async () => {
      const is_err = form_step4.getFieldsError().some((err) => { return err.errors.length ? true : false })
      if (is_err) {
        callMessage('Chưa điền hết thông tin bắt buộc', 'warning')
        return
      }
      const form_data = form_step4.getFieldsValue()
      const info = [] as any
      if (form_data.special_cases) {
        info.push({ group: 1, type: 1, info: form_data.special_cases })
      }
      if (form_data.food_allergies) {
        info.push({ group: 2, type: 2, info: form_data.food_allergies })
      }
      if (form_data.drug_allergies) {
        info.push({ group: 2, type: 3, info: form_data.drug_allergies })
      }
      if (form_data.chronic_illnesses) {
        info.push({ group: 3, type: 4, info: form_data.chronic_illnesses })
      }
      if (!info.length) {
        setStep(5)
        return
      }
      const result = await updateStudentMedicalInfo(student.id, info, form_data)
      if (!result) return
      setStep(5)
    })
  }
  async function onSaveStep5() {
    if (!grant_access_id) {
      callMessage('Chưa chọn Người giám hộ nhận Tài khoản hệ thống', 'warning')
      return
    }
    const result = await grantAccessContact(student.id, grant_access_id)
    if (!result) return
    navigate(nav_links.students.route)
  }
  return <ContentCover>
    <Flex style={{ paddingBottom: 20 }} justify="space-between">
      <GTitle level={3}>Tạo hồ sơ học sinh</GTitle>
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
          <Button loading={loading} icon={<DoubleArrowOutlined />} iconPosition="end" onClick={() => { form_step3?.resetFields(); setStep(4) }}>Bỏ qua</Button>
          <Button loading={loading} type='primary' icon={<ArrowRightOutlined />} iconPosition="end" onClick={() => onSaveStep3()}>Lưu & Tiếp tục</Button>
        </Flex> : null
      }
      {step == 4 ?
        <Flex gap={12}>
          <Button loading={loading} type='text' icon={<ArrowLeftOutlined />} onClick={() => setStep(3)}>Quay lại</Button>
          <Button loading={loading} icon={<DoubleArrowOutlined />} iconPosition="end" onClick={() => { form_step4?.resetFields(); setStep(5) }}>Bỏ qua</Button>
          <Button loading={loading} type='primary' icon={<ArrowRightOutlined />} iconPosition="end" onClick={() => onSaveStep4()}>Lưu & Tiếp tục</Button>
        </Flex> : null
      }
      {step == 5 ?
        <Flex gap={12}>
          <Button loading={loading} type='text' icon={<ArrowLeftOutlined />} onClick={() => setStep(4)}>Quay lại</Button>
          <Button loading={loading} icon={<DoubleArrowOutlined />} iconPosition="end" onClick={() => navigate(nav_links.students.route)}>Bỏ qua</Button>
          <Button loading={loading} type='primary' icon={<CheckOutlined />} onClick={() => onSaveStep5()}>Lưu & Hoàn tất</Button>
        </Flex> : null
      }
    </Flex>
    <Card>
      <Flex>
        <Col flex='none' style={{ margin: "16px 24px 16px 0", maxWidth: 227, borderRight: 1 }}>
          <Steps className='responsive'
            direction="vertical"
            current={step - 1}
            items={[
              {
                title: 'Thông tin Cá nhân',
                description: "Nhập thông tin định danh",
              },
              {
                title: 'Thông tin Liên hệ',
                description: 'Nhập thông tin liên lạc của Cha, Mẹ & Người giám hộ',
              },
              {
                title: 'Thông tin Học vụ & Chính sách',
                description: 'Nhập thông tin khối lớp và các chế độ được hưởng',
              },
              {
                title: 'Thông tin Sức khoẻ',
                description: 'Nhập thông tin sức khỏe cơ bản',
              },
              {
                title: 'Tài khoản Hệ thống & Phân quyền',
                description: 'Tạo tài khoản Gedu & gán vai trò',
              },
            ]}
          />
        </Col>
        <Divider type="vertical" style={{ height: 'auto', margin: 0 }} />
        {step == 1 && <StudentNewStep1 />}
        {step == 2 && <StudentNewStep2 />}
        {step == 3 && <StudentNewStep3 />}
        {step == 4 && <StudentNewStep4 />}
        {step == 5 && <StudentNewStep5 />}
      </Flex>
    </Card>
  </ContentCover>
}