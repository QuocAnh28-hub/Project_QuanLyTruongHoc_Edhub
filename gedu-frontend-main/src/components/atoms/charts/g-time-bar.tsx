import { Bar } from "@ant-design/charts";

interface TimeBarChartModel {
  label: string,
  start: number,
  end: number,
}
interface Props {
  data?: TimeBarChartModel[],
  custom_color?: string[]
}
export default function GTimeBarChart({ data, custom_color }: Props) {
  const config = {
    data,
    heigth: 302,
    xField: 'label',
    yField: ['start', 'end'],
    colorField: 'label',
    'scale': {
      'color': {
        range: custom_color || undefined
      }
    },
    label: {
      text: ((d: TimeBarChartModel) => (d.end - d.start) + '%'),
      formater: '.0%',
      style: {
        textAlign: 'start',
        dx: 4,
      }
    },
    style: {
      maxWidth: 45,
    },
    legend: false,
    tooltip: {
      items: [{ channel: 'y0', valueFormatter: '.0%' }]
    },
  };
  if (!data) return null
  return <Bar {...config} />
}