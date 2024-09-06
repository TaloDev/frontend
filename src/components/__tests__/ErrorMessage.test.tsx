import { render, screen } from '@testing-library/react'
import ErrorMessage from '../ErrorMessage'
import buildError from '../../utils/buildError'

describe('<ErrorMessage />', () => {
  it('should render all keys in the errors object', () => {
    render(
      <ErrorMessage
        error={buildError({
          response: {
            data: {
              errors: {
                startDate: ['The startDate is invalid'],
                endDate: ['The endDate is invalid']
              }
            }
          }
        })}
      />
    )

    expect(screen.getByText('startDate: The startDate is invalid')).toBeInTheDocument()
    expect(screen.getByText('endDate: The endDate is invalid')).toBeInTheDocument()
  })

  it('should just render the message when there are no errors', () => {
    render(
      <ErrorMessage
        error={buildError({
          response: {
            data: {
              message: 'Something went wrong'
            }
          }
        })}
      />
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })
})
