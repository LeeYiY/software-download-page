const API_BASE = '/api'

async function request(url, params = {}) {
  const qs = new URLSearchParams(params).toString()
  const fullUrl = qs ? `${url}?${qs}` : url
  const res = await fetch(fullUrl)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  if (!json.success) throw new Error(json.error || '请求失败')
  return json.data
}

export const api = {
  // 获取全部软件列表（支持筛选、搜索、排序）
  getSoftwareList(params) {
    return request(`${API_BASE}/software`, params)
  },

  // 获取单个软件详情
  getSoftwareDetail(id) {
    return request(`${API_BASE}/software/${id}`)
  }
}