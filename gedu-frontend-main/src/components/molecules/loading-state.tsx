import { Flex, Spin } from "antd";
import { ReactNode } from "react";

export default function LoadingState({ content = null }: { content?: ReactNode }) {
  return <div style={{ position: 'relative', height: '50%', width: '100%', alignContent: 'center' }}>
    <Flex gap="middle" vertical>
      <Spin tip="Loading" size="large">
        {content}
      </Spin>
    </Flex>
  </div>
}