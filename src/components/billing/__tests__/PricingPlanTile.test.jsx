import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import api from '../../../api/api'
import MockAdapter from 'axios-mock-adapter'
import userEvent from '@testing-library/user-event'
import PricingPlanTile from '../PricingPlanTile'

describe('<PricingPlanTile />', () => {
  const axiosMock = new MockAdapter(api)

  it('should render the correct amount for the display interval', () => {
    render(
      <PricingPlanTile
        plan={{
          id: 1,
          actions: [],
          name: 'Team plan',
          prices: [
            { amount: 5999, currency: 'usd', interval: 'year' },
            { amount: 499, currency: 'usd', interval: 'month' }
          ]
        }}
        displayInterval='month'
        planLoadingState={[null, vi.fn()]}
      />
    )

    expect(screen.getByText('$4.99 / month')).toBeInTheDocument()
  })

  it('should render a free price', () => {
    render(
      <PricingPlanTile
        plan={{
          id: 1,
          actions: [],
          name: 'Team plan',
          prices: [
            { amount: 0, currency: 'usd', interval: 'year' },
            { amount: 0, currency: 'usd', interval: 'month' }
          ]
        }}
        displayInterval='month'
        planLoadingState={[null, vi.fn()]}
      />
    )

    expect(screen.getByText('Free forever')).toBeInTheDocument()
  })

  it('should render the plan actions correctly', () => {
    render(
      <PricingPlanTile
        plan={{
          id: 1,
          actions: [
            { id: 1, type: 0, limit: 5, trackedMonthly: false },
            { id: 2, type: 1, limit: 8, trackedMonthly: true }
          ],
          name: 'Team plan',
          prices: [
            { amount: 5999, currency: 'usd', interval: 'year' },
            { amount: 499, currency: 'usd', interval: 'month' }
          ]
        }}
        displayInterval='month'
        planLoadingState={[null, vi.fn()]}
      />
    )

    expect(screen.getByText('5 User seats')).toBeInTheDocument()

    expect(screen.getByText('8 Data exports')).toBeInTheDocument()
    expect(screen.getByText('per month')).toBeInTheDocument()
  })

  it('should render a contact us link for the custom plan', () => {
    render(
      <PricingPlanTile
        custom
        plan={{
          id: Infinity,
          actions: [],
          name: 'Custom',
          prices: []
        }}
        displayInterval='month'
        planLoadingState={[null, vi.fn()]}
      />
    )

    expect(screen.getByText('Custom')).toBeInTheDocument()

    expect(screen.getByRole('link')).toBeInTheDocument()
    expect(screen.getByText('contact us')).toBeInTheDocument()
  })

  it('should render the cta as upgrade if the plan has a higher price than the current price', () => {
    render(
      <PricingPlanTile
        plan={{
          id: 1,
          actions: [
            { id: 1, type: 0, limit: 5, trackedMonthly: false },
            { id: 2, type: 1, limit: 8, trackedMonthly: true }
          ],
          name: 'Team plan',
          prices: [
            { amount: 5999, currency: 'usd', interval: 'year' },
            { amount: 499, currency: 'usd', interval: 'month' }
          ]
        }}
        displayInterval='month'
        planLoadingState={[null, vi.fn()]}
        currentPlanPrice={{ amount: 0, currency: 'usd', interval: 'month' }}
      />
    )

    expect(screen.getByText('Upgrade')).toBeInTheDocument()
  })

  it('should fallback the cta to an upgrade if there is no current price', () => {
    render(
      <PricingPlanTile
        plan={{
          id: 1,
          actions: [
            { id: 1, type: 0, limit: 5, trackedMonthly: false },
            { id: 2, type: 1, limit: 8, trackedMonthly: true }
          ],
          name: 'Team plan',
          prices: [
            { amount: 5999, currency: 'usd', interval: 'year' },
            { amount: 499, currency: 'usd', interval: 'month' }
          ]
        }}
        displayInterval='month'
        planLoadingState={[null, vi.fn()]}
        currentPlanPrice={null}
      />
    )

    expect(screen.getByText('Upgrade')).toBeInTheDocument()
  })

  it('should render the cta as change plan if the plan has a higher price than the current price', () => {
    render(
      <PricingPlanTile
        plan={{
          id: 1,
          actions: [
            { id: 1, type: 0, limit: 5, trackedMonthly: false },
            { id: 2, type: 1, limit: 8, trackedMonthly: true }
          ],
          name: 'Team plan',
          prices: [
            { amount: 5999, currency: 'usd', interval: 'year' },
            { amount: 499, currency: 'usd', interval: 'month' }
          ]
        }}
        displayInterval='month'
        planLoadingState={[null, vi.fn()]}
        currentPlanPrice={{ amount: 7999, currency: 'usd', interval: 'month' }}
      />
    )

    expect(screen.getByText('Change plan')).toBeInTheDocument()
  })

  it('should redirect after clicking upgrade', async () => {
    axiosMock.onPost('http://talo.test/billing/checkout-session').replyOnce(200, {
      redirect: 'http://stripe.com/portal'
    })

    const assignMock = vi.fn()
    delete window.location
    window.location = { assign: assignMock }

    render(
      <PricingPlanTile
        plan={{
          id: 1,
          actions: [
            { id: 1, type: 0, limit: 5, trackedMonthly: false },
            { id: 2, type: 1, limit: 8, trackedMonthly: true }
          ],
          name: 'Team plan',
          prices: [
            { amount: 5999, currency: 'usd', interval: 'year' },
            { amount: 499, currency: 'usd', interval: 'month' }
          ]
        }}
        displayInterval='month'
        planLoadingState={[null, vi.fn()]}
        currentPlanPrice={{ amount: 0, currency: 'usd', interval: 'month' }}
      />
    )

    await userEvent.click(screen.getByText('Upgrade'))

    await waitFor(() => {
      expect(assignMock).toHaveBeenCalledWith('http://stripe.com/portal')
    })
  })

  it('should render the confirm plan change modal if an invoice is returned after clicking upgrade', async () => {
    axiosMock.onPost('http://talo.test/billing/checkout-session').replyOnce(200, {
      invoice: {
        lines: [],
        total: 13300,
        prorationDate: Math.floor(new Date() / 1000),
        collectionDate: Math.floor(new Date(2022, 10, 12) / 1000)
      }
    })

    const assignMock = vi.fn()
    delete window.location
    window.location = { assign: assignMock }

    render(
      <PricingPlanTile
        plan={{
          id: 1,
          actions: [
            { id: 1, type: 0, limit: 5, trackedMonthly: false },
            { id: 2, type: 1, limit: 8, trackedMonthly: true }
          ],
          name: 'Team plan',
          prices: [
            { amount: 5999, currency: 'usd', interval: 'year' },
            { amount: 499, currency: 'usd', interval: 'month' }
          ]
        }}
        displayInterval='month'
        planLoadingState={[null, vi.fn()]}
        currentPlanPrice={{ amount: 0, currency: 'usd', interval: 'month' }}
      />
    )

    await userEvent.click(screen.getByText('Upgrade'))

    expect(await screen.findByText('Upcoming invoice')).toBeInTheDocument()
  })

  it('should render the confirm plan change modal if an invoice is returned after clicking upgrade', async () => {
    axiosMock.onPost('http://talo.test/billing/checkout-session').networkErrorOnce()

    const assignMock = vi.fn()
    delete window.location
    window.location = { assign: assignMock }

    render(
      <PricingPlanTile
        plan={{
          id: 1,
          actions: [
            { id: 1, type: 0, limit: 5, trackedMonthly: false },
            { id: 2, type: 1, limit: 8, trackedMonthly: true }
          ],
          name: 'Team plan',
          prices: [
            { amount: 5999, currency: 'usd', interval: 'year' },
            { amount: 499, currency: 'usd', interval: 'month' }
          ]
        }}
        displayInterval='month'
        planLoadingState={[null, vi.fn()]}
        currentPlanPrice={{ amount: 0, currency: 'usd', interval: 'month' }}
      />
    )

    await userEvent.click(screen.getByText('Upgrade'))

    expect(await screen.findByText('Network Error')).toHaveAttribute('role', 'alert')
  })
})
