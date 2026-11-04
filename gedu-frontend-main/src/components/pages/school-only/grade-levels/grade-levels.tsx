import { Card, Flex, Select, Skeleton, Tabs } from "antd";
import { useEffect, useMemo } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import GradeLevelsProvider, { useGradeLevelsContext } from "../../../../contexts/school-only/grade-levels/GradeLevelsContext";
import { useLayoutContext } from "../../../../contexts/SchoolLayoutContext";
import { nav_links } from "../../../../utils/routes";
import ContentCover from "../../../atoms/content-cover";
import GTitle from "../../../atoms/g-title";
import NoOpenedSchoolYear from "../../../molecules/no-opened-school-year";

export default function GradeLevels() {
  const { setPageInfo } = useLayoutContext()
  useEffect(() => {
    setPageInfo([
      { path: nav_links.school_dashboard.route, title: nav_links.school_dashboard.title },
      { title: nav_links.grade_levels.title },
    ], nav_links.grade_levels.title)
    return () => { setPageInfo() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <GradeLevelsProvider>
    <Content />
  </GradeLevelsProvider>
}
function Content() {
  const navigate = useNavigate()
  const { school_years, school_year, setSchoolYear, grade_levels, grade, ready } = useGradeLevelsContext()
  const { tab_list, current } = useMemo(() => {
    const _tab_all = {
      id: 0,
      label: 'Tất cả',
      key: nav_links.grade_levels.route
    } as any
    const _tab_list = [_tab_all] as any[]
    grade_levels.map(g => {
      _tab_list.push({
        id: g.enum,
        label: g.title,
        key: nav_links.grade_level_detail.route.replace(':id', g.code || '')
      } as any)
    })
    const _current = _tab_list?.find(t => t.id == grade?.enum) || _tab_all
    return { tab_list: _tab_list, current: _current }
  }, [grade_levels, grade])

  if (!ready) return <Skeleton />
  if (school_year === null)
    return <NoOpenedSchoolYear title="Khối lớp & Lớp học" />

  return <ContentCover size="stretch" gap={20}>
    <GTitle level={3}>Khối lớp & Lớp học</GTitle>
    <Card style={{ flex: 1 }} styles={{ body: { paddingTop: 16 } }}>
      <Flex vertical>
        <Flex>
          <Select options={school_years}
            style={{ minWidth: 195 }}
            defaultValue={school_year}
            fieldNames={{ value: 'id', label: 'title' }}
            onChange={e => setSchoolYear(e)}
            placeholder='Chọn năm học' />
        </Flex>
        <Tabs
          activeKey={current?.key || 0}
          onChange={(_key) => navigate(_key)}
          items={tab_list}
          size='middle' />
        <Outlet />
      </Flex>
    </Card>
  </ContentCover>
}
