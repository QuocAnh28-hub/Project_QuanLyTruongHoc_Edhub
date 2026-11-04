import { Column } from "@ant-design/charts";
import { ToFormatedNumber } from "../../../utils/locale-helpers";

interface ColumnChartModel {
  label: string,
  value: number,
}
interface Props {
  data?: ColumnChartModel[],
  custom_color?: boolean
}
export default function GColumnChart({ data }: Props) {
  const config = {
    data,
    xField: 'label',
    yField: 'value',
    label: {
      text: (d: ColumnChartModel) => { return ToFormatedNumber(Number(d.value.toFixed(0))) },
      textBaseline: 'bottom',
    },
    style: {
      maxWidth: 32
    },
  };
  if (!data) return null
  return <Column {...config} />
}