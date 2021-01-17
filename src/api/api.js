import axios from 'axios'

export default (url, options) => axios(import.meta.env.SNOWPACK_PUBLIC_API_URL + url, options)
