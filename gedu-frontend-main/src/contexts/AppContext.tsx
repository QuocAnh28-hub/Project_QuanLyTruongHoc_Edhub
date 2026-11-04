import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
// import { useTranslation } from 'react-i18next';
import { ConfigProvider, Empty } from 'antd';
import { Locale } from 'antd/es/locale';
import viVN from 'antd/locale/vi_VN';
import { callChangePassword } from '../hooks/account-hook';
import { StudentGradeModel } from '../models/enums';
import { callGet, fetching_apis } from '../utils/api-helpers';
import { ScRoles } from '../utils/constants';
import { GetDeptTemplateId, GetGradeLevels } from '../utils/locale-helpers';
import { nav_links } from '../utils/routes';
import { StorageHelper, STORE_KEY_TOKEN } from '../utils/storage-helpers';
import { lightTheme } from '../utils/themes';
import { canTouchRole } from '../utils/utils';

const DEFAULT_LOCALE = viVN
const theme = lightTheme
interface LoggedInAccount {
  org_id: number,
  user_id: number,
  user_name: string,
  first_name?: string,
  last_name?: string,
  phone?: string,
  department_name?: string,
  position_title?: string,
  roles?: string[],
  ref_id?: number,
  additional: {
    province_id: number,
    department_name: string,
    school_year_id?: number,
    school_year_name?: string,
    school_code: string,
    school_name: string,
    can_preschool: boolean,
    can_primary_school: boolean,
    can_lower_secondary_school: boolean,
    can_upper_secondary_school: boolean,
    grade_levels?: StudentGradeModel[],
    template_id: number,
  }
}
interface Authority {
  can_touch_schoolyear: boolean,
  can_touch_grade: boolean,
  can_touch_curriculum: boolean,
  can_touch_student: boolean,
  can_touch_staff: boolean,
  can_touch_department: boolean,
  can_touch_permission: boolean,
}
const context = createContext({
  locale: DEFAULT_LOCALE,
  setLocale: (_value: Locale) => { },
  // theme: 'light' as 'light' | 'dark',
  // switchTheme: () => { },
  app_ready: false as boolean,
  token: null as string | null,
  account: null as LoggedInAccount | null,
  afterLogin: (_value: any, _remember: boolean) => { },
  logout: () => { },
  changePassword: (_current: string, _new: string): any => { },
  authority: null as Authority | null,
});
interface Props {
  children: ReactNode
}

