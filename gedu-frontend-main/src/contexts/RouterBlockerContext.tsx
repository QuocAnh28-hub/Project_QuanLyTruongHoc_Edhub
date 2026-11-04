/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Flex, Modal, Typography } from "antd";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useBlocker, useNavigate } from "react-router-dom";

const { Text } = Typography
const context = createContext({
  block: false,
  setBlock: (_block: boolean) => { },
  callUnblock: (_callback: Function) => { },
  callForceNavigate: (_to: string) => { },
})

interface Props {
  message?: string
  children?: ReactNode
}
export default function RouterBlockerProvider({
  message = 'Một số thông tin thay đổi chưa được lưu. Thoát khỏi trang?',
  children
}: Props) {
  const navigate = useNavigate()
  const [block, setBlock] = useState<boolean>(false)
  const blocker = useBlocker(block);
  const [callback, setCallback] = useState<Function | null>(null)
  useEffect(() => {
    const handleBeforeUnload = (event: any) => {
      if (block) {
        event.returnValue = message;  // For most browsers
        return message;  // For some older versions
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [block]);
  useEffect(() => {
    if (!block && callback) {
      blocker.proceed?.()
      callback()
    }
  }, [block, callback])
  function callUnblock(_callback: Function) {
    setCallback(() => _callback)
    setBlock(false)
  }
  function callForceNavigate(to: string) {
    const _callback = () => navigate(to)
    setCallback(() => _callback)
    setBlock(false)
  }
  return <context.Provider value={{ block, setBlock, callUnblock, callForceNavigate }}>
    {children}
    <Modal
      open={blocker.state == 'blocked'}
      maskClosable={false}
      title='Thông tin chưa lưu'
      okText='Thoát'
      onOk={() => {
        blocker.proceed?.()
      }}
      cancelText="Không"
      onCancel={() => {
        blocker.reset?.();
      }}
      footer={(_, { CancelBtn, OkBtn }) => (
        <>
          <CancelBtn />
          <OkBtn />
        </>
      )}
    >
      <Flex vertical gap={12}>
        <Text>{message}</Text>
      </Flex>
    </Modal>
  </context.Provider>
}

const useRouterBlockerContext = () => {
  const _context = useContext(context)
  return _context
}

// eslint-disable-next-line react-refresh/only-export-components
export { useRouterBlockerContext };
