import { useEffect, useState } from "react"
import { ExampleDetail, ExampleRequest, ExampleRow } from "../../models/example-model"
import { callPost, callPut, fetching_apis, useGetData } from "../../utils/api-helpers"

export function useExampleDetail(id?: number) {
  const [request, setRequest] = useState({ url: '' })
  const { data, fetching, error, mutate } = useGetData(request.url)

  useEffect(() => {
    setRequest({ url: id ? fetching_apis.example_detail.replace('{id}', id + '') : '' })
  }, [id])
  return { data, fetching, error, mutate } as { data: ExampleDetail | null, fetching: boolean, error: any, mutate: any }
}

export function useExamples(page = 1, size = 20, query?: string, dept?: number | string, pos?: number | string) {
  const [request, setRequest] = useState({ url: '', params: null })
  const { data, fetching, error } = useGetData(request.url, request.params, false)

  useEffect(() => {
    const params = { page, size, q: query, dept, pos } as any
    setRequest({ url: fetching_apis.examples, params })
  }, [page, size, query, dept, pos])

  return { data: data?.data, total: data?.total, fetching, error } as { data: ExampleRow[] | null, total: number, fetching: boolean, error: any }
}
export async function callCreateAExample(example: ExampleRequest) {
  if (!example) return null
  const res = await callPost(fetching_apis.example_create, example)
  return { data: res?.response, error: res.error }
}

export async function callUpdateAExample(example_id?: number, example?: ExampleDetail) {
  if (!example_id || !example) return null
  const res = await callPut(fetching_apis.example_update.replace('{id}', example_id + ''), example)
  return { data: res?.response, error: res.error }
}