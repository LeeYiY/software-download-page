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

async function requestJSON(url, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  const res = await fetch(url, { ...options, headers })
  const json = await res.json()
  if (!json.success) throw new Error(json.error || '请求失败')
  return json.data
}

function getAdminPassword() {
  return localStorage.getItem('adminPassword') || ''
}

function setAdminPassword(pwd) {
  localStorage.setItem('adminPassword', pwd)
}

function clearAdminPassword() {
  localStorage.removeItem('adminPassword')
}

function isLoggedIn() {
  return !!getAdminPassword()
}

export const api = {
  // 获取全部软件列表
  getSoftwareList(params) {
    return request(`${API_BASE}/software`, params)
  },

  // 获取单个软件详情
  getSoftwareDetail(id) {
    return request(`${API_BASE}/software/${id}`)
  },

  // 添加新软件（需要密码）
  addSoftware(data) {
    return requestJSON(`${API_BASE}/software`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'X-Admin-Password': getAdminPassword() }
    })
  },

  // 更新软件（需要密码）
  updateSoftware(id, data) {
    return requestJSON(`${API_BASE}/software/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: { 'X-Admin-Password': getAdminPassword() }
    })
  },

  // 删除软件（需要密码）
  deleteSoftware(id) {
    return requestJSON(`${API_BASE}/software/${id}`, {
      method: 'DELETE',
      headers: { 'X-Admin-Password': getAdminPassword() }
    })
  },

  // 登录校验
  login(password) {
    return requestJSON(`${API_BASE}/auth`, {
      method: 'POST',
      body: JSON.stringify({ password })
    })
  },

  // 检查密码是否已配置
  checkAuthConfigured() {
    return request(`${API_BASE}/auth/check`)
  },

  getAdminPassword,
  setAdminPassword,
  clearAdminPassword,
  isLoggedIn
}
