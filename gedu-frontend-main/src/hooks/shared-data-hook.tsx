import { useEffect, useState } from "react"
import { fetching_school_shared_apis, fetching_shared_apis, useGetData } from "../utils/api-helpers"

export function useCountries() {
  const { data, fetching, error } = useGetData(fetching_shared_apis.countries)
  return { data, fetching, error } as { data: any[], fetching: boolean, error: any }
}
export function useNations() {
  const { data, fetching, error } = useGetData(fetching_shared_apis.nations)
  return { data, fetching, error } as { data: any[], fetching: boolean, error: any }
}
export function useReligions() {
  const { data, fetching, error } = useGetData(fetching_shared_apis.religions)
  return { data, fetching, error } as { data: any[], fetching: boolean, error: any }
}
export function useWardsCommunes(provincesCitiesId: number | null) {
  const [request, setRequest] = useState<{ url: string | null, params: any }>({ url: '', params: null })
  const { data, fetching, error } = useGetData(request.url, request.params)
  useEffect(() => {
    const params = { provincesCitiesId } as any
    setRequest({ url: provincesCitiesId ? fetching_shared_apis.wards_communes : null, params })
  }, [provincesCitiesId])
  return { data: provincesCitiesId ? data : [], fetching, error } as { data: any[], fetching: boolean, error: any }
}
export function useProvincesCities() {
  const { data, fetching, error } = useGetData(fetching_shared_apis.provinces_cities)
  return { data, fetching, error } as { data: any[], fetching: boolean, error: any }
}
export function useStudentSpecialNeedsPolicies() {
  const { data, fetching, error } = useGetData(fetching_school_shared_apis.student_special_needs_policies)
  return { data, fetching, error } as { data: any[], fetching: boolean, error: any }
}
export function useStudentPriorityPolicies() {
  const { data, fetching, error } = useGetData(fetching_school_shared_apis.student_priority_policies)
  return { data, fetching, error } as { data: any[], fetching: boolean, error: any }
}