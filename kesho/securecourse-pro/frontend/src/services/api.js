import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://progekt-production.up.railway.app',
  timeout: 10000,
})

api.interceptors.request.use(cfg => {
  const auth = JSON.parse(localStorage.getItem('auth-storage') || '{}')
  const token = auth?.state?.token
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('auth-storage')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
}

export const paymentAPI = {
  getInfo: () => api.get('/payment/info'),
  update: (method, value) => api.put('/admin/payment/update', { method, value }),
}

export const coursesAPI = {
  getAll: () => api.get('/courses'),
  getOne: (id) => api.get(`/courses/${id}`),
}

export default api
