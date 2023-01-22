import { render, screen, within } from '@testing-library/react'
import BillingUsageTile from '../BillingUsageTile'
import pricingPlanActionTypes from '../../../constants/pricingPlanActionTypes'
import KitchenSink from '../../../utils/KitchenSink'
import buildError from '../../../utils/buildError'

describe('<BillingUsageTile />', () => {
  it('should render each plan action and its usage', async () => {
    render(
      <KitchenSink>
        <BillingUsageTile
          usage={{
            0: {
              limit: 5,
              used: 3
            },
            1: {
              limit: 8,
              used: 1
            }
          }}
        />
      </KitchenSink>
    )

    const list = await screen.findByRole('list')
    const actions = within(list).getAllByRole('listitem')
    expect (actions).toHaveLength(2)

    expect(within(actions[0]).getByText(pricingPlanActionTypes[0])).toBeInTheDocument()
    expect(within(actions[0]).getByText('3/5')).toBeInTheDocument()

    expect(within(actions[1]).getByText(pricingPlanActionTypes[1])).toBeInTheDocument()
    expect(within(actions[1]).getByText('1/8')).toBeInTheDocument()
  })

  it('should handle usage errors', async () => {
    render(
      <KitchenSink>
        <BillingUsageTile usage={{}} usageError={buildError(new Error('Network Error'))} />
      </KitchenSink>
    )

    expect(await screen.findByText('Network Error')).toHaveAttribute('role', 'alert')
  })
})
