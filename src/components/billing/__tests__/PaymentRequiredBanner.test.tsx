import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MockAdapter from 'axios-mock-adapter'
import api from '../../../api/api'
import PaymentRequiredBanner from '../PaymentRequiredBanner'

describe('<PaymentRequiredBanner />', () => {
  const axiosMock = new MockAdapter(api)

  it('should create a portal session and redirect', async () => {
    axiosMock.onPost('http://talo.api/billing/portal-session').replyOnce(200, {
      redirect: 'http://stripe.com/portal',
    })

    const assignMock = vi.fn()
    Object.defineProperty(window, 'location', {
      value: { assign: assignMock },
    })

    render(<PaymentRequiredBanner />)

    await userEvent.click(screen.getByText('Update details'))

    await waitFor(() => {
      expect(assignMock).toHaveBeenCalledWith('http://stripe.com/portal')
    })
  })

  it('should render errors', async () => {
    axiosMock.onPost('http://talo.api/billing/portal-session').networkErrorOnce()

    render(<PaymentRequiredBanner />)

    await userEvent.click(screen.getByText('Update details'))

    const content = screen.getByTestId('banner-content')
    expect(await within(content).findByRole('alert')).toHaveTextContent('Network Error')
  })
})
