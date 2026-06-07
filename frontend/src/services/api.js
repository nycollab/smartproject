import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

// attach JWT to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// auth
export const login = (email, password) =>
  api.post('/auth/login', { email, password }).then(r => r.data)

export const register = (name, email, password, phone) =>
  api.post('/auth/register', { name, email, password, phone }).then(r => r.data)

// products
export const listProducts = (params) =>
  api.get('/products', { params }).then(r => r.data)

export const getProduct = (id) =>
  api.get(`/products/${id}`).then(r => r.data)

// cart
export const getCart = () =>
  api.get('/cart').then(r => r.data)

export const addToCart = (product_id, quantity) =>
  api.post('/cart', { product_id, quantity }).then(r => r.data)

export const updateCartItem = (item_id, quantity) =>
  api.put(`/cart/${item_id}`, { quantity }).then(r => r.data)

export const removeCartItem = (item_id) =>
  api.delete(`/cart/${item_id}`).then(r => r.data)

// orders
export const placeOrder = (shipping_address) =>
  api.post('/orders', { shipping_address }).then(r => r.data)

// meter
export const getMeterProfile = () =>
  api.get('/meter/profile').then(r => r.data)

export const getMeterReadings = (range) =>
  api.get('/meter/readings', { params: { range } }).then(r => r.data)

export const getMeterStats = () =>
  api.get('/meter/stats').then(r => r.data)

export const getMeterComparison = () =>
  api.get('/meter/comparison').then(r => r.data)

export default api
