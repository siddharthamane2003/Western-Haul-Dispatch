import axios, { type AxiosInstance, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'
import toast from 'react-hot-toast'

const API_HOST = import.meta.env.VITE_API_URL || ''
const BASE_URL = `${API_HOST}/api/v1`

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Token management
let accessToken: string | null = localStorage.getItem('access_token')
let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

export const tokenManager = {
  get: () => accessToken,
  set: (token: string | null) => {
    accessToken = token
    if (token) {
      localStorage.setItem('access_token', token)
    } else {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    }
  },
  getRefresh: () => localStorage.getItem('refresh_token'),
  setRefresh: (token: string | null) => {
    if (token) {
      localStorage.setItem('refresh_token', token)
    } else {
      localStorage.removeItem('refresh_token')
    }
  },
  clear: () => {
    accessToken = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  },
}

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else if (token) {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Request interceptor — attach auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.get()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    const method = (config.method || 'get').toUpperCase()
    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      const url = `${config.baseURL || ''}${config.url || ''}`
      // #region agent log
      fetch('http://127.0.0.1:7683/ingest/9880e8b7-d01d-4c70-b168-7c4233b2b147',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'a44aee'},body:JSON.stringify({sessionId:'a44aee',location:'api.ts:request',message:'API REQUEST',data:{url,method,payload:config.data,headers:config.headers},timestamp:Date.now(),hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      console.log('========== API REQUEST ==========')
      console.log('URL:', url)
      console.log('Method:', method)
      console.log('Payload:', config.data)
      console.log('Headers:', config.headers)
      console.log('===============================')
    }
    return config
  },
  error => Promise.reject(error)
)

// Response interceptor — handle errors + token refresh
api.interceptors.response.use(
  response => {
    const method = (response.config.method || 'get').toUpperCase()
    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      const url = `${response.config.baseURL || ''}${response.config.url || ''}`
      // #region agent log
      fetch('http://127.0.0.1:7683/ingest/9880e8b7-d01d-4c70-b168-7c4233b2b147',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'a44aee'},body:JSON.stringify({sessionId:'a44aee',location:'api.ts:response',message:'API RESPONSE OK',data:{url,method,status:response.status,data:response.data},timestamp:Date.now(),hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      console.log('========== API RESPONSE ==========')
      console.log('Status:', response.status)
      console.log(response.data)
      console.log('=================================')
    }
    return response
  },
  async error => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    // Handle 401 — try token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${token}`
          }
          return api(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = tokenManager.getRefresh()

      if (!refreshToken) {
        tokenManager.clear()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        const res = await axios.post(`${BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        })
        const { access_token, refresh_token } = res.data
        tokenManager.set(access_token)
        tokenManager.setRefresh(refresh_token)
        processQueue(null, access_token)
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${access_token}`
        }
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        tokenManager.clear()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // Handle other errors with toast notifications
    const message = error.response?.data?.detail || error.response?.data?.message || error.message
    const status = error.response?.status

    if (status === 403) {
      toast.error('You do not have permission to perform this action.')
    } else if (status === 404) {
      // Don't show toast for 404s — handled per-request
    } else if (status === 422) {
      // Validation errors — handled per-form
    } else if (status === 429) {
      toast.error('Too many requests. Please slow down.')
    } else if (status && status >= 500) {
      toast.error('Server error. Please try again later.')
    } else if (!status) {
      toast.error('Network error. Check your connection.')
    } else if (status !== 401) {
      if (message && typeof message === 'string') {
        toast.error(message)
      }
    }

    const cfg = error.config as InternalAxiosRequestConfig | undefined
    if (cfg) {
      const method = (cfg.method || 'get').toUpperCase()
      if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
        const url = `${cfg.baseURL || ''}${cfg.url || ''}`
        // #region agent log
        fetch('http://127.0.0.1:7683/ingest/9880e8b7-d01d-4c70-b168-7c4233b2b147',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'a44aee'},body:JSON.stringify({sessionId:'a44aee',location:'api.ts:responseError',message:'API RESPONSE ERROR',data:{url,method,status:error.response?.status,detail:error.response?.data,message:error.message},timestamp:Date.now(),hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        console.error('========== API ERROR ==========')
        console.error('URL:', url)
        console.error('Status:', error.response?.status)
        console.error('Response:', error.response?.data)
        console.error('Error:', error.message)
        console.error('=================================')
      }
    }

    return Promise.reject(error)
  }
)

// Typed API helpers
export const apiGet = <T>(url: string, config?: AxiosRequestConfig) =>
  api.get<T>(url, config).then(r => r.data)

export const apiPost = <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
  api.post<T>(url, data, config).then(r => r.data)

export const apiPut = <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
  api.put<T>(url, data, config).then(r => r.data)

export const apiPatch = <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
  api.patch<T>(url, data, config).then(r => r.data)

export const apiDelete = <T>(url: string, config?: AxiosRequestConfig) =>
  api.delete<T>(url, config).then(r => r.data)

export default api
