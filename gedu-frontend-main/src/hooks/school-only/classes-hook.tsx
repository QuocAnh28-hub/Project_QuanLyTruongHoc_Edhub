import { useEffect, useState } from "react"
import { ClassDetail, ClassesRequest, ClassRequest, ClassRow } from "../../models/class-model"
import { callDelete, callPatch, callPost, callPut, fetching_apis, useGetData } from "../../utils/api-helpers"

export function useClassDetail(id?: number | null) {
  const [request, setRequest] = useState({ url: '' })
  const { data, fetching, refreshing, error, mutate } = useGetData(request.url, null, false)

  useEffect(() => {
    setRequest({ url: id ? fetching_apis.class_detail.replace('{id}', id + '') : '' })
  }, [id])
  return { data, fetching, refreshing, error, mutate } as { data: ClassDetail | null, fetching: boolean, refreshing: boolean, error: any, mutate: any }
}

export function useClasses(school_year?: number, grade?: number, page = 1, size = 20, query?: string, curriculum?: number | undefined) {
  const [request, setRequest] = useState({ url: null as string | null, params: null })
  const { data, fetching, refreshing, error, mutate } = useGetData(request.url, request.params, false)

  useEffect(() => {
    const params = { year: school_year, grd: grade, page, size, q: query, curr: curriculum } as any
    setRequest({ url: school_year ? fetching_apis.classes : null, params })
  }, [school_year, grade, page, size, query, curriculum])

  return { data: data?.data || [], total: data?.total, fetching, refreshing, error, mutate } as { data: ClassRow[] | null, total: number, fetching: boolean, refreshing: boolean, error: any, mutate: any }
}

export function useClassStudents(class_id?: number | null, page = 1, size = 20, query?: string) {
  const [request, setRequest] = useState({ url: null as string | null, params: null })
  const { data, fetching, refreshing, error, mutate } = useGetData(request.url, request.params, false)

  useEffect(() => {
    const params = { page, size, q: query } as any
    setRequest({ url: class_id ? fetching_apis.class_students.replace('{id}', class_id + '') : null, params })
  }, [class_id, page, size, query])

  return { data: data?.data || [], total: data?.total, fetching, refreshing, error, mutate } as { data: ClassRow[] | null, total: number, fetching: boolean, refreshing: boolean, error: any, mutate: any }
}

export async function callCreateClasses(_values: ClassesRequest) {
  if (!_values) return null
  const res = await callPost(fetching_apis.classes_create, _values)
  return { data: res?.response, error: res.error }
}
export async function callCreateAClass(_class: ClassRequest) {
  if (!_class) return null
  const res = await callPost(fetching_apis.class_create, _class)
  return { data: res?.response, error: res.error }
}

export async function callUpdateAClass(id?: number | null, _class?: ClassDetail) {
  if (!id || !_class) return null
  const res = await callPut(fetching_apis.class_update.replace('{id}', id + ''), _class)
  return { data: res?.response, error: res.error }
}
export async function callUpdateAClassSimple(id?: number | null, _class?: any) {
  if (!id || !_class) return null
  const res = await callPatch(fetching_apis.class_update_simple.replace('{id}', id + ''), _class)
  return { data: res?.response, error: res.error }
}
export async function callDeleteAClass(id?: number) {
  if (!id) return null
  const res = await callDelete(fetching_apis.class_delete.replace('{id}', id + ''))
  return { data: res?.response, error: res.error }
}