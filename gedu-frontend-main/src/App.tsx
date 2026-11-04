import { ConfigProvider, Flex, Spin } from 'antd'
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from 'react-router-dom'
import { Fragment } from 'react/jsx-runtime'
import Page404 from './components/pages/un-auth/404'
import ForgotPassword from './components/pages/un-auth/forget-password'
import LoginPage from './components/pages/un-auth/login-page'
import ProtectedRoute from './components/protected-route'
import EDTemplate from './components/templates/ed-template'
import SchoolTemplate from './components/templates/school-template'
import UnAuthTemplate from './components/templates/un-auth-template'
import { useAppContext } from './contexts/AppContext'
import { reactDomEDRoutes } from './models/react-dom-ed-routes'
import { reactDomSchoolRoutes } from './models/react-dom-school-routes'
import { STARTED_SCHOOL_ORG_ID } from './utils/constants'
import { nav_links } from './utils/routes'

export default function App() {
  const { app_ready, token, account } = useAppContext()
  if (!app_ready)
    return <Flex vertical justify='center' style={{ height: '100vh' }}><Spin /></Flex>
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {(!token || !account) ?
          <Route path='/' element={<UnAuthTemplate />}>
            <Route path={nav_links.home.route} element={<LoginPage />} />
            <Route path={nav_links.login.route} element={<LoginPage />} />
            <Route path={nav_links.forgot_password.route} element={<ForgotPassword />} />
            <Route path='*'
              element={
                <Navigate
                  to={nav_links.login.route + `?from=${encodeURIComponent(location.pathname + location.search)}`}
                  replace
                />}
            />
          </Route> : <Fragment>
            <Route path={nav_links.login.route} element={<Navigate to={nav_links.home.route} replace />} />
            <Route path={nav_links.forgot_password.route} element={<Navigate to={nav_links.home.route} replace />} />
          </Fragment>
        }
        <Route element={<ProtectedRoute />}>
          {account?.org_id == 1 &&
            <Route path={nav_links.home.route} element={<EDTemplate />}>
              {reactDomEDRoutes.map(route =>
                <Route key={route.path} path={route.path} element={route.element}>
                  {route.children?.map(child =>
                    <Route key={child.path} path={child.path} element={child.element} />
                  )}
                </Route>
              )}
            </Route>
          }
          {Number(account?.org_id) >= STARTED_SCHOOL_ORG_ID &&
            <Route path={nav_links.home.route} element={<SchoolTemplate />}>
              {reactDomSchoolRoutes.map(route =>
                <Route key={route.path} path={route.path} element={route.element}>
                  {route.children?.map(child =>
                    <Route key={child.path} path={child.path} element={child.element} />
                  )}
                </Route>
              )}
            </Route>}
          <Route path='*' Component={Page404} />
        </Route>
      </>
    ))
  return <ConfigProvider form={{ validateMessages: { required: "Chưa nhập thông tin", whitespace: 'Chưa nhập thông tin' } }}><RouterProvider router={router} /></ConfigProvider>
}
