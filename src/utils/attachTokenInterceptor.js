import api from '../api/api'
import logout from '../api/logout'
import handleAccessToken from './handleAccessToken'

export default (accessToken, setAccessToken) => {
  api.interceptors.request.eject(0)
  api.interceptors.request.use(async (config) => {
    try {
      const token = await handleAccessToken(accessToken)
      config.headers.authorization = `Bearer ${token}`
    } catch (err) {
      await logout()
      setAccessToken(null)
      api.interceptors.request.eject(0)
    }

    return config
  }, (error) => Promise.reject(error))
}
