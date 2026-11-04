import { Navigate, Outlet } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { nav_links } from "../utils/routes";

export default function ProtectedRoute() {
  const { token, account } = useAppContext();
  if (!account) return
  if (!token) {
    return <Navigate to={nav_links.login.route} />;
  }
  return <Outlet />
};
export function RolesRequired() {
  // if (!account.roles)
  //   return <Navigate to="/unauthorized" />;
  // if (required_roles.some(role => /(^|,){role}(,|$)/.test(account?.roles || ''))) {
  //   return <Outlet/>
  // }
  // return <Navigate to="/unauthorized" />;
}