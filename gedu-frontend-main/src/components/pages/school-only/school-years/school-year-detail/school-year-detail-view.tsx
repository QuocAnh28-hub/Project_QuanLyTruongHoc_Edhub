import { Button, Flex, Row, Space } from "antd";
import { useMemo } from "react";
import { Fragment } from "react/jsx-runtime";
import { useAppContext } from "../../../../../contexts/AppContext";
import { useSchoolYearDetailContext } from "../../../../../contexts/school-only/school-years/SchoolYearDetailContext";
import { ToFormatedDate } from "../../../../../utils/locale-helpers";
import GText from "../../../../atoms/g-text";
import NoDataText from "../../../../atoms/no-data-text";
import { FormOutlined } from "../../../../atoms/svg/outlined-icons";
import TitleSegmentRow from "../../../../atoms/title-segment-row";

export default function SchoolYearDetailView() {
  const { authority } = useAppContext()
  const { school_year, switchUpdateMode } = useSchoolYearDetailContext()
  const { semesters, examinations } = useMemo(() => {
    const semesters = [] as any[]
    const examinations = [] as any[]
    school_year?.semesters?.map(sem => {
      semesters.push({ id: sem.id, title: sem.title, fromDate: sem.fromDate, toDate: sem.toDate })
      sem.examinations?.map((exam => {
        examinations.push({
          id: exam.id, title: exam.title, fromDate: exam.fromDate, toDate: exam.toDate,
          semesterId: sem.id, semesterTitle: sem.title
        })
      }))
    })
    return { semesters, examinations }
  }, [school_year])
  if (!school_year) return null
  return <Fragment>
    {authority?.can_touch_schoolyear && <Row justify='end'>
      <Button icon={<FormOutlined />} onClick={() => switchUpdateMode(true)}>Cập nhật</Button>
    </Row>}
    <Flex vertical gap={32}>
      {/* Thông tin chung */}
      <TitleSegmentRow title='Thông tin chung'>
        <Space direction="vertical" size={12}>
          <TitleSegmentRow type="secondary" title='Năm học'>
            <GText strong>{school_year.title}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Khung thời gian năm học'>
            <GText>{ToFormatedDate(school_year.fromDate)}&nbsp;→&nbsp;{ToFormatedDate(school_year.toDate)}</GText>
          </TitleSegmentRow>
        </Space>
      </TitleSegmentRow>
      {/* Học kỳ trong năm */}
      <TitleSegmentRow title='Học kỳ trong năm'>
        <Flex vertical gap={24}>
          {!semesters?.length && <NoDataText />}
          {semesters?.map((sem) => {
            return <Space key={sem.id} direction="vertical" size={12}>
              <TitleSegmentRow type="secondary" title='Tên học kỳ'>
                <GText strong>{sem.title}</GText>
              </TitleSegmentRow>
              <TitleSegmentRow type="secondary" title='Thời gian Diễn ra'>
                <GText>{ToFormatedDate(sem.fromDate)}&nbsp;→&nbsp;{ToFormatedDate(sem.toDate)}</GText>
              </TitleSegmentRow>
            </Space>
          })}
        </Flex>
      </TitleSegmentRow>
      {/* Kỳ thi trong năm */}
      <TitleSegmentRow title='Kỳ thi trong năm'>
        <Flex vertical gap={24}>
          {!examinations?.length && <NoDataText />}
          {examinations?.map((exam) => {
            return <Space key={exam.id} direction="vertical" size={12}>
              <TitleSegmentRow type="secondary" title='Tên kỳ thi'>
                <GText strong>{exam.title}</GText>
              </TitleSegmentRow>
              <TitleSegmentRow type="secondary" title='Thuộc học kỳ'>
                {exam.semesterTitle}
              </TitleSegmentRow>
              <TitleSegmentRow type="secondary" title='Thời gian Diễn ra'>
                <GText>{ToFormatedDate(exam.fromDate)}&nbsp;→&nbsp;{ToFormatedDate(exam.toDate)}</GText>
              </TitleSegmentRow>
            </Space>
          })}
        </Flex>
      </TitleSegmentRow>
    </Flex>
  </Fragment>
}