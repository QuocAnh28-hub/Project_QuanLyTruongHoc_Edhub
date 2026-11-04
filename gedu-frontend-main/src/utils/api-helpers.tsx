import { useEffect, useState } from "react";
import { ErrorResponse } from "react-router-dom";
import useSWR from "swr";
import { FETCH_ERROR } from "../models/common";
import { nav_links } from "./routes";
import { StorageHelper, STORE_KEY_TOKEN } from "./storage-helpers";


const HTTP_METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE'
}
const ENDPOINT_GATEWAY = {
  api: import.meta.env.VITE_API_ENDPOINT
}
const auth_fetcher = async (path: any, method = HTTP_METHOD.GET, body?: any) => {
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  } as any
  let token = StorageHelper.get(STORE_KEY_TOKEN, StorageHelper.types.local)
  if (!token) token = StorageHelper.get(STORE_KEY_TOKEN, StorageHelper.types.session)
  if (token) {
    headers.Authorization = 'Bearer ' + token
  }
  const response = await fetch(ENDPOINT_GATEWAY.api + path, {
    method,
    headers,
    body: JSON.stringify(body)
  });
  if (response.ok) {
    const json = await response.json();
    return json
  } else {
    if (response.status === 401) {
      //remove expired token
      StorageHelper.clear(STORE_KEY_TOKEN, StorageHelper.types.local)
      StorageHelper.clear(STORE_KEY_TOKEN, StorageHelper.types.session)
      //redirect to login
      window.location.replace(nav_links.login.route + `?from=${encodeURIComponent(location.pathname + location.search)}`);
    }
    const error = { status: response.status, info: response.json() } as FETCH_ERROR
    throw error
  }
};
const public_fetcher = async (path: any, method = HTTP_METHOD.GET, body?: any) => {
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  } as any
  try {
    const response = await fetch(ENDPOINT_GATEWAY.api + path, {
      method,
      headers,
      body: JSON.stringify(body)
    });
    if (response.ok) {
      const json = await response.json();
      return json
    }
    const errorResponse: ErrorResponse = await response.json();
    return Promise.reject(errorResponse);
  } catch (error) {
    console.error(error);
  }
};

export const callGet = async (path: string) => {
  const response = await auth_fetcher(path, HTTP_METHOD.GET)
  response.error = response.errors?.[0]
  return response
}
export const callPost = async (path: string, body?: any) => {
  const response = await auth_fetcher(path, HTTP_METHOD.POST, body || {})
  response.error = response.errors?.[0]
  return response
}
export const callPut = async (path: string, body?: any) => {
  const response = await auth_fetcher(path, HTTP_METHOD.PUT, body || {})
  response.error = response.errors?.[0]
  return response
}
export const callPatch = async (path: string, body?: any) => {
  const response = await auth_fetcher(path, HTTP_METHOD.PATCH, body)
  response.error = response.errors?.[0]
  return response
}
export const callDelete = async (path: string) => {
  const response = await auth_fetcher(path, HTTP_METHOD.DELETE)
  response.error = response.errors?.[0]
  return response
}
export const callPublicGet = async (path: string) => {
  return await public_fetcher(path, HTTP_METHOD.GET)
}
export const callPublicPost = async (path: string, body?: any) => {
  return await public_fetcher(path, HTTP_METHOD.POST, body || {})
}

