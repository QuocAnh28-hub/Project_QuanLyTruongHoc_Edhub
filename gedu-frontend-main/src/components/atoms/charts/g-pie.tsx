import { Pie } from "@ant-design/charts";
import { useMemo } from "react";

interface PieChartModel {
  label: string,
  value: number,
  color?: string,
  percent?: number,
}
interface Props {
  data?: PieChartModel[],
  custom_color?: boolean
}
export default function GPieChart({ data, custom_color = false }: Props) {
  const chart_data = useMemo(() => {
    if (!data) return [] as PieChartModel[]
    const _chart_data = [] as PieChartModel[]
    const _total = data.reduce((_v, _d) => _d.value + _v, 0)
    data.map(d => {
      const percent = Number((d.value * 100 / _total).toFixed(1))
      _chart_data.push({
        label: d.label, value: d.value,
        percent, color: d.color
      })
    })
    return _chart_data
  }, [data])
  const config = {
    data: chart_data,
    angleField: 'percent',
    colorField: 'color',
    'scale': {
      'color': {
        'type': custom_color ? 'identity' : undefined,
      }
    },
    label: {
      text: ({ percent }: any) => { return `${percent}%` },
      style: {
        fontWeight: 'bold',
      },
    },
    legend: false,
  };
  if (!chart_data) return null
  return <Pie {...config} />
}