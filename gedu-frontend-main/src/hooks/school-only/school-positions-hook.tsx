import { useEffect, useState } from "react"
import { SchoolPositionDetail, SchoolPositionRow } from "../../models/school-position-model"
import { StaffAuthority } from "../../models/staff-authority-model"
import { fetching_apis, useGetData } from "../../utils/api-helpers"

export function useSchoolPositionDetail(id?: number) {
  const [request, setRequest] = useState({ url: '' })
  const { data, fetching, error, mutate } = useGetData(request.url)

  useEffect(() => {
    setRequest({ url: id ? fetching_apis.school_position_detail.replace('{id}', id + '') : '' })
  }, [id])
  return { data, fetching, error, mutate } as { data: SchoolPositionDetail | null, fetching: boolean, error: any, mutate: any }
}

export function useSchoolPositions(page = 1, size = 20, query?: string, dept?: number | string, tmpl?: number | string) {
  const [request, setRequest] = useState({ url: '', params: null })
  const { data, fetching, error } = useGetData(request.url, request.params, false)

  useEffect(() => {
    const params = { page, size, q: query, dept, tmpl } as any
    setRequest({ url: fetching_apis.school_positions, params })
  }, [page, size, query, dept, tmpl])
  return { data: data?.data, total: data?.total, fetching, error } as { data: SchoolPositionRow[] | null, total: number, fetching: boolean, error: any }
}

export function useSchoolPositionAuthorities(position_id?: number) {
  const [request, setRequest] = useState({ url: '' as string | null })
  const { data, fetching, error, mutate } = useGetData(request.url)

  useEffect(() => {
    setRequest({ url: position_id ? fetching_apis.school_position_detail_authorities.replace('{id}', position_id + '') : null })
  }, [position_id])
  return { data, fetching, error, mutate } as { data: StaffAuthority[] | null, fetching: boolean, error: any, mutate: any }
}
