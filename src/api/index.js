import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

// Attach admin key to every request if present
api.interceptors.request.use((config) => {
  const key = localStorage.getItem('admin_key')
  if (key) config.headers['X-Admin-Key'] = key
  return config
})

// ─── Public ───────────────────────────────────────
export const getProducts = (categoryId = '') =>
  api.get(`/products${categoryId ? `?category_id=${categoryId}` : ''}`)

export const getProduct = (id) =>
  api.get(`/products/${id}`)

export const getCategories = () =>
  api.get('/categories')

export const createOrder = (orderData) =>
  api.post('/orders', orderData)

// ─── Admin Products ───────────────────────────────
export const adminGetProducts = () =>
  api.get('/admin/products')

export const adminCreateProduct = (data) =>
  api.post('/admin/products', data)

export const adminUpdateProduct = (id, data) =>
  api.put(`/admin/products/${id}`, data)

export const adminDeleteProduct = (id) =>
  api.delete(`/admin/products/${id}`)

// ─── Admin Orders ─────────────────────────────────
export const adminGetOrders = () =>
  api.get('/admin/orders')

export const adminGetOrder = (id) =>
  api.get(`/admin/orders/${id}`)

export const adminUpdateOrderStatus = (id, status) =>
  api.patch(`/admin/orders/${id}/status`, { status })

// ─── Admin Categories ─────────────────────────────
export const adminCreateCategory = (data) =>
  api.post('/admin/categories', data)

export const adminDeleteCategory = (id) =>
  api.delete(`/admin/categories/${id}`)

export const uploadImage = (formData) =>
  api.post('/admin/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const uploadImageFromURL = (url) =>
  api.post('/admin/upload', { url }, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })