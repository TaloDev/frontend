import axios from 'axios'

export const apiConfig = {
  withCredentials: true,
  baseURL: import.meta.env.SNOWPACK_PUBLIC_API_URL
}

const instance = axios.create(apiConfig)
export default instance