function rolesToArray(roles: string) {
  roles = roles.replace(/ /g, '').toLowerCase() || ''
  return roles.split(',')
}
export default function AppProvider({ children }: Props) {
  const [app_ready, setAppReady] = useState<boolean>(false)
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);
  const [token, setToken] = useState(StorageHelper.get(STORE_KEY_TOKEN, StorageHelper.types.local))
  const [account, setAccount] = useState<LoggedInAccount | null>(null)
  const authority = useMemo(() => {
    if (!account?.roles) return null
    const can_touch_schoolyear = canTouchRole(ScRoles.SCHOOLYEAR_ALL, account?.roles)

    const can_touch_grade = canTouchRole(ScRoles.GRADE_ALL, account?.roles)
    const can_touch_curriculum = canTouchRole(ScRoles.CURRICULUM_ALL, account?.roles)
    const can_touch_student = canTouchRole(ScRoles.STUDENT_ALL, account?.roles)
    const can_touch_staff = canTouchRole(ScRoles.STAFF_ALL, account?.roles)
    const can_touch_department = canTouchRole(ScRoles.DEPARTMENT_ALL, account?.roles)
    const can_touch_permission = canTouchRole(ScRoles.PERMISSION_ALL, account?.roles)
    return {
      can_touch_schoolyear,
      can_touch_grade,
      can_touch_curriculum,
      can_touch_student,
      can_touch_staff,
      can_touch_department,
      can_touch_permission,
    }

  }, [account])
  // const { i18n } = useTranslation();
  // useMemo(() =>
  //   i18n.changeLanguage(locale),
  //   [locale])
  useEffect(() => {
    let token = StorageHelper.get(STORE_KEY_TOKEN, StorageHelper.types.local)
    if (!token) token = StorageHelper.get(STORE_KEY_TOKEN, StorageHelper.types.session)
    if (token) {
      async function load_info() {
        const response = await callGet(fetching_apis.account_info)
        if (response?.response) {
          const account = response.response
          setToken(token)
          const _grade_levels = GetGradeLevels(account.additional.canPreschool, account.additional.canPrimarySchool, account.additional.canLowerSecondarySchool, account.additional.canUpperSecondarySchool)
          const _template_id = GetDeptTemplateId(account.additional.canPreschool, account.additional.canPrimarySchool, account.additional.canLowerSecondarySchool, account.additional.canUpperSecondarySchool)
          setAccount({
            org_id: account.orgId,
            user_id: account.id,
            user_name: account.email,
            first_name: account.firstName,
            last_name: account.lastName,
            phone: account.phone,
            department_name: account.departmentName,
            position_title: account.positionTitle,
            roles: rolesToArray(account.roles),
            ref_id: account.refId,
            additional: {
              province_id: Number(account.additional.provinceId),
              department_name: account.additional.departmentName,
              school_year_id: Number(account.additional.schoolYear) || undefined,
              school_year_name: account.additional.schoolYearName,
              school_code: account.additional.schoolCode,
              school_name: account.additional.schoolName,
              can_preschool: account.additional.canPreschool,
              can_primary_school: account.additional.canPrimarySchool,
              can_lower_secondary_school: account.additional.canLowerSecondarySchool,
              can_upper_secondary_school: account.additional.canUpperSecondarySchool,
              grade_levels: _grade_levels,
              template_id: _template_id,
            }
          })
        }
        setAppReady(true)
      }
      load_info()
    }
    else
      setAppReady(true)
  }, [])
  function afterLogin(data: any, remember: boolean) {
    if (!data?.access_token) return
    StorageHelper.clear(STORE_KEY_TOKEN, StorageHelper.types.local)
    const where = remember ? StorageHelper.types.local : StorageHelper.types.session
    StorageHelper.set(STORE_KEY_TOKEN, data.access_token, where)
    setToken(data.access_token)
    const account = data.user
    const _grade_levels = GetGradeLevels(account.additional.canPreschool, account.additional.canPrimarySchool, account.additional.canLowerSecondarySchool, account.additional.canUpperSecondarySchool)
    const _template_id = GetDeptTemplateId(account.additional.canPreschool, account.additional.canPrimarySchool, account.additional.canLowerSecondarySchool, account.additional.canUpperSecondarySchool)
    setAccount({
      org_id: account.orgId,
      user_id: account.id,
      user_name: account.email,
      first_name: account.firstName,
      last_name: account.lastName,
      phone: account.phone,
      department_name: account.departmentName,
      position_title: account.positionTitle,
      roles: rolesToArray(account.roles),
      ref_id: account.refId,
      additional: {
        province_id: Number(account.additional.provinceId),
        department_name: account.additional.departmentName,
        school_year_id: Number(account.additional.schoolYear) || undefined,
        school_year_name: account.additional.schoolYearName,
        school_code: account.additional.schoolCode,
        school_name: account.additional.schoolName,
        can_preschool: account.additional.canPreschool,
        can_primary_school: account.additional.canPrimarySchool,
        can_lower_secondary_school: account.additional.canLowerSecondarySchool,
        can_upper_secondary_school: account.additional.canUpperSecondarySchool,
        grade_levels: _grade_levels,
        template_id: _template_id,
      }
    })
  }
  function logout() {
    StorageHelper.clear(STORE_KEY_TOKEN, StorageHelper.types.local)
    StorageHelper.clear(STORE_KEY_TOKEN, StorageHelper.types.session)
    window.location.replace(nav_links.login.route);
  }
  async function changePassword(_current: string, _new: string) {
    return await callChangePassword(_current, _new) as any
  }

  const contextValue = useMemo(
    () => ({
      locale, setLocale, app_ready,
      token, account, afterLogin,
      logout, changePassword,
      authority
    }),
    [locale, app_ready, token, account, authority]
  );
  return <context.Provider value={contextValue}>
    <ConfigProvider
      locale={locale} theme={theme}
      renderEmpty={() => <Empty description="Không có thông tin" />}
    >
      {children}
    </ConfigProvider>
  </context.Provider>
}

const useAppContext = () => {
  const _context = useContext(context)
  return _context
};
// eslint-disable-next-line react-refresh/only-export-components
export { useAppContext };
