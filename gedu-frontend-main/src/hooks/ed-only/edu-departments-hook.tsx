import { useEffect, useState } from "react"
import { EduDepartmentDetail, EduDepartmentRow, EduDepartmentRowCount } from "../../models/ed-only/edu-department-model"
import { fetching_apis, useGetData } from "../../utils/api-helpers"

export function useEduDepartmentDetail(id?: number) {
  const [request, setRequest] = useState({ url: '' })
  const { data, fetching, error, mutate } = useGetData(request.url)

  useEffect(() => {
    setRequest({ url: id ? fetching_apis.edu_department_detail.replace('{id}', id + '') : '' })
  }, [id])
  return { data, fetching, error, mutate } as { data: EduDepartmentDetail | null, fetching: boolean, error: any, mutate: any }
}

export function useEduDepartments(tmpl?: number) {
  const [request, setRequest] = useState({ url: '', params: null })
  const { data, fetching, error } = useGetData(request.url, request.params, false)

  useEffect(() => {
    const params = { tmpl } as any
    setRequest({ url: fetching_apis.edu_departments, params })
  }, [tmpl])

  return { data, fetching, error } as { data: EduDepartmentRow[] | null, fetching: boolean, error: any }
}

export function useCountEduDepartments(tmpl?: number) {
  const [request, setRequest] = useState({ url: '', params: null })
  const { data, fetching, error } = useGetData(request.url, request.params, false)

  useEffect(() => {
    const params = { tmpl } as any
    setRequest({ url: fetching_apis.edu_departments_count, params })
  }, [tmpl])

  return { data, fetching, error } as { data: EduDepartmentRowCount[] | null, fetching: boolean, error: any }
}