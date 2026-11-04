import { Button, Card, Flex, Typography } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RouterBlockerProvider, { useRouterBlockerContext } from "../../../../contexts/RouterBlockerContext";
import SchoolYearNewProvider, { useSchoolYearCreateContext } from "../../../../contexts/school-only/school-years/SchoolYearNewContext";
import { useLayoutContext } from "../../../../contexts/SchoolLayoutContext";
import { nav_links } from "../../../../utils/routes";
import ContentCover from "../../../atoms/content-cover";
import { ArrowRightOutlined } from "../../../atoms/svg/outlined-icons";
import SchoolYearNewStep1 from "./school-year-new/school-year-new-step1";

const { Title } = Typography
export default function SchoolYearNew() {
  const { setPageInfo } = useLayoutContext()
  useEffect(() => {
    setPageInfo([
      { path: nav_links.school_dashboard.route, title: nav_links.school_dashboard.title },
      { path: nav_links.school_years.route, title: nav_links.school_years.title },
      { title: nav_links.school_year_new.title },
    ], nav_links.school_year_new.title)
    return () => { setPageInfo() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <SchoolYearNewProvider>
    <RouterBlockerProvider><Content /></RouterBlockerProvider>
  </SchoolYearNewProvider>
}
function Content() {
  const { callMessage } = useLayoutContext()
  const navigate = useNavigate()
  const { callUnblock } = useRouterBlockerContext()
  const { school_year, form, createSchoolYear, loading } = useSchoolYearCreateContext()

  // SAVE STEP 1
  async function onSave() {
    form?.validateFields().catch(() => { return }).finally(async () => {
      const is_err = form.getFieldsError().some((err) => { return err.errors.length ? true : false })
      if (is_err) {
        callMessage('Chưa điền hết thông tin bắt buộc', 'warning')
        return
      }
      const __school_year = form.getFieldsValue()
      __school_year.id = school_year.id
      const res = await createSchoolYear(__school_year)
      if (!res) return
      callUnblock(() => navigate(nav_links.school_years.route))
    })
  }
  return <ContentCover>
    <Flex style={{ paddingBottom: 20 }} justify="space-between">
      <Title level={3} style={{ margin: 0 }}>Tạo Năm học</Title>
      <Flex gap={12}>
        <Button loading={loading} type='primary'
          icon={<ArrowRightOutlined />} iconPosition="end"
          onClick={() => onSave()}
        >Lưu & Tiếp tục</Button>
      </Flex>
    </Flex>
    <Card>
      <SchoolYearNewStep1 />
    </Card>
  </ContentCover>
}