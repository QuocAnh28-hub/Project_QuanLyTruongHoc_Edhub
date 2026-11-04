/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { MenuProps } from 'antd';
import { Button, Flex, Layout, Menu } from "antd";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../contexts/AppContext';
import GetMenuItems from '../../../utils/menu';
import { MenuFoldOutlined, MenuUnfoldOutlined } from "../../atoms/svg/outlined-icons";

export default function SchoolTemplateSider() {
  const { account } = useAppContext()
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [broken, setBroken] = useState(false);
  const menu_list = useMemo(() => { return GetMenuItems(100001, account?.roles) }, [account?.roles])
  const current = useMemo(() => {
    let _current = '/'
    const _split = location.pathname.split('/', 2)
    if (_split?.[1]) _current = '/' + _split[1]
    return _current
  }, [location])

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const onClick: MenuProps['onClick'] = (e) => {
    if (!e || !e.key) return
    if ((/(plan_[0-9]+)$/).test(e?.key))
      navigate('dang-xay-dung')
    else
      navigate(e.key)
  };
  return <Layout.Sider width={280}
    breakpoint='lg' onBreakpoint={(broken) => { setBroken(broken) }}
    collapsible trigger={null} collapsed={broken || collapsed}
    className='border-right'
    style={{ overflow: 'auto', padding: "11px 0" }}>
    {broken ? null :
      <Flex justify={collapsed ? 'center' : 'flex-end'} style={{ marginLeft: 4, marginRight: 4 }}>
        <Button type="text"
          onClick={toggleCollapsed}
          icon={collapsed ? <MenuUnfoldOutlined size={16} /> : <MenuFoldOutlined size={16} />}
          iconPosition="end"
          style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
          {collapsed ? null : 'Thu gọn'}
        </Button>
      </Flex>
    }
    <Menu theme='dark'
      onClick={onClick}
      selectedKeys={[current]}
      style={{ border: 0, paddingBottom: 24 }}
    >
      {menu_list?.map(menu => {
        if (menu?.type == 'group') {
          return <Menu.ItemGroup style={{ marginTop: 16 }}
            title={broken || collapsed ? <ul><Menu.Divider /></ul> : menu.label}
          >
            {menu.children?.length ? menu.children.map(submenu => {
              //@ts-ignore
              return <Menu.Item key={submenu?.key} icon={submenu.icon}>{submenu?.label}</Menu.Item>
            }) : null}
          </Menu.ItemGroup>
        }
        //@ts-ignore
        else return <Menu.Item key={menu?.key} icon={menu?.icon}>{menu?.label}</Menu.Item>
      })}
    </Menu>
  </Layout.Sider>
}
