import api from './api'

export default async (data) => api('/public/users/login', {
  method: 'post',
  data
})
