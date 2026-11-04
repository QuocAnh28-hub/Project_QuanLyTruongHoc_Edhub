import { useEffect, useState } from "react"
import { School, SchoolCampus, SchoolFacilities, SchoolOperations, SchoolRow } from "../../models/ed-only/school-model"
import { callPost, callPut, fetching_apis, useGetData } from "../../utils/api-helpers"

export function useSchoolDetail(id?: number) {
  const [request, setRequest] = useState({ url: '' })
  const { data, fetching, error, mutate } = useGetData(request.url)

  useEffect(() => {
    setRequest({ url: id ? fetching_apis.school_detail.replace('{id}', id + '') : '' })
  }, [id])
  return { data, fetching, error, mutate } as { data: School | null, fetching: boolean, error: any, mutate: any }
}

export function useSchoolOperations(id?: number) {
  const [request, setRequest] = useState({ url: '' })
  const { data, fetching, error, mutate } = useGetData(request.url)

  useEffect(() => {
    setRequest({ url: id ? fetching_apis.school_update_operations.replace('{id}', id + '') : '' })
  }, [id])
  return { data: error ? null : data ? data : new SchoolOperations(), fetching, error, mutate } as { data: SchoolOperations | null, fetching: boolean, error: any, mutate: any }
}

export function useSchoolFacilities(id?: number) {
  const [request, setRequest] = useState({ url: '' })
  const { data, fetching, error, mutate } = useGetData(request.url)

  useEffect(() => {
    setRequest({ url: id ? fetching_apis.school_update_facilities.replace('{id}', id + '') : '' })
  }, [id])
  return { data: error ? null : data ? data : new SchoolFacilities(), fetching, error, mutate } as { data: SchoolFacilities | null, fetching: boolean, error: any, mutate: any }
}

export function useSchools(page = 1, size = 20, query?: string, type?: number | string, intl?: number | string, status?: number | string, level?: number | string) {
  const [request, setRequest] = useState({ url: '', params: null })
  const { data, fetching, error, mutate } = useGetData(request.url, request.params, false)

  useEffect(() => {
    const params = { page, size, q: query, type, intl, status, level } as any
    setRequest({ url: fetching_apis.schools, params })
  }, [page, size, query, type, intl, status, level])

  return { data: data?.data, total: data?.total, fetching, error, mutate } as { data: SchoolRow[] | null, total: number, fetching: boolean, error: any, mutate: any }
}
export async function createASchool(school: School) {
  if (!school) return null
  const res = await callPost(fetching_apis.school_create, school)
  return { data: res?.response, error: res.error }
}

export async function callCreateASchoolCampus(school_id: number, campus: SchoolCampus) {
  if (!campus) return null
  const res = await callPost(fetching_apis.school_campus_create.replace('{id}', school_id + ''), campus)
  return { data: res?.response, error: res.error }
}
export async function callUpdateASchool(school_id: number, school: School) {
  if (!school) return null
  const res = await callPut(fetching_apis.school_update.replace('{id}', school_id + ''), school)
  return { data: res?.response, error: res.error }
}
export async function callUpdateASchoolFacilities(school_id: number, school_facilities: SchoolFacilities) {
  if (!school_facilities) return null
  const res = await callPut(fetching_apis.school_update_facilities.replace('{id}', school_id + ''), school_facilities)
  return { data: res?.response, error: res.error }
}
export async function callUpdateASchoolOperations(school_id: number, school_operations: SchoolOperations) {
  if (!school_operations) return null
  const res = await callPut(fetching_apis.school_update_operations.replace('{id}', school_id + ''), school_operations)
  return { data: res?.response, error: res.error }
}
export async function createASchoolAdmin(school_id: number, admin: any) {
  if (!school_id || !admin) return null
  const res = await callPost(fetching_apis.school_admin_create.replace('{id}', school_id + ''), admin)
  return { data: res?.response, error: res.error }
}
export async function activateASchoolAdmin(school_id: number, admin_id: number) {
  if (!school_id || !admin_id) return null
  const res = await callPost(fetching_apis.school_admins_activate.replace('{id}', school_id + ''), { ids: [admin_id] })
  return { data: res?.response, error: res.error }
}
export async function activateSchoolAdmins(school_id: number, admin_ids: number[]) {
  if (!school_id || !admin_ids?.length) return null
  const res = await callPost(fetching_apis.school_admins_activate.replace('{id}', school_id + ''), { ids: admin_ids })
  return { data: res?.response, error: res.error }
}

export async function callImportSchools(file_path: string) {
  if (!file_path) return null
  const res = await callPost(fetching_apis.import_schools, { filePath: file_path })
  return { data: res?.response, error: res.error }
}
export function useGetSchoolImport() {
  const { data, fetching, error } = useGetData(fetching_apis.import_schools)

  return { data, fetching, error } as { data: SchoolRow[] | null, total: number, fetching: boolean, error: any }
}