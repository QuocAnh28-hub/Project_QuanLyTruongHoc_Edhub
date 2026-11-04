import { message } from "antd";
import { BreadcrumbItemType } from "antd/lib/breadcrumb/Breadcrumb";
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { StudentGradeModel } from "../models/enums";
import { PAGE_TITLE_PREFIX } from "../utils/constants";
import { GetGradeLevels } from "../utils/locale-helpers";
import { useAppContext } from "./AppContext";

type MessageType = 'success' | 'error' | 'info' | 'warning' | 'loading'
const context = createContext({
  breadcrumb: [] as BreadcrumbItemType[] | undefined,
  grade_levels: [] as StudentGradeModel[],
  setPageInfo: (_breadcrumb?: BreadcrumbItemType[], _title?: string) => { },
  callMessage: (_message: string, _type: MessageType = 'info', _onClose?: VoidFunction) => { }
})

interface Props {
  children: ReactNode
}
export default function SchoolLayoutProvider({ children }: Props) {
  const { account } = useAppContext()
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItemType[] | undefined>(undefined)
  const [messageApi, contextHolder] = message.useMessage();
  function setPageInfo(breadcrumb?: BreadcrumbItemType[], title?: string) {
    setBreadcrumb(breadcrumb)
    document.title = title ? PAGE_TITLE_PREFIX + ' ~ ' + title : PAGE_TITLE_PREFIX;
  }
  const grade_levels = useMemo(() => {
    let grade_levels = [] as StudentGradeModel[]
    if (account) {
      grade_levels = GetGradeLevels(account?.additional.can_preschool, account?.additional.can_primary_school, account?.additional.can_lower_secondary_school, account?.additional.can_upper_secondary_school)
    }
    return grade_levels
  }, [account])
  const callMessage = useCallback((_message: string, _type: MessageType = 'info', _onClose?: VoidFunction) => {
    switch (_type) {
      case 'success':
        messageApi.success(_message, undefined, _onClose)
        break;
      case 'error':
        messageApi.error(_message, undefined, _onClose)
        break;
      case 'warning':
        messageApi.warning(_message, undefined, _onClose)
        break;
      case 'loading':
        messageApi.loading(_message, undefined, _onClose)
        break;

      default:
      case 'info':
        messageApi.info(_message, undefined, _onClose)
        break;
    }
  }, [messageApi])
  const contextValue = useMemo(() => ({
    breadcrumb, setPageInfo, callMessage, grade_levels
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [breadcrumb, callMessage])
  return <context.Provider value={contextValue}>
    {contextHolder}
    {children}
  </context.Provider>
}

const useLayoutContext = () => {
  const _context = useContext(context)
  return _context
}

// eslint-disable-next-line react-refresh/only-export-components
export { useLayoutContext };
