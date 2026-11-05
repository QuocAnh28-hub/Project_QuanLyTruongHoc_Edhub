import { message } from "antd";
import { BreadcrumbItemType } from "antd/lib/breadcrumb/Breadcrumb";
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { PAGE_TITLE_PREFIX } from "../utils/constants";

type MessageType = 'success' | 'error' | 'info' | 'warning' | 'loading'
const context = createContext({
  breadcrumb: [] as BreadcrumbItemType[] | undefined,
  setPageInfo: (_breadcrumb?: BreadcrumbItemType[], _title?: string) => { },
  callMessage: (_message: string, _type: MessageType = 'info', _onClose?: VoidFunction) => { }
})
interface Props {
  children: ReactNode
}
export default function EDLayoutProvider({ children }: Props) {
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItemType[] | undefined>(undefined)
  const [messageApi, contextHolder] = message.useMessage();
  const setPageInfo = useCallback((breadcrumb?: BreadcrumbItemType[], title?: string) => {
    setBreadcrumb(breadcrumb)
    document.title = title ? PAGE_TITLE_PREFIX + ' ~ ' + title : PAGE_TITLE_PREFIX;
  }, []);
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
    breadcrumb, setPageInfo, callMessage
  }), [breadcrumb, setPageInfo, callMessage])
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
