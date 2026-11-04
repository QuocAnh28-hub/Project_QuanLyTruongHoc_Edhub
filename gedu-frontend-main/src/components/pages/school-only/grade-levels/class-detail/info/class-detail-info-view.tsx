import { Button, Flex, Row, Space } from "antd";
import { useMemo } from "react";
import { Fragment } from "react/jsx-runtime";
import { useAppContext } from "../../../../../../contexts/AppContext";
import { useClassDetailContext } from "../../../../../../contexts/school-only/classes/ClassDetailContext";
import { EstimatedLessonsPerWeekEnum, SchoolDailyScheduleEnum } from "../../../../../../models/enums";
import { studentGradeStatus } from "../../../../../../models/student-model";
import { ToFormatedNumber, ToFullNameByLocale } from "../../../../../../utils/locale-helpers";
import CopyButton from "../../../../../atoms/copy-button";
import GText from "../../../../../atoms/g-text";
import { CheckCircleOutlined, CloseCircleOutlined, FormOutlined, UserAddOutlined } from "../../../../../atoms/svg/outlined-icons";
import TitleSegmentRow from "../../../../../atoms/title-segment-row";

export default function ClassDetailInfoView() {
  const { authority } = useAppContext()
  const { data, switchUpdateMode } = useClassDetailContext()
  const { daily_schedule_string, estimated_lessons_per_week } = useMemo(() => {
    let daily_schedule_string = ''
    switch (Number(data?.dailyScheduleType)) {
      case SchoolDailyScheduleEnum.OnePerDay.enum:
        daily_schedule_string = SchoolDailyScheduleEnum.OnePerDay.title
        break;
      case SchoolDailyScheduleEnum.TwicePerDay.enum:
        daily_schedule_string = SchoolDailyScheduleEnum.TwicePerDay.title
        break;
      case SchoolDailyScheduleEnum.DayBoarding.enum:
        daily_schedule_string = SchoolDailyScheduleEnum.DayBoarding.title
        break;
      case SchoolDailyScheduleEnum.Boarding.enum:
        daily_schedule_string = SchoolDailyScheduleEnum.Boarding.title
        break;
      default:
        break;
    }

    let estimated_lessons_per_week = ''
    switch (Number(data?.dailyScheduleType)) {
      case SchoolDailyScheduleEnum.OnePerDay.enum:
        estimated_lessons_per_week = EstimatedLessonsPerWeekEnum.FivePerWeek.title
        break;
      case SchoolDailyScheduleEnum.TwicePerDay.enum:
        estimated_lessons_per_week = EstimatedLessonsPerWeekEnum.SixPerWeek.title
        break;
      case SchoolDailyScheduleEnum.DayBoarding.enum:
        estimated_lessons_per_week = EstimatedLessonsPerWeekEnum.SixToEightPerWeek.title
        break;
      case SchoolDailyScheduleEnum.Boarding.enum:
        estimated_lessons_per_week = EstimatedLessonsPerWeekEnum.NineToTenPerWeek.title
        break;
      default:
        break;
    }

    return { daily_schedule_string, estimated_lessons_per_week }
  }, [data])

  if (!data) return null

  return <Fragment>
    {authority?.can_touch_grade &&
      <Row justify='end'>
        <Button icon={<FormOutlined />} onClick={() => switchUpdateMode(true)}>Chỉnh sửa</Button>
      </Row>
    }
    <Flex vertical gap={32}>
      {/* Thông tin chung */}
      <TitleSegmentRow title='Thông tin chung'>
        <Space direction="vertical" size={16}>
          <TitleSegmentRow type="secondary" title='Mã lớp học'>
            <Flex gap={16} align="center">
              <GText>{data.code}</GText>
              <CopyButton text={data.code} />
            </Flex>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Tên lớp học'>
            <GText>{data.name}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Khối lớp'>
            <GText>{data.gradeLevel ? studentGradeStatus.find(s => s.value == data.gradeLevel)?.text : ''}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Giáo viên chủ nhiệm'>
            {data?.homeroomTeacher ?
              <GText>
                {ToFullNameByLocale(data?.homeroomTeacher?.firstName, data?.homeroomTeacher?.lastName)}
              </GText> :
              authority?.can_touch_grade ?
                <Button color="primary" variant="outlined" size="small" icon={<UserAddOutlined />}>Gán Giáo viên chủ nhiệm</Button> :
                <GText />
            }
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Sĩ số thực tế'>
            <GText>{ToFormatedNumber(data.classSize)}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Sĩ số tối đa'>
            <GText>{ToFormatedNumber(data.maxClassSize)}</GText>
          </TitleSegmentRow>
        </Space>
      </TitleSegmentRow>
      {/* Chương trình & Giảng dạy */}
      <TitleSegmentRow title='Chương trình & Giảng dạy'>
        <Space direction="vertical" size={16}>
          <TitleSegmentRow type="secondary" title='Chương trình học'>
            <GText>{data.curriculumName}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Ngoại ngữ 1'>
            <GText>{data.firstForeignLanguageName}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Ngoại ngữ 2'>
            <GText>{data.secondForeignLanguageName}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Thời lượng học tập'>
            <Flex vertical gap={8}>
              <GText>{daily_schedule_string}</GText>
              <GText>{estimated_lessons_per_week}</GText>
            </Flex>
          </TitleSegmentRow>
        </Space>
      </TitleSegmentRow>
      {/* Đặc điểm của lớp */}
      <TitleSegmentRow title='Đặc điểm của lớp'>
        <Space direction="vertical" size={16}>
          <TitleSegmentRow type="secondary" title='Là lớp bán trú'>
            {data.isDayBoarding ? <Flex gap={4} align="center">
              <CheckCircleOutlined size={20} fill='var(--success)' />
              <GText>Có</GText>
            </Flex> : <Flex gap={4} align="center">
              <CloseCircleOutlined size={20} fill='var(--error)' />
              <GText>Không</GText>
            </Flex>}
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Là lớp ghép'>
            {data.isMultiGrade ? <Flex gap={4} align="center">
              <CheckCircleOutlined size={20} fill='var(--success)' />
              <GText>Có</GText>
            </Flex> : <Flex gap={4} align="center">
              <CloseCircleOutlined size={20} fill='var(--error)' />
              <GText>Không</GText>
            </Flex>}
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Học sinh khuyết tật'>
            {data.hasStudentsWithDisabilities ?
              <Flex gap={4} align="center">
                <CheckCircleOutlined size={20} fill='var(--success)' />
                <GText>Có</GText>
              </Flex> :
              <Flex gap={4} align="center">
                <CloseCircleOutlined size={20} fill='var(--error)' />
                <GText>Không</GText>
              </Flex>
            }
          </TitleSegmentRow>
          {/* <TitleSegmentRow type="secondary" title='Học sinh học nghề'>
            {<Flex gap={4} align="center">
              <CloseCircleOutlined size={20} fill='var(--error)' />
              <GText>Không</GText>
            </Flex>}
          </TitleSegmentRow> */}
          <TitleSegmentRow type="secondary" title='Có đại diện cha mẹ học sinh tham gia Hội đồng trường'>
            {data.hasParentRepInSchoolBoard ?
              <Flex gap={4} align="center">
                <CheckCircleOutlined size={20} fill='var(--success)' />
                <GText>Có</GText>
              </Flex> :
              <Flex gap={4} align="center">
                <CloseCircleOutlined size={20} fill='var(--error)' />
                <GText>Không</GText>
              </Flex>
            }
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Có đại diện cha mẹ học sinh lớp'>
            {data.hasParentRepInClass ?
              <Flex gap={4} align="center">
                <CheckCircleOutlined size={20} fill='var(--success)' />
                <GText>Có</GText>
              </Flex> :
              <Flex gap={4} align="center">
                <CloseCircleOutlined size={20} fill='var(--error)' />
                <GText>Không</GText>
              </Flex>
            }
          </TitleSegmentRow>
        </Space>
      </TitleSegmentRow>
    </Flex>
  </Fragment>
}