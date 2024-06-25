import { captureException } from '@sentry/react'
import { AxiosResponse } from 'axios'
import { z, ZodError } from 'zod'
import type { ZodType } from 'zod'

export default function makeValidatedRequest<T extends ZodType, A extends unknown[]>(
  doFetch: (...args: A) => Promise<AxiosResponse>,
  validator: T
): (...args: A) => Promise<z.infer<T>> {
  return async (...args) => {
    const res = await doFetch(...args)
    const rawResult = res.data

    try {
      return await validator.parseAsync(rawResult)
    } catch (parseError) {
      if (parseError instanceof ZodError) {
        console.error(`Response body (${res.request.responseURL}) is invalid`, parseError.errors.map((error) => ({
          ...error,
          path: error.path.join('.')
        })))
      }

      captureException(parseError)
      return rawResult
    }
  }
}
