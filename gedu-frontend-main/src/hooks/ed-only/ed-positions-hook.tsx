import { useEffect, useState } from "react"
import { EDPositionDetail, EDPositionRow } from "../../models/ed-only/ed-position-model"
import { fetching_apis, useGetData } from "../../utils/api-helpers"

export function useEDPositionDetail(id?: number) {
  const [request, setRequest] = useState({ url: '' })
  const { data, fetching, error, mutate } = useGetData(request.url)

  useEffect(() => {
    setRequest({ url: id ? fetching_apis.ed_position_detail.replace('{id}', id + '') : '' })
  }, [id])
  return { data, fetching, error, mutate } as { data: EDPositionDetail | null, fetching: boolean, error: any, mutate: any }
}

export function useEDPositions(page = 1, size = 20, query?: string, dept?: number | string, tmpl?: number | string) {
  const [request, setRequest] = useState({ url: '', params: null })
  const { data, fetching, error } = useGetData(request.url, request.params, false)

  useEffect(() => {
    const params = { page, size, q: query, dept, tmpl } as any
    setRequest({ url: fetching_apis.ed_positions, params })
  }, [page, size, query, dept, tmpl])
  return { data: data?.data, total: data?.total, fetching, error } as { data: EDPositionRow[] | null, total: number, fetching: boolean, error: any }
}