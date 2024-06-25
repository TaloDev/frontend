import MockAdapter from 'axios-mock-adapter'
import api from '../../api/api'
import { render, screen, within } from '@testing-library/react'
import Billing from '../Billing'
import KitchenSink from '../../utils/KitchenSink'
import userState from '../../state/userState'
import userEvent from '@testing-library/user-event'
import { UserType } from '../../entities/user'

describe('<Billing />', () => {
  const axiosMock = new MockAdapter(api)

  const orgPlan = {
    pricingPlan: {
      id: 1,
      stripeId: 'prod_LcO5U04wEGWgMP',
      hidden: false,
      default: true,
      actions: [],
      name: 'Indie Plan',
      prices: [
        {
          amount: 0,
          currency: 'usd',
          interval: 'year',
          current: false
        },
        {
          amount: 0,
          currency: 'usd',
          interval: 'month',
          current: false
        }
      ]
    },
    status: 'active',
    endDate: null,
    canViewBillingPortal: true
  }

  const userValue = {
    type: UserType.OWNER,
    organisation: {
      pricingPlan: {
        status: 'active'
      }
    }
  }

  const pricingPlans = [
    {
      id: 1,
      stripeId: 'prod_LcO5U04wEGWgMP',
      hidden: false,
      default: true,
      actions: [],
      name: 'Indie Plan',
      prices: [
        {
          amount: 0,
          currency: 'usd',
          interval: 'year',
          current: false
        },
        {
          amount: 0,
          currency: 'usd',
          interval: 'month',
          current: false
        }
      ]
    },
    {
      id: 2,
      stripeId: 'prod_LbW295xhmo2bk0',
      hidden: false,
      default: false,
      actions: [],
      name: 'Team Plan',
      prices: [
        {
          amount: 6399,
          currency: 'usd',
          interval: 'year',
          current: false
        },
        {
          amount: 599,
          currency: 'usd',
          interval: 'month',
          current: false
        }
      ]
    },
    {
      id: 3,
      stripeId: 'prod_LcNy4ow2VoJ8kc',
      hidden: false,
      default: false,
      actions: [],
      name: 'Business Plan',
      prices: [
        {
          amount: 21499,
          currency: 'usd',
          interval: 'year',
          current: false
        },
        {
          amount: 1999,
          currency: 'usd',
          interval: 'month',
          current: true
        }
      ]
    }
  ]

  const usage = {
    0: {
      limit: 5,
      used: 3
    },
    1: {
      limit: 8,
      used: 1
    }
  }

  it('should render the current plan and the other returned plans', async () => {
    axiosMock.onGet('http://talo.api/billing/organisation-plan').replyOnce(200, { pricingPlan: orgPlan })
    axiosMock.onGet('http://talo.api/billing/plans').replyOnce(200, { pricingPlans })
    axiosMock.onGet('http://talo.api/billing/usage').replyOnce(200, { usage })

    render(
      <KitchenSink states={[{ node: userState, initialValue: userValue }]}>
        <Billing />
      </KitchenSink>
    )

    for (const plan of pricingPlans) {
      expect(await screen.findByText(plan.name)).toBeInTheDocument()
    }
  })

  it('should correctly highlight the current plan', async () => {
    axiosMock.onGet('http://talo.api/billing/organisation-plan').replyOnce(200, { pricingPlan: orgPlan })
    axiosMock.onGet('http://talo.api/billing/plans').replyOnce(200, { pricingPlans })
    axiosMock.onGet('http://talo.api/billing/usage').replyOnce(200, { usage })

    render(
      <KitchenSink states={[{ node: userState, initialValue: userValue }]}>
        <Billing />
      </KitchenSink>
    )

    const currentPlanContent = await screen.findByText('Current plan')

    expect(within(currentPlanContent.parentElement!).getByText('Indie Plan')).toBeInTheDocument()
    expect(within(currentPlanContent.parentElement!).getByText('Free forever')).toBeInTheDocument()
  })

  it('should render the expiration notice if the plan is ending', async () => {
    const pricingPlan = {
      ...orgPlan,
      endDate: new Date(2022, 2, 2)
    }

    axiosMock.onGet('http://talo.api/billing/organisation-plan').replyOnce(200, { pricingPlan })
    axiosMock.onGet('http://talo.api/billing/plans').replyOnce(200, { pricingPlans })
    axiosMock.onGet('http://talo.api/billing/usage').replyOnce(200, { usage })

    render(
      <KitchenSink states={[{ node: userState, initialValue: userValue }]}>
        <Billing />
      </KitchenSink>
    )

    expect(await screen.findByText('Your plan expires on 2nd Mar 2022')).toBeInTheDocument()
  })

  it('should not render the billing portal tile if they cannot view it', async () => {
    const pricingPlan = {
      ...orgPlan,
      canViewBillingPortal: false
    }

    axiosMock.onGet('http://talo.api/billing/organisation-plan').replyOnce(200, { pricingPlan })
    axiosMock.onGet('http://talo.api/billing/plans').replyOnce(200, { pricingPlans })
    axiosMock.onGet('http://talo.api/billing/usage').replyOnce(200, { usage })

    render(
      <KitchenSink states={[{ node: userState, initialValue: userValue }]}>
        <Billing />
      </KitchenSink>
    )

    expect(await screen.findByText('Current plan')).toBeInTheDocument()
    expect(screen.queryByText('Billing details')).not.toBeInTheDocument()
  })

  it('should handle organisation plan errors', async () => {
    axiosMock.onGet('http://talo.api/billing/organisation-plan').networkErrorOnce()
    axiosMock.onGet('http://talo.api/billing/plans').replyOnce(200, { pricingPlans })
    axiosMock.onGet('http://talo.api/billing/usage').replyOnce(200, { usage })

    render(
      <KitchenSink states={[{ node: userState, initialValue: userValue }]}>
        <Billing />
      </KitchenSink>
    )

    expect(await screen.findByText('Network Error')).toBeInTheDocument()
  })

  it('should handle pricing plan errors', async () => {
    axiosMock.onGet('http://talo.api/billing/organisation-plan').replyOnce(200, { pricingPlan: orgPlan })
    axiosMock.onGet('http://talo.api/billing/plans').networkErrorOnce()
    axiosMock.onGet('http://talo.api/billing/usage').replyOnce(200, { usage })

    render(
      <KitchenSink states={[{ node: userState, initialValue: userValue }]}>
        <Billing />
      </KitchenSink>
    )

    expect(await screen.findByText('Network Error')).toBeInTheDocument()

    for (const plan of pricingPlans) {
      expect(screen.queryByText(plan.name)).not.toBeInTheDocument()
    }
  })

  it('should handle pricing plan and organisation plan errors', async () => {
    axiosMock.onGet('http://talo.api/billing/organisation-plan').networkErrorOnce()
    axiosMock.onGet('http://talo.api/billing/plans').networkErrorOnce()
    axiosMock.onGet('http://talo.api/billing/usage').replyOnce(200, { usage })

    render(
      <KitchenSink states={[{ node: userState, initialValue: userValue }]}>
        <Billing />
      </KitchenSink>
    )

    expect(await screen.findByText('Network Error')).toBeInTheDocument()
    expect(screen.queryByText('Other plans')).not.toBeInTheDocument()
  })

  it('should not render other plans if the organisation plan is hidden', async () => {
    const pricingPlan = {
      ...orgPlan,
      pricingPlan: {
        ...orgPlan.pricingPlan,
        hidden: true
      }
    }

    axiosMock.onGet('http://talo.api/billing/organisation-plan').replyOnce(200, { pricingPlan })
    axiosMock.onGet('http://talo.api/billing/plans').replyOnce(200, { pricingPlans })
    axiosMock.onGet('http://talo.api/billing/usage').replyOnce(200, { usage })

    render(
      <KitchenSink states={[{ node: userState, initialValue: userValue }]}>
        <Billing />
      </KitchenSink>
    )

    expect(await screen.findByText('Current plan')).toBeInTheDocument()
    expect(screen.queryByText('Other plans')).not.toBeInTheDocument()
  })

  it('should render the custom plan', async () => {
    axiosMock.onGet('http://talo.api/billing/organisation-plan').replyOnce(200, { pricingPlan: orgPlan })
    axiosMock.onGet('http://talo.api/billing/plans').replyOnce(200, { pricingPlans })
    axiosMock.onGet('http://talo.api/billing/usage').replyOnce(200, { usage })

    render(
      <KitchenSink states={[{ node: userState, initialValue: userValue }]}>
        <Billing />
      </KitchenSink>
    )

    expect(await screen.findByText('Custom Plan')).toBeInTheDocument()
  })

  it('should switch between monthly and yearly pricing', async () => {
    axiosMock.onGet('http://talo.api/billing/organisation-plan').replyOnce(200, { pricingPlan: orgPlan })
    axiosMock.onGet('http://talo.api/billing/plans').replyOnce(200, { pricingPlans })
    axiosMock.onGet('http://talo.api/billing/usage').replyOnce(200, { usage })

    render(
      <KitchenSink states={[{ node: userState, initialValue: userValue }]}>
        <Billing />
      </KitchenSink>
    )

    expect(await screen.findAllByText(/99 \/ month/)).toHaveLength(pricingPlans.length - 1)
    expect(screen.queryAllByText(/99 \/ year/)).toHaveLength(0)

    await userEvent.click(screen.getByRole('checkbox'))
    expect(await screen.findAllByText(/99 \/ year/)).toHaveLength(pricingPlans.length - 1)
    expect(screen.queryAllByText(/99 \/ month/)).toHaveLength(0)

    await userEvent.click(screen.getByRole('checkbox'))
    expect(await screen.findAllByText(/99 \/ month/)).toHaveLength(pricingPlans.length - 1)
    expect(screen.queryAllByText(/99 \/ year/)).toHaveLength(0)
  })
})
