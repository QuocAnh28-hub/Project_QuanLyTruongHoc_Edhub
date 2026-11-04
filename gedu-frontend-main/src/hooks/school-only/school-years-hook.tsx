import { useEffect, useState } from "react"
import { SchoolYearDetail, SchoolYearRequest } from "../../models/school-year-model"
import { callPost, callPut, fetching_apis, useGetData } from "../../utils/api-helpers"

export function useSchoolYearDetail(id?: number | null) {
  const [request, setRequest] = useState({ url: '' })
  const { data, fetching, error, mutate } = useGetData(request.url)

  useEffect(() => {
    setRequest({ url: id ? fetching_apis.school_year_detail.replace('{id}', id + '') : '' })
  }, [id])
  return { data, fetching, error, mutate } as { data: SchoolYearDetail | null, fetching: boolean, error: any, mutate: any }
}
export function useSchoolYears(page = 1, size = 20) {
  const [request, setRequest] = useState<{ url: string | null, params: any }>({ url: '', params: null })
  const { data, fetching, error, mutate } = useGetData(request.url, request.params)
  useEffect(() => {
    const params = { page, size } as any
    setRequest({
      url: fetching_apis.school_years,
      params
    })
  }, [page, size])

  return { data, total: data?.total, fetching, error, mutate } as { data: any, total: number, fetching: boolean, error: any, mutate: any }
}

export async function callCreateASchoolYear(school_year: SchoolYearRequest) {
  if (!school_year) return null
  const res = await callPost(fetching_apis.school_year_create, school_year)
  return { data: res?.response, error: res.error }
}

export async function callUpdateASchoolYear(school_year_id?: number | null, school_year?: SchoolYearRequest) {
  if (!school_year_id || !school_year) return null
  const res = await callPut(fetching_apis.school_year_update.replace('{id}', school_year_id + ''), school_year)
  return { data: res?.response, error: res.error }
}

export async function callStartSchoolYear(school_year_id?: number | null) {
  if (!school_year_id) return null
  const res = await callPost(fetching_apis.school_year_start.replace('{id}', school_year_id + ''))
  return { data: res?.response, error: res.error }
} 