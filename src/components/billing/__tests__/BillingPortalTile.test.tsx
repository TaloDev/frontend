import { render, screen, waitFor } from '@testing-library/react'
import api from '../../../api/api'
import MockAdapter from 'axios-mock-adapter'
import BillingPortalTile from '../BillingPortalTile'
import userEvent from '@testing-library/user-event'

describe('<BillingPortalTile />', () => {
  const axiosMock = new MockAdapter(api)

  it('should create a portal session and redirect', async () => {
    axiosMock.onPost('http://talo.api/billing/portal-session').replyOnce(200, {
      redirect: 'http://stripe.com/portal'
    })

    const assignMock = vi.fn()
    Object.defineProperty(window, 'location', {
      value: { assign: assignMock }
    })

    render(<BillingPortalTile />)

    await userEvent.click(screen.getByText('Billing Portal'))

    await waitFor(() => {
      expect(assignMock).toHaveBeenCalledWith('http://stripe.com/portal')
    })
  })

  it('should render errors', async () => {
    axiosMock.onPost('http://talo.api/billing/portal-session').networkErrorOnce()

    render(<BillingPortalTile />)

    await userEvent.click(screen.getByText('Billing Portal'))

    expect(await screen.findByRole('alert')).toHaveTextContent('Network Error')
  })
})
