import api from '../api/api'
import handleAccessToken from './handleAccessToken'

export default (accessToken, setAccessToken) => {
  api.interceptors.request.eject(0)
  api.interceptors.request.use(async (config) => {
    try {
      const token = await handleAccessToken(accessToken)
      setAccessToken(token)
      config.headers.authorization = `Bearer ${token}`
    } catch (err) {
      console.error(err)
      setAccessToken(null)
      api.interceptors.request.eject(0)
    }

    return config
  }, (error) => Promise.reject(error))
}
