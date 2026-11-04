import { useEffect, useState } from "react"
import { EDStaff, EDStaffRequest, EDStaffRow } from "../../models/ed-only/ed-staff-model"
import { callPatch, callPost, callPut, fetching_apis, useGetData } from "../../utils/api-helpers"

export function useEDStaffDetail(id?: number) {
  const [request, setRequest] = useState({ url: '' })
  const { data, fetching, error, mutate } = useGetData(request.url)

  useEffect(() => {
    setRequest({ url: id ? fetching_apis.ed_staff_detail.replace('{id}', id + '') : '' })
  }, [id])
  return { data, fetching, error, mutate } as { data: EDStaff | null, fetching: boolean, error: any, mutate: any }
}

export function useEDStaffs(page = 1, size = 20, query?: string, dept?: number | string, pos?: number | string, ready: boolean = true) {
  const [request, setRequest] = useState({ url: null as string | null, params: null })
  const { data, fetching, error } = useGetData(request.url, request.params, false)

  useEffect(() => {
    const params = { page, size, q: query, dept, pos } as any
    setRequest({ url: ready ? fetching_apis.ed_staffs : null, params })
  }, [page, size, query, dept, pos, ready])

  return { data: data?.data, total: data?.total, fetching, error } as { data: EDStaffRow[] | null, total: number, fetching: boolean, error: any }
}
export async function callCreateAEDStaff(staff: EDStaffRequest) {
  if (!staff) return null
  const res = await callPost(fetching_apis.ed_staff_create, staff)
  return { data: res?.response, error: res.error }
}

export async function callUpdateAEDStaff(staff_id?: number, staff?: EDStaff) {
  if (!staff_id || !staff) return null
  const res = await callPut(fetching_apis.ed_staff_update.replace('{id}', staff_id + ''), staff)
  return { data: res?.response, error: res.error }
}
export async function callActivateASchoolEDStaff(admin_id: number) {
  if (!admin_id) return null
  const res = await callPatch(fetching_apis.ed_staffs_activate, { ids: [admin_id] })
  return { data: res?.response, error: res.error }
}
export async function callActivateSchoolEDStaffs(staff_ids: number[]) {
  if (!staff_ids?.length) return null
  const res = await callPatch(fetching_apis.ed_staffs_activate, { ids: staff_ids })
  return { data: res?.response, error: res.error }
}

export async function importEDStaffs(file_path: string) {
  if (!file_path) return null
  const res = await callPost(fetching_apis.import_staffs, { filePath: file_path })
  return { data: res?.response, error: res.error }
}

export interface updateEDStaffPositions_request {
  departmentId: number
  positionId: number
}
export async function callUpdateEDStaffPositions(staff_id?: number, data?: updateEDStaffPositions_request) {
  if (!staff_id || !data) return null
  const res = await callPatch(fetching_apis.ed_staff_update_positions.replace('{id}', staff_id + ''), data)
  return { data: res?.response, error: res.error }
}