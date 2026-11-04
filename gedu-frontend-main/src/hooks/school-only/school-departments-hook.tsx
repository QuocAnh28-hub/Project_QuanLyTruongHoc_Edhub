import { useEffect, useState } from "react"
import { SchoolDepartmentDetail, SchoolDepartmentRow, SchoolDepartmentRowCount } from "../../models/school-department-model"
import { fetching_apis, useGetData } from "../../utils/api-helpers"

export function useSchoolDepartmentDetail(id?: number) {
  const [request, setRequest] = useState({ url: '' })
  const { data, fetching, error, mutate } = useGetData(request.url)

  useEffect(() => {
    setRequest({ url: id ? fetching_apis.school_department_detail.replace('{id}', id + '') : '' })
  }, [id])
  return { data, fetching, error, mutate } as { data: SchoolDepartmentDetail | null, fetching: boolean, error: any, mutate: any }
}

export function useSchoolDepartments(tmpl?: number) {
  const [request, setRequest] = useState({ url: '', params: null })
  const { data, fetching, error } = useGetData(request.url, request.params, false)

  useEffect(() => {
    const params = { tmpl } as any
    setRequest({ url: fetching_apis.school_departments, params })
  }, [tmpl])

  return { data, fetching, error } as { data: SchoolDepartmentRow[] | null, fetching: boolean, error: any }
}

export function useCountSchoolDepartments(tmpl?: number) {
  const [request, setRequest] = useState({ url: '', params: null })
  const { data, fetching, error } = useGetData(request.url, request.params, false)

  useEffect(() => {
    const params = { tmpl } as any
    setRequest({ url: fetching_apis.school_departments_count, params })
  }, [tmpl])

  return { data, fetching, error } as { data: SchoolDepartmentRowCount[] | null, fetching: boolean, error: any }
}