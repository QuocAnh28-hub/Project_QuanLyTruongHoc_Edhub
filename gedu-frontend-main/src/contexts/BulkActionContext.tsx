/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { createContext, ReactNode, useContext, useMemo, useState } from "react";

const context = createContext({
  ___testing: true,
  records: undefined as any[] | null | undefined,
  setRecords: (_records: any[]) => { },
  on_bulk: false
})

interface Props {
  children?: ReactNode
}
export default function BulkActionProvider({ children }: Props) {
  const [records, setRecords] = useState<any[] | null | undefined>(undefined)
  const on_bulk = useMemo(() => {
    return records?.length ? true : false
  }, [records])

  return <context.Provider value={{
    ___testing: false,
    records, setRecords,
    on_bulk
  }}>
    {children}
  </context.Provider>
}

const useBulkActionContext = () => {
  const _context = useContext(context)
  if (_context.___testing)
    console.log('Testing mode is on, useBulkActionContext wad used outside of BulkActionProvider');
  return _context
}

// eslint-disable-next-line react-refresh/only-export-components
export { useBulkActionContext };
