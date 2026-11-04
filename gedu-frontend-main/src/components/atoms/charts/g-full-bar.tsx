import { Bar } from "@ant-design/charts";
import { ToFormatedNumber } from "../../../utils/locale-helpers";

interface FullBarChartModel {
  group: string,
  label: string,
  value: number,
}
interface Props {
  data?: FullBarChartModel[],
  custom_color?: string[]
}
export default function GFullBarChart({ data, custom_color }: Props) {
  const config = {
    data,
    xField: 'group',
    yField: 'value',
    colorField: 'label',
    'scale': {
      'color': {
        range: custom_color || undefined
      }
    },
    label: {
      text: (d: FullBarChartModel) => { return d.value ? ToFormatedNumber(Number(d.value.toFixed(0))) : '' },
      style: {
        textAlign: 'right',
        dx: -4,
        fill: '#FFFFFF'
      }
    },
    style: {
      maxWidth: 35,
    },
    stack: true,
    percent: true,
    sort: {
      reverse: true,
      by: 'y',
    },
    axis: {
      y: { labelFormatter: '.0%' },
      x: {
        labelSpacing: 8,
      },
    },
    legend: false,
    tooltip: { items: [{ channel: 'y0', valueFormatter: '.0%' }] },
  };
  if (!data) return null
  return <Bar {...config} />
}