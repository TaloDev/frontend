import api from './api'

export default (currentPassword, newPassword) => api.post('/users/change_password', { currentPassword, newPassword })
