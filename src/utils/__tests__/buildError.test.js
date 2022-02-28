import buildError from '../buildError'

describe('buildError', () => {
  it('should turn a string into an object', () => {
    const error = buildError('Something went wrong')
    expect(error.message).toBe('Something went wrong')
    expect(error.keys).toStrictEqual({})
    expect(error.hasKeys).toBe(false)
    expect(error.extra).toStrictEqual({})
  })

  it('should pluck out the message from an error object', () => {
    const error = buildError(new Error('Something went wrong'))
    expect(error.message).toBe('Something went wrong')
    expect(error.keys).toStrictEqual({})
    expect(error.hasKeys).toBe(false)
    expect(error.extra).toStrictEqual({})
  })

  it('should pluck out the message from a response body with a message key', () => {
    const error = buildError({
      response: {
        data: {
          message: 'Something went wrong'
        }
      }
    })
    expect(error.message).toBe('Something went wrong')
    expect(error.keys).toStrictEqual({})
    expect(error.hasKeys).toBe(false)
    expect(error.extra).toStrictEqual({})
  })

  it('should fill the extra object from a response body with a message key', () => {
    const error = buildError({
      response: {
        data: {
          message: 'Something went wrong',
          showHint: true
        }
      }
    })
    expect(error.message).toBe('Something went wrong')
    expect(error.keys).toStrictEqual({})
    expect(error.hasKeys).toBe(false)
    expect(error.extra).toStrictEqual({ showHint: true })
  })

  it('should pluck out the validation keys from an error response', () => {
    const error = buildError({
      response: {
        data: {
          errors: {
            startDate: ['The startDate is invalid'],
            endDate: ['The endDate is invalid']
          }
        }
      }
    })
    expect(error.message).toBe('Something went wrong, please try again later')
    expect(error.keys).toStrictEqual({
      startDate: ['The startDate is invalid'],
      endDate: ['The endDate is invalid']
    })
    expect(error.hasKeys).toBe(true)
    expect(error.extra).toStrictEqual({})
  })

  it('should fill the extra object from an error response', () => {
    const error = buildError({
      response: {
        data: {
          errors: {
            startDate: ['The startDate is invalid'],
            endDate: ['The endDate is invalid']
          },
          showHint: true
        }
      }
    })
    expect(error.message).toBe('Something went wrong, please try again later')
    expect(error.keys).toStrictEqual({
      startDate: ['The startDate is invalid'],
      endDate: ['The endDate is invalid']
    })
    expect(error.hasKeys).toBe(true)
    expect(error.extra).toStrictEqual({ showHint: true })
  })
})
