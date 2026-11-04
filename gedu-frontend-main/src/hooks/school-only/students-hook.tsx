import { useEffect, useState } from "react"
import { StudentContact, StudentDetail, StudentMedicalInfo, StudentRequest } from "../../models/student-model"
import { callDelete, callPatch, callPost, callPut, fetching_apis, useGetData } from "../../utils/api-helpers"

export function useStudentDetail(id?: number | null) {
  const [request, setRequest] = useState({ url: '' })
  const { data, fetching, error, mutate } = useGetData(request.url)

  useEffect(() => {
    setRequest({ url: id ? fetching_apis.student_detail.replace('{id}', id + '') : '' })
  }, [id])
  return { data, fetching, error, mutate } as { data: StudentDetail | null, fetching: boolean, error: any, mutate: any }
}

export function useStudents(page = 1, size = 20, query?: string, grd?: number | string, clss?: number | string) {
  const [request, setRequest] = useState({ url: '', params: null })
  const { data, fetching, refreshing, error, mutate } = useGetData(request.url, request.params, false)

  useEffect(() => {
    const params = { page, size, q: query, grd, clss } as any
    setRequest({ url: fetching_apis.students, params })
  }, [page, size, query, grd, clss])

  return { data: data?.data, total: data?.total, fetching, refreshing, error, mutate } as { data: any[] | null, total: number, fetching: boolean, refreshing: boolean, error: any, mutate: any }
}
export async function callCreateAStudent(student: StudentRequest) {
  if (!student) return null
  const res = await callPost(fetching_apis.student_create, student)
  return { data: res?.response, error: res?.error }
}
export async function callUpdateStudentContacts(student_id: number | null, data: StudentContact[] | null) {
  if (!student_id || !data) return null
  const res = await callPost(fetching_apis.student_update_contacts.replace('{id}', student_id + ''), { contacts: data })
  return { data: res?.response, error: res?.error }
}
interface updateStudentAcademicAndPolicies_request {
  admissionDate: Date,
  admissionSchoolYearId: number,
  admissionType: number,
  gradeLevel: number,
  classId: number,
  priorityPolicyId: number,
  specialNeedsPolicyId: number
}


export async function callUpdateStudentInfo(student_id: number | null, data: any) {
  if (!student_id || !data) return null
  const res = await callPut(fetching_apis.student_update_info.replace('{id}', student_id + ''), data)
  return { data: res?.response, error: res?.error }
}
export async function callUpdateStudentAcademicAndPolicies(student_id: number | null, data: updateStudentAcademicAndPolicies_request | null) {
  if (!student_id || !data) return null
  const res = await callPatch(fetching_apis.student_update_policies.replace('{id}', student_id + ''), data)
  return { data: res?.response, error: res?.error }
}
export async function callUpdateStudentMedicalInfo(student_id: number | null, data: StudentMedicalInfo[] | null) {
  if (!student_id || !data?.length) return null
  const res = await callPatch(fetching_apis.student_update_medical_info.replace('{id}', student_id + ''), { medicalList: data })
  return { data: res?.response, error: res?.error }
}
export async function callGrantAccessContact(student_id: number, contact_id: number) {
  const res = await callPost(fetching_apis.student_grant_access_student_contact.replace('{id}', student_id + ''), { contactId: contact_id })
  return { data: res?.response, error: res?.error }
}
export async function callArrangeStudentClass(student_id: number | null, data: any) {
  if (!student_id || !data) return null
  const res = await callPatch(fetching_apis.student_arrange_class.replace('{id}', student_id + ''), data)
  return { data: res?.response, error: res?.error }
}
export async function callTransferStudentClass(student_id: number | null, data: any) {
  if (!student_id || !data) return null
  const res = await callPatch(fetching_apis.student_transfer_class.replace('{id}', student_id + ''), data)
  return { data: res?.response, error: res?.error }
}
export async function callBulkArrangeStudentClass(data: any) {
  if (!data) return null
  const res = await callPatch(fetching_apis.student_bulk_arrange_class, data)
  return { data: res?.response, error: res?.error }
}
export async function callImportStudents(file_path: string) {
  if (!file_path) return null
  const res = await callPost(fetching_apis.import_students, { filePath: file_path })
  return { data: res?.response, error: res.error }
}

export async function callCreateAStudentContact(student_id: number | null, data: any) {
  if (!student_id || !data) return null
  const res = await callPost(
    fetching_apis.student_contact_create
      .replace('{id}', student_id + '')
    , data
  )
  return { data: res?.response, error: res?.error }
}

export async function callUpdateAStudentContact(student_id: number | null, contact_id: number | null, data: any) {
  if (!student_id || !contact_id || !data) return null
  const res = await callPut(
    fetching_apis.student_contact_update
      .replace('{id}', student_id + '')
      .replace('{contact-id}', contact_id + '')
    , data
  )
  return { data: res?.response, error: res?.error }
}

export async function callDeleteAStudentContact(student_id: number | null, contact_id: number | null) {
  if (!student_id || !contact_id) return null
  const res = await callDelete(
    fetching_apis.student_contact_delete
      .replace('{id}', student_id + '')
      .replace('{contact-id}', contact_id + '')
  )
  return { data: res?.response, error: res.error }
}
export async function callActivateContact(student_id: number | null, contact_id: number) {
  if (!student_id || !contact_id) return null
  const res = await callPut(
    fetching_apis.student_contact_activate
      .replace('{id}', student_id + '')
      .replace('{contact-id}', contact_id + '')
  )
  return { data: res?.response, error: res?.error }
}