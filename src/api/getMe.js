import api from './api'

export default async (accessToken) => {
  return api.get('/users/me', {
    headers: {
      authorization: `Bearer ${accessToken}`
    }
  })
}
