import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import api from '../../../api/api'
import MockAdapter from 'axios-mock-adapter'
import BillingPortalTile from '../BillingPortalTile'
import userEvent from '@testing-library/user-event'

describe('<BillingPortalTile />', () => {
  const axiosMock = new MockAdapter(api)

  it('should create a portal session and redirect', async () => {
    axiosMock.onPost('http://talo.test/billing/portal-session').replyOnce(200, {
      redirect: 'http://stripe.com/portal'
    })

    const assignMock = jest.fn()
    delete window.location
    window.location = { assign: assignMock }

    render(<BillingPortalTile />)

    userEvent.click(screen.getByText('Billing Portal'))

    await waitFor(() => {
      expect(assignMock).toHaveBeenCalledWith('http://stripe.com/portal')
    })
  })

  it('should render errors', async () => {
    axiosMock.onPost('http://talo.test/billing/portal-session').networkErrorOnce()

    render(<BillingPortalTile />)

    userEvent.click(screen.getByText('Billing Portal'))

    expect(await screen.findByRole('alert')).toHaveTextContent('Network Error')
  })
})
