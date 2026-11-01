import { z } from 'zod'

// zod 4 dropped required_error/invalid_type_error, so both cases share one error map.
// Missing field -> 'Email is required', wrong type -> 'Email must be a number'.
export default function requiredNumber(requiredMessage: string, invalidTypeMessage: string) {
  return z.number({
    error: (issue) => (issue.input === undefined ? requiredMessage : invalidTypeMessage),
  })
}
