import React from 'react'
import { render, screen, within } from '@testing-library/react'
import api from '../../../api/api'
import MockAdapter from 'axios-mock-adapter'
import BillingUsageTile from '../BillingUsageTile'
import pricingPlanActionTypes from '../../../constants/pricingPlanActionTypes'
import KitchenSink from '../../../utils/KitchenSink'

describe('<BillingUsageTile />', () => {
  const axiosMock = new MockAdapter(api)

  it('should render each plan action and its usage', async () => {
    axiosMock.onGet('http://talo.test/billing/usage').replyOnce(200, {
      usage: {
        0: {
          limit: 5,
          used: 3
        },
        1: {
          limit: 8,
          used: 1
        }
      }
    })

    render(<BillingUsageTile />, { wrapper: KitchenSink })

    const list = await screen.findByRole('list')
    const actions = within(list).getAllByRole('listitem')
    expect (actions).toHaveLength(2)

    expect(within(actions[0]).getByText(pricingPlanActionTypes[0])).toBeInTheDocument()
    expect(within(actions[0]).getByText('3/5')).toBeInTheDocument()

    expect(within(actions[1]).getByText(pricingPlanActionTypes[1])).toBeInTheDocument()
    expect(within(actions[1]).getByText('1/8')).toBeInTheDocument()
  })

  it('should handle usage errors', async () => {
    axiosMock.onGet('http://talo.test/billing/usage').networkErrorOnce()

    render(<BillingUsageTile />, { wrapper: KitchenSink })

    expect(await screen.findByText('Network Error')).toHaveAttribute('role', 'alert')
  })
})
