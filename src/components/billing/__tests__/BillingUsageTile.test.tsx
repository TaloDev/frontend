import { render, screen } from '@testing-library/react'
import buildError from '../../../utils/buildError'
import KitchenSink from '../../../utils/KitchenSink'
import BillingUsageTile from '../BillingUsageTile'

describe('<BillingUsageTile />', () => {
  it('should render player usages', () => {
    render(
      <KitchenSink>
        <BillingUsageTile
          usage={{
            limit: 5,
            used: 3,
          }}
          usageError={null}
        />
      </KitchenSink>,
    )

    expect(screen.getByText('Players')).toBeInTheDocument()
    expect(screen.getByText('3 / 5')).toBeInTheDocument()
  })

  it('should handle usage errors', async () => {
    render(
      <KitchenSink>
        <BillingUsageTile
          usage={{ limit: 0, used: 0 }}
          usageError={buildError(new Error('Network Error'))}
        />
      </KitchenSink>,
    )

    expect(await screen.findByText('Network Error')).toHaveAttribute('role', 'alert')
  })
})
