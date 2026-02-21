import { AxiosError } from 'axios'
import { TaloError } from '../components/ErrorMessage'

type APIError = {
  message: string
  errors: { [key: string]: string[] }
}

export default function buildError(error: unknown, preferredKey: string = ''): TaloError {
  let message = ''
  let keys: { [key: string]: string[] } = {}
  let extra: Partial<Omit<APIError, 'message' | 'errors'>> = {}

  if (typeof error === 'string') {
    message = error
  } else {
    const axiosError = error as AxiosError<APIError>

    if (axiosError.response?.data?.message) {
      message = axiosError.response.data.message
      extra = (Object.keys(axiosError.response.data) as (keyof APIError)[]).reduce(
        (acc, key) => {
          if (key !== 'message') {
            return { ...acc, [key]: axiosError.response!.data[key] }
          }
          return acc
        },
        {} as Partial<Omit<APIError, 'message'>>,
      )
    } else if (axiosError.response?.data?.errors) {
      keys = axiosError.response.data.errors
      extra = (Object.keys(axiosError.response.data) as (keyof APIError)[]).reduce(
        (acc, key) => {
          if (key !== 'errors') {
            return { ...acc, [key]: axiosError.response!.data[key] }
          }
          return acc
        },
        {} as Partial<Omit<APIError, 'errors'>>,
      )

      message = Object.keys(keys).includes(preferredKey)
        ? keys[preferredKey][0]
        : 'Something went wrong, please try again later'
    } else {
      message = axiosError.message
    }
  }

  return {
    message,
    keys,
    hasKeys: Object.keys(keys).length > 0,
    extra,
  }
}
