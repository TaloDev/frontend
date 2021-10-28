import buildError from '../buildError'

describe('buildError', () => {
  it('should always return an object if passed a screen', () => {
    expect(buildError('Something went wrong')).toStrictEqual({ message: 'Something went wrong' })
  })

  it('should strip out everything but the message key in an error object', () => {
    expect(buildError({ message: 'Something went wrong', timestamp: 1234 })).toStrictEqual({ message: 'Something went wrong' })
  })

  it('should extract the message from the response data', () => {
    expect(buildError({
      response: {
        data: {
          message: 'Something went wrong'
        }
      }
    })).toStrictEqual({ message: 'Something went wrong' })
  })

  it('should not use the response data if there are no keys inside it', () => {
    expect(buildError({
      response: {
        data: {}
      }
    })).toStrictEqual({ message: undefined })
  })
})
