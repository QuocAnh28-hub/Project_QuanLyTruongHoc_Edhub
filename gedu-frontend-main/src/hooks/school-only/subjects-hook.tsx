import { useEffect, useState } from "react"
import { SubjectDetail, SubjectRequest, SubjectRow } from "../../models/subject-model"
import { callPost, callPut, fetching_apis, useGetData } from "../../utils/api-helpers"

export function useSubjectDetail(id?: number) {
  const [request, setRequest] = useState({ url: '' })
  const { data, fetching, error, mutate } = useGetData(request.url)

  useEffect(() => {
    setRequest({ url: id ? fetching_apis.subject_detail.replace('{id}', id + '') : '' })
  }, [id])
  return { data, fetching, error, mutate } as { data: SubjectDetail | null, fetching: boolean, error: any, mutate: any }
}

export function useSubjects(page = 1, size = 20, query?: string) {
  const [request, setRequest] = useState({ url: '', params: null })
  const { data, fetching, error, mutate } = useGetData(request.url, request.params, false)

  useEffect(() => {
    const params = { page, size, q: query } as any
    setRequest({ url: fetching_apis.subjects, params })
  }, [page, size, query])

  return { data: data?.data, total: data?.total, fetching, error, mutate } as { data: SubjectRow[] | null, total: number, fetching: boolean, error: any, mutate: any }
}

export function useSubjectCurriculums(subject_id?: number, page = 1, size = 20) {
  const [request, setRequest] = useState({ url: null as string | null, params: null as any })
  const { data, fetching, error, mutate } = useGetData(request.url, request.params, false)

  useEffect(() => {
    const params = { page, size } as any
    setRequest({ url: subject_id ? fetching_apis.subject_curriculums.replace('{id}', subject_id + '') : null, params })
  }, [subject_id, page, size])

  return { data: data, total: data?.total, fetching, error, mutate } as { data: SubjectRow[] | null, total: number, fetching: boolean, error: any, mutate: any }
}
export async function callCreateASubject(subject: SubjectRequest) {
  if (!subject) return null
  const res = await callPost(fetching_apis.subject_create, subject)
  return { data: res?.response, error: res.error }
}

export async function callUpdateASubject(subject_id?: number, subject?: SubjectDetail) {
  if (!subject_id || !subject) return null
  const res = await callPut(fetching_apis.subject_update.replace('{id}', subject_id + ''), subject)
  return { data: res?.response, error: res.error }
}
export async function callUpdateACurriculumSubject(curr_id?: number | null, subj_id?: number, grade?: number, _subject?: any) {
  if (!curr_id || !subj_id || !grade || !_subject) return null
  const res = await callPut(fetching_apis.curriculum_subject_update.replace('{id}', curr_id + '').replace('{subject_id}', subj_id + '') + '?grd=' + grade, _subject)
  return { data: res?.response, error: res.error }
}
export async function callActiveSubject(subject_id: number, can_apply: boolean) {
  let res = null as any
  if (can_apply)
    res = await callPut(fetching_apis.subject_activate.replace('{id}', subject_id + ''))
  else
    res = await callPut(fetching_apis.subject_deactivate.replace('{id}', subject_id + ''))
  return { data: res?.response, error: res.error }
}