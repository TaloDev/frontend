import { render, screen, waitFor } from '@testing-library/react'
import api from '../../../api/api'
import MockAdapter from 'axios-mock-adapter'
import userEvent from '@testing-library/user-event'
import PricingPlanTile from '../PricingPlanTile'
import pricingPlanMock from '../../../__mocks__/pricingPlanMock'

describe('<PricingPlanTile />', () => {
  const axiosMock = new MockAdapter(api)

  it('should render the correct amount for the display interval', () => {
    render(
      <PricingPlanTile
        plan={pricingPlanMock()}
        displayInterval='month'
        planLoadingState={[null, vi.fn()]}
      />
    )

    expect(screen.getByText('$4.99 / month')).toBeInTheDocument()
  })

  it('should render a free price', () => {
    render(
      <PricingPlanTile
        plan={pricingPlanMock({
          prices: [
            { amount: 0, currency: 'usd', interval: 'year', current: false },
            { amount: 0, currency: 'usd', interval: 'month', current: false }
          ]
        })}
        displayInterval='month'
        planLoadingState={[null, vi.fn()]}
      />
    )

    expect(screen.getByText('Free forever')).toBeInTheDocument()
  })

  it('should correctly format limits', () => {
    render(
      <PricingPlanTile
        plan={pricingPlanMock({
          playerLimit: 10000
        })}
        displayInterval='month'
        planLoadingState={[null, vi.fn()]}
      />
    )

    expect(screen.getByText('10,000')).toBeInTheDocument()
  })

  it('should render a contact us link for the custom plan', () => {
    render(
      <PricingPlanTile
        custom
        displayInterval='month'
        planLoadingState={[null, vi.fn()]}
      />
    )

    expect(screen.getByText('Custom Plan')).toBeInTheDocument()

    expect(screen.getByRole('link')).toBeInTheDocument()
    expect(screen.getByText('contact us')).toBeInTheDocument()
  })

  it('should render the cta as upgrade if the plan has a higher price than the current price', () => {
    render(
      <PricingPlanTile
        plan={pricingPlanMock()}
        displayInterval='month'
        planLoadingState={[null, vi.fn()]}
        currentPlanPrice={{ amount: 0, currency: 'usd', interval: 'month', current: true }}
      />
    )

    expect(screen.getByText('Upgrade')).toBeInTheDocument()
  })

  it('should fallback the cta to an upgrade if there is no current price', () => {
    render(
      <PricingPlanTile
        plan={pricingPlanMock()}
        displayInterval='month'
        planLoadingState={[null, vi.fn()]}
      />
    )

    expect(screen.getByText('Upgrade')).toBeInTheDocument()
  })

  it('should render the cta as change plan if the plan has a higher price than the current price', () => {
    render(
      <PricingPlanTile
        plan={pricingPlanMock()}
        displayInterval='month'
        planLoadingState={[null, vi.fn()]}
        currentPlanPrice={{ amount: 7999, currency: 'usd', interval: 'month', current: false }}
      />
    )

    expect(screen.getByText('Change plan')).toBeInTheDocument()
  })

  it('should redirect after clicking upgrade', async () => {
    axiosMock.onPost('http://talo.api/billing/checkout-session').replyOnce(200, {
      redirect: 'http://stripe.com/portal'
    })

    const assignMock = vi.fn()
    Object.defineProperty(window, 'location', {
      value: { assign: assignMock }
    })

    render(
      <PricingPlanTile
        plan={pricingPlanMock()}
        displayInterval='month'
        planLoadingState={[null, vi.fn()]}
        currentPlanPrice={{ amount: 0, currency: 'usd', interval: 'month', current: true }}
      />
    )

    await userEvent.click(screen.getByText('Upgrade'))

    await waitFor(() => {
      expect(assignMock).toHaveBeenCalledWith('http://stripe.com/portal')
    })
  })

  it('should render the confirm plan change modal if an invoice is returned after clicking upgrade', async () => {
    axiosMock.onPost('http://talo.api/billing/checkout-session').replyOnce(200, {
      invoice: {
        lines: [],
        total: 13300,
        prorationDate: Math.floor(new Date().getTime() / 1000),
        collectionDate: Math.floor(new Date(2022, 10, 12).getTime() / 1000)
      }
    })

    const assignMock = vi.fn()
    Object.defineProperty(window, 'location', {
      value: { assign: assignMock }
    })

    render(
      <PricingPlanTile
        plan={pricingPlanMock()}
        displayInterval='month'
        planLoadingState={[null, vi.fn()]}
        currentPlanPrice={{ amount: 0, currency: 'usd', interval: 'month', current: true }}
      />
    )

    await userEvent.click(screen.getByText('Upgrade'))

    expect(await screen.findByText('Upcoming invoice')).toBeInTheDocument()
  })

  it('should render the confirm plan change modal if an invoice is returned after clicking upgrade', async () => {
    axiosMock.onPost('http://talo.api/billing/checkout-session').networkErrorOnce()

    const assignMock = vi.fn()
    Object.defineProperty(window, 'location', {
      value: { assign: assignMock }
    })

    render(
      <PricingPlanTile
        plan={pricingPlanMock()}
        displayInterval='month'
        planLoadingState={[null, vi.fn()]}
        currentPlanPrice={{ amount: 0, currency: 'usd', interval: 'month', current: true }}
      />
    )

    await userEvent.click(screen.getByText('Upgrade'))

    expect(await screen.findByText('Network Error')).toHaveAttribute('role', 'alert')
  })
})
