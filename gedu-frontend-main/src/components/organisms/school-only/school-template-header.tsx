import { Avatar, Button, Col, Dropdown, Flex, Layout, MenuProps, Row, Typography } from "antd";
import { useState } from "react";
import { useAppContext } from "../../../contexts/AppContext";
import { PAGE_HEADER_ZINDEX, PAGE_MAX_WIDTH } from "../../../utils/constants";
import { ToAvatarLetters, ToFullNameByLocale } from "../../../utils/locale-helpers";
import { BellOutlined, DownOutlined, LogoutOutlined, SettingOutlined, UserOutlined } from "../../atoms/svg/outlined-icons";
import SchoolUserInfo from "./school-user-info";
export default function SchoolTemplateHeader() {
  const { account, logout } = useAppContext()
  const [open, setOpen] = useState<boolean>(false)

  return (
    <Layout.Header className="border-bottom" style={{
      position: 'fixed', width: '100%',
      maxWidth: PAGE_MAX_WIDTH, zIndex: PAGE_HEADER_ZINDEX,
      padding: '0 24px'
    }}>
      <Flex justify="space-between" style={{ height: '100%' }}>
        <Flex align="center" justify="middle">
          <img
            src="/logo.svg"
            alt="Gedu"
            style={{ display: 'block', maxHeight: 32 }}
          />
        </Flex>
        <Flex gap={16} align="center">
          <Flex>
            <Button icon={<BellOutlined size={16} />} type="text" />
            <Button icon={<SettingOutlined size={16} />} type="text" />
          </Flex>
          <Flex gap={12} align="center">
            <Avatar size='large'>{ToAvatarLetters(account?.first_name, account?.last_name)}</Avatar>
            <Flex vertical>
              <Popup account={account} logout={logout} openAccount={() => setOpen(true)} />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      {open && <SchoolUserInfo close={() => setOpen(false)} />}
    </Layout.Header>
  );
}
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function Popup({ account, logout, openAccount }: { account: any, logout: Function, openAccount: Function }) {
  const items: MenuProps['items'] = [
    {
      key: 'account',
      label: 'Tài khoản',
      icon: <UserOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Đăng xuất',
      danger: true,
      icon: <LogoutOutlined />,
    },
  ];
  return <Dropdown placement="bottomRight"
    menu={{
      items, onClick: (e: any) => {
        if (e.key === 'logout') logout()
        if (e.key === 'account') openAccount()
      }
    }}>
    <Col style={{ cursor: 'pointer' }}>
      <Row>
        <Typography.Text strong style={{ textTransform: 'capitalize', margin: 0, marginRight: 4 }}>
          {ToFullNameByLocale(account?.first_name, account?.last_name)}
        </Typography.Text>
        <DownOutlined />
      </Row>
      <Row>
        <Typography.Text style={{ margin: 0 }}>{account?.position_title}</Typography.Text>
      </Row>
    </Col>
  </Dropdown>
}