import { useEffect, useState } from "react"
import { fetching_school_shared_apis, useGetData } from "../../utils/api-helpers"

export function useMetaSchoolDepartments(tmpl?: number) {
  const [request, setRequest] = useState<{ url: string | null, params: any }>({ url: '', params: null })
  const { data, fetching, error } = useGetData(request.url, request.params)
  useEffect(() => {
    const params = { tmpl } as any
    setRequest({ url: fetching_school_shared_apis.school_departments, params })
  }, [tmpl])
  return { data, total: data?.total, fetching, error } as { data: any, total: number, fetching: boolean, error: any }
}

export function useMetaSchoolPositions(dept: number | null, tmpl?: number) {
  const [request, setRequest] = useState<{ url: string | null, params: any }>({ url: '', params: null })
  const { data, fetching, error } = useGetData(request.url, request.params)
  useEffect(() => {
    const params = { dept, tmpl } as any
    setRequest({ url: fetching_school_shared_apis.school_locations, params })
  }, [dept, tmpl])

  return { data, total: data?.total, fetching, error } as { data: any, total: number, fetching: boolean, error: any }
}

export function useMetaSchoolYears() {
  const [request, setRequest] = useState<{ url: string | null, params: any }>({ url: '', params: null })
  const { data, fetching, error } = useGetData(request.url, request.params)
  useEffect(() => {
    const params = {} as any
    setRequest({
      url: fetching_school_shared_apis.school_years,
      params
    })
  }, [])

  return { data: data, total: data?.total, fetching, error } as { data: any, total: number, fetching: boolean, error: any }
}

export function useMetaClasses(school_year_id?: number | null, grd?: number | null) {
  const [request, setRequest] = useState<{ url: string | null, params: any }>({ url: '', params: null })
  const { data, fetching, error } = useGetData(request.url, request.params)
  useEffect(() => {
    const params = { grd } as any
    setRequest({
      url: school_year_id ? fetching_school_shared_apis.school_year_classes.replace('{id}', school_year_id + '') : null,
      params
    })
  }, [school_year_id, grd])

  return { data, total: data?.total, fetching, error } as { data: any, total: number, fetching: boolean, error: any }
}

export function useMetaCurriculums(grd?: number | null) {
  const [request, setRequest] = useState<{ url: string | null, params: any }>({ url: '', params: null })
  const { data, fetching, error } = useGetData(request.url, request.params)
  useEffect(() => {
    const params = null as any// { grd } as any
    setRequest({
      url: grd ? fetching_school_shared_apis.curriculums : null,
      params
    })
  }, [grd])

  return { data, total: data?.total, fetching, error } as { data: any, total: number, fetching: boolean, error: any }
}

export function useInstructionLanguages() {
  const [request, setRequest] = useState<{ url: string | null, params: any }>({ url: '', params: null })
  const { data, fetching, error } = useGetData(request.url, request.params)
  useEffect(() => {
    const params = {} as any
    setRequest({
      url: fetching_school_shared_apis.instruction_languages,
      params
    })
  }, [])
  return { data, total: data?.total, fetching, error } as { data: any, total: number, fetching: boolean, error: any }
}
export function useForeignLanguages() {
  const [request, setRequest] = useState<{ url: string | null, params: any }>({ url: '', params: null })
  const { data, fetching, error } = useGetData(request.url, request.params)
  useEffect(() => {
    const params = {} as any
    setRequest({
      url: fetching_school_shared_apis.foreign_languages,
      params
    })
  }, [])
  return { data, total: data?.total, fetching, error } as { data: any, total: number, fetching: boolean, error: any }
}

export function useMetaHomeroomTeachers() {
  const [request, setRequest] = useState<{ url: string | null, params: any }>({ url: '', params: null })
  const { data, fetching, error } = useGetData(request.url, request.params)
  useEffect(() => {
    const params = null as any// { grd } as any
    setRequest({
      url: fetching_school_shared_apis.homeroom_teachers,
      params
    })
  }, [])

  return { data, total: data?.total, fetching, error } as { data: any, total: number, fetching: boolean, error: any }
}
