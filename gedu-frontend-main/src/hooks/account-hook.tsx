import { callPost, fetching_apis } from "../utils/api-helpers"

export async function callChangePassword(_current: string, _new: string) {
  if (!_current || !_new) return null
  const req = { oldPassword: _current, newPassword: _new }
  const res = await callPost(fetching_apis.change_password, req)
  return { data: res?.response, error: res.error }
}