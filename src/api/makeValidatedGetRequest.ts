import { ZodType } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

export default function makeValidatedGetRequest<T extends ZodType>(url: string, validator: T) {
  return makeValidatedRequest(() => api.get(url), validator)()
}
