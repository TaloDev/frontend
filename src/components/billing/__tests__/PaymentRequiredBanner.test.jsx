import { render, screen, waitFor, within } from '@testing-library/react'
import api from '../../../api/api'
import MockAdapter from 'axios-mock-adapter'
import userEvent from '@testing-library/user-event'
import PaymentRequiredBanner from '../PaymentRequiredBanner'

describe('<PaymentRequiredBanner />', () => {
  const axiosMock = new MockAdapter(api)

  it('should create a portal session and redirect', async () => {
    axiosMock.onPost('http://talo.api/billing/portal-session').replyOnce(200, {
      redirect: 'http://stripe.com/portal'
    })

    const assignMock = vi.fn()
    delete window.location
    window.location = { assign: assignMock }

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
