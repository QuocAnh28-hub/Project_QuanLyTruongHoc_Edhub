import { useEffect, useMemo, useState } from "react"
import { CurriculumDetail, CurriculumRequest, CurriculumRow } from "../../models/curriculum-model"
import { callPost, callPut, fetching_apis, useGetData } from "../../utils/api-helpers"

export function useCurriculumDetail(id?: number) {
  const [request, setRequest] = useState({ url: '' })
  const { data, fetching, error, mutate } = useGetData(request.url)

  useEffect(() => {
    setRequest({ url: id ? fetching_apis.curriculum_detail.replace('{id}', id + '') : '' })
  }, [id])
  return { data, fetching, error, mutate } as { data: CurriculumDetail | null, fetching: boolean, error: any, mutate: any }
}

export function useCurriculums(page = 1, size = 20, query?: string) {
  const [request, setRequest] = useState({ url: '', params: null })
  const { data, fetching, error } = useGetData(request.url, request.params, false)

  useEffect(() => {
    const params = { page, size, q: query } as any
    setRequest({ url: fetching_apis.curriculums, params })
  }, [page, size, query])

  return { data: data?.data, total: data?.total, fetching, error } as { data: CurriculumRow[] | null, total: number, fetching: boolean, error: any }
}

export function useCurriculumSubjects(curriculum_id?: number, page = 1, size = 20) {
  const [request, setRequest] = useState({ url: null as string | null, params: null as any })
  const { data, fetching, error, mutate } = useGetData(request.url, request.params, false)

  useEffect(() => {
    const params = { page, size } as any
    setRequest({ url: curriculum_id ? fetching_apis.curriculum_subjects.replace('{id}', curriculum_id + '') : null, params })
  }, [curriculum_id, page, size])

  const normalizedList = useMemo(() => {
    if (!data) return [];
    const raw = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
    return raw.map((item: any) => {
      const id = item.subjectId || item.id || item.subject?.id;
      const name = item.name || item.subject?.name || item.subjectName || "Môn học";
      const code = item.code || item.subject?.code || item.subjectCode || "";
      return {
        ...item,
        id,
        subjectId: id,
        name,
        code,
        subject: item.subject || { id, name, code },
      };
    });
  }, [data]);

  return {
    data: normalizedList,
    total: data?.total ?? normalizedList.length,
    fetching,
    error,
    mutate,
  } as { data: any[] | null, total: number, fetching: boolean, error: any, mutate: any }
}
export async function callCreateACurriculum(curriculum: CurriculumRequest) {
  if (!curriculum) return null
  const res = await callPost(fetching_apis.curriculum_create, curriculum)
  return { data: res?.response, error: res.error }
}

export async function callUpdateACurriculum(curriculum_id?: number, curriculum?: CurriculumDetail) {
  if (!curriculum_id || !curriculum) return null
  const res = await callPut(fetching_apis.curriculum_update.replace('{id}', curriculum_id + ''), curriculum)
  return { data: res?.response, error: res.error }
}