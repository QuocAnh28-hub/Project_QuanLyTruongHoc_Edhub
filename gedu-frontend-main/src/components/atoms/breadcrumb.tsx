import { Breadcrumb } from "antd";
import { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";
import { Link } from "react-router-dom";

interface Props {
  items: BreadcrumbItemType[]
}
export default function Breadcrumbs({ items }: Props) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  function itemRender(currentRoute) {
    return currentRoute.path ? (
      <Link to={currentRoute.path}>{currentRoute.title}</Link>
    ) : (
      <span>{currentRoute.title}</span>
    );
  }
  return <Breadcrumb
    items={items}
    itemRender={itemRender}
  />
}