function toEndpoint(endpoint: string, params: any) {
  if (!endpoint) return ''
  endpoint = endpoint?.replace(/^\/+/, '')
  endpoint = '/' + endpoint
  let query = ''
  if (params) {
    Object.keys(params).forEach(function (element) {
      if (element && params[element] != null) {
        if (Array.isArray(params[element]))
          params[element].forEach((val: string) => query += '&' + element + '=' + encodeURIComponent(val))
        else
          query += '&' + element + '=' + encodeURIComponent(params[element])
      }
    });
    if (query)
      endpoint += '?' + query.replace(/^&/, '')
  }

  return endpoint
}
export function useGetData(path: string | null, params: any = null, immutable = true): any {
  const [endpoint, setEndpoint] = useState<null | string>(null);
  const { data, error, isLoading, isValidating, mutate }
    = useSWR(
      endpoint, auth_fetcher,
      {
        shouldRetryOnError: false,
        ...immutable ? {
          // revalidateIfStale: false,
          revalidateOnFocus: false,
          revalidateOnReconnect: false
        } : undefined,
      }
    )
  useEffect(() => {
    //tempo header
    if (!path) return
    const endpoint = toEndpoint(path, params)
    setEndpoint(endpoint)
  }, [path, params]);
  return { data: data?.response, fetching: isLoading, refreshing: isValidating, error: data ? data.errors?.[0] : error, mutate };
}
export const fetching_apis = {
  login: '/auth/login',
  forgot_password: '/auth/forgot-password',
  account_info: '/auth/account-info',
  change_password: '/auth/change-password',

  // ed view 

  schools: '/schools',
  school_detail: '/schools/{id}',
  school_update: '/schools/{id}',
  school_update_facilities: '/schools/{id}/facilities',
  school_update_operations: '/schools/{id}/operations',
  school_create: '/schools',
  school_admin_create: '/schools/{id}/admins',
  school_admins_activate: '/schools/{id}/admins/activate',
  school_campus_create: '/schools/{id}/campuses',

  edu_departments: '/edu-departments',
  edu_department_detail: '/edu-departments/{id}',
  edu_departments_count: '/edu-departments/count',

  ed_positions: '/ed-positions',
  ed_position_detail: '/ed-positions/{id}',
  ed_positions_count: '/ed-positions/count',

  ed_staffs: '/ed-staffs',
  ed_staff_detail: '/ed-staffs/{id}',
  ed_staff_update: '/ed-staffs/{id}',
  ed_staff_update_positions: '/ed-staffs/{id}/assign-department',
  ed_staff_create: '/ed-staffs',
  ed_staffs_activate: '/ed-staffs/activate',

  // school view

  school_staffs: '/staffs',
  school_staff_detail: '/staffs/{id}',
  school_staff_detail_specialization: '/staffs/{id}/specialization-and-teaching',
  school_staff_detail_contracts: '/staffs/{id}/contracts-benefits',
  school_staff_detail_folders: '/staffs/{id}/folders',
  school_staff_update: '/staffs/{id}',
  school_staff_update_positions: '/staffs/{id}/assign-department',
  school_staff_update_specialization: '/staffs/{id}/specialization-and-teaching',
  school_staff_update_contracts: '/staffs/{id}/contracts-benefits',
  school_staff_create: '/staffs',
  school_staffs_activate: '/staffs/activate',

  students: '/students',
  student_detail: '/students/{id}',
  student_update: '/students/{id}',
  student_update_info: '/students/{id}',
  student_update_contacts: '/students/{id}/student-contacts/batch',
  student_update_policies: '/students/{id}/academic-info-and-policies',
  student_update_medical_info: '/students/{id}/medical-info',
  student_grant_access_student_contact: '/students/{id}/student-contacts/grant-access',
  student_create: '/students',
  student_contact_create: '/students/{id}/student-contacts',
  student_contact_update: '/students/{id}/contacts/{contact-id}',
  student_contact_delete: '/students/{id}/contacts/{contact-id}',
  student_contact_activate: '/students/{id}/contacts/{contact-id}/activate',
  student_transfer_class: '/students/{id}/transfer-class',
  student_arrange_class: '/students/{id}/arrange-class',
  student_bulk_arrange_class: '/students/arrange-class/batch',

  school_years: '/shares/school-years',
  school_year_detail: '/school-years/{id}',
  school_year_update: '/school-years/{id}',
  school_year_create: '/school-years',
  school_year_start: '/school-years/{id}/start',

  classes: '/classes',
  classes_create: '/classes/batch',
  class_detail: '/classes/{id}',
  class_update: '/classes/{id}',
  class_update_simple: '/classes/{id}',
  class_create: '/classes',
  class_students: '/classes/{id}/students',
  class_delete: '/classes/{id}',

  curriculums: '/curriculums',
  curriculum_detail: '/curriculums/{id}',
  curriculum_update: '/curriculums/{id}',
  curriculum_create: '/curriculums',
  curriculum_subjects: '/curriculums/{id}/subjects',
  curriculum_subject_update: '/curriculums/{id}/subjects/{subject_id}',

  subjects: '/subjects',
  subject_detail: '/subjects/{id}',
  subject_update: '/subjects/{id}',
  subject_create: '/subjects',
  subject_curriculums: '/subjects/{id}/curriculums',
  subject_activate: '/subjects/{id}/activate',
  subject_deactivate: '/subjects/{id}/deactivate',

  school_departments: '/school-departments',
  school_department_detail: '/school-departments/{id}',
  school_departments_count: '/school-departments/count',

  school_positions: '/school-positions',
  school_position_detail: '/school-positions/{id}',
  school_positions_count: '/school-positions/count',
  school_position_detail_authorities: '/school-positions/{id}/authorities',

  examples: '/examples',
  example_detail: '/examples/{id}',
  example_update: '/examples/{id}',
  example_create: '/examples',

  upload: '/upload/{types}',

  import_schools: '/imports/schools',
  import_staffs: '/imports/staffs',
  import_students: '/imports/students',
}

export const fetching_shared_apis = {
  countries: '/shares/countries',
  nations: '/shares/nations',
  religions: '/shares/religions',
  provinces_cities: '/shares/provinces-cities',
  wards_communes: '/shares/wards-communes',
}
export const fetching_school_shared_apis = {
  school_departments: '/shares/school-departments',
  school_locations: '/shares/school-positions',
  school_years: '/shares/school-years',
  school_year_classes: '/shares/school-years/{id}/classes',
  student_priority_policies: '/shares/student-priority-policies',
  student_special_needs_policies: '/shares/student-special-needs-policies',
  curriculums: '/shares/curriculums',
  instruction_languages: '/shares/instruction-languages',
  foreign_languages: '/shares/foreign-languages',
  homeroom_teachers: '/shares/homeroom-teachers',
}