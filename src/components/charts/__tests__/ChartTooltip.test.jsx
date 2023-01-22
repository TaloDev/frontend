import { render, screen } from '@testing-library/react'
import ChartTooltip from '../ChartTooltip'

describe('<ChartTooltip />', () => {
  it('should only show events where the count is greater than 0', () => {
    render(
      <ChartTooltip
        active
        payload={[
          {
            payload: {
              count: 0,
              name: 'Treasure discovered'
            }
          },
          {
            payload: {
              count: 3,
              name: 'Item looted'
            }
          }
        ]}
        label='2021-01-01 19:00:00'
      />
    )

    expect(screen.getAllByRole('listitem')).toHaveLength(1)
  })

  it('should only render unique event names', () => {
    render(
      <ChartTooltip
        active
        payload={[
          {
            payload: {
              count: 0,
              name: 'Treasure discovered'
            }
          },
          {
            payload: {
              count: 2,
              name: 'Treasure discovered'
            }
          },
          {
            payload: {
              count: 3,
              name: 'Item looted'
            }
          }
        ]}
        label='2021-01-01 19:00:00'
      />
    )

    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('should not render if there are no items with a count greater than 0', () => {
    render(
      <ChartTooltip
        active
        payload={[
          {
            payload: {
              count: 0,
              name: 'Treasure discovered'
            }
          },
          {
            payload: {
              count: 0,
              name: 'Item looted'
            }
          }
        ]}
        label='2021-01-01 19:00:00'
      />
    )

    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })
})
