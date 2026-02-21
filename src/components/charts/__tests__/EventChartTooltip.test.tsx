import { render, screen } from '@testing-library/react'
import { EventChartTooltip } from '../EventChartTooltip'

const listItemsPerEvent = 3

describe('<EventChartTooltip />', () => {
  it('should only show events where the count is greater than 0', () => {
    render(
      <EventChartTooltip
        active
        payload={[
          {
            payload: {
              count: 0,
              name: 'Treasure discovered',
              change: 0,
              date: 1612147200000,
            },
          },
          {
            payload: {
              count: 3,
              name: 'Item looted',
              change: 1,
              date: 1612147200000,
            },
          },
        ]}
        label='2021-01-01 19:00:00'
      />,
    )

    expect(screen.getAllByRole('listitem')).toHaveLength(1 * listItemsPerEvent)
  })

  it('should only render unique event names', () => {
    render(
      <EventChartTooltip
        active
        payload={[
          {
            payload: {
              count: 0,
              name: 'Treasure discovered',
              change: 0,
              date: 1612147200000,
            },
          },
          {
            payload: {
              count: 2,
              name: 'Treasure discovered',
              change: 0,
              date: 1612147200000,
            },
          },
          {
            payload: {
              count: 3,
              name: 'Item looted',
              change: 0,
              date: 1612147200000,
            },
          },
        ]}
        label='2021-01-01 19:00:00'
      />,
    )

    expect(screen.getAllByRole('listitem')).toHaveLength(2 * listItemsPerEvent)
  })

  it('should not render if there are no items with a count greater than 0', () => {
    render(
      <EventChartTooltip
        active
        payload={[
          {
            payload: {
              count: 0,
              name: 'Treasure discovered',
              change: 0,
              date: 1612147200000,
            },
          },
          {
            payload: {
              count: 0,
              name: 'Item looted',
              change: 0,
              date: 1612147200000,
            },
          },
        ]}
        label='2021-01-01 19:00:00'
      />,
    )

    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })
})
