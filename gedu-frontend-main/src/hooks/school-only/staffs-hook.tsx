import { useEffect, useState } from "react"
import { Staff, StaffContract, StaffFolder, StaffMajor, StaffRequest, StaffRow } from "../../models/staff-model"
import { callPatch, callPost, callPut, fetching_apis, useGetData } from "../../utils/api-helpers"

export function useStaffDetail(id?: number) {
  const [request, setRequest] = useState({ url: '' })
  const { data, fetching, error, mutate } = useGetData(request.url)

  useEffect(() => {
    setRequest({ url: id ? fetching_apis.school_staff_detail.replace('{id}', id + '') : '' })
  }, [id])
  return { data, fetching, error, mutate } as { data: Staff | null, fetching: boolean, error: any, mutate: any }
}

export function useStaffs(page = 1, size = 20, query?: string, dept?: number | string, pos?: number | string, ready: boolean = true) {
  const [request, setRequest] = useState({ url: null as string | null, params: null })
  const { data, fetching, error } = useGetData(request.url, request.params, false)

  useEffect(() => {
    const params = { page, size, q: query, dept, pos } as any
    setRequest({ url: ready ? fetching_apis.school_staffs : null, params })
  }, [page, size, query, dept, pos, ready])

  return { data: data?.data, total: data?.total, fetching, error } as { data: StaffRow[] | null, total: number, fetching: boolean, error: any }
}

export function useStaffDetailMajor(id?: number | null) {
  const [request, setRequest] = useState({ url: '' })
  const { data, fetching, error, mutate , refreshing } = useGetData(request.url)

  useEffect(() => {
    setRequest({ url: id ? fetching_apis.school_staff_detail_specialization.replace('{id}', id + '') : '' })
  }, [id])
  return { data, fetching, error, mutate , refreshing } as { data: StaffMajor | null, fetching: boolean, error: any, mutate: any, refreshing: boolean }
}
export function useStaffDetailContract(id?: number | null) {
  const [request, setRequest] = useState({ url: '' })
  const { data, fetching, error, mutate } = useGetData(request.url)

  useEffect(() => {
    setRequest({ url: id ? fetching_apis.school_staff_detail_contracts.replace('{id}', id + '') : '' })
  }, [id])
  return { data, fetching, error, mutate } as { data: StaffContract | null, fetching: boolean, error: any, mutate: any }
}
export function useStaffDetailFolders(id?: number | null) {
  const [request, setRequest] = useState({ url: '' })
  const { data, fetching, error, mutate } = useGetData(request.url)

  useEffect(() => {
    setRequest({ url: id ? fetching_apis.school_staff_detail_folders.replace('{id}', id + '') : '' })
  }, [id])
  return { data, fetching, error, mutate } as { data: StaffFolder[] | null, fetching: boolean, error: any, mutate: any }
}

export async function callCreateAStaff(staff: StaffRequest) {
  if (!staff) return null
  const res = await callPost(fetching_apis.school_staff_create, staff)
  return { data: res?.response, error: res.error }
}

export async function callUpdateAStaff(staff_id?: number, staff?: Staff) {
  if (!staff_id || !staff) return null
  const res = await callPut(fetching_apis.school_staff_update.replace('{id}', staff_id + ''), staff)
  return { data: res?.response, error: res.error }
}
export async function callActivateASchoolStaff(admin_id: number) {
  if (!admin_id) return null
  const res = await callPatch(fetching_apis.school_staffs_activate, { ids: [admin_id] })
  return { data: res?.response, error: res.error }
}
export async function callActivateSchoolStaffs(staff_ids: number[]) {
  if (!staff_ids?.length) return null
  const res = await callPatch(fetching_apis.school_staffs_activate, { ids: staff_ids })
  return { data: res?.response, error: res.error }
}

export async function callImportStaffs(file_path: string) {
  if (!file_path) return null
  const res = await callPost(fetching_apis.import_staffs, { filePath: file_path })
  return { data: res?.response, error: res.error }
}

export interface updateStaffPositions_request {
  departmentId: number
  positionId: number
}
export async function callUpdateStaffPositions(staff_id?: number | null, data?: updateStaffPositions_request) {
  if (!staff_id || !data) return null
  const res = await callPatch(fetching_apis.school_staff_update_positions.replace('{id}', staff_id + ''), data)
  return { data: res?.response, error: res.error }
}

export async function callUpdateStaffMajor(staff_id?: number | null, data?: StaffMajor) {
  if (!staff_id || !data) return null
  const res = await callPut(fetching_apis.school_staff_update_specialization.replace('{id}', staff_id + ''), data)
  return { data: res?.response, error: res.error }
}
export async function callUpdateStaffContract(staff_id?: number | null, data?: StaffContract) {
  if (!staff_id || !data) return null
  const res = await callPut(fetching_apis.school_staff_update_contracts.replace('{id}', staff_id + ''), data)
  return { data: res?.response, error: res.error }
}