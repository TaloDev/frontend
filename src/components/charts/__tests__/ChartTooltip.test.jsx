import React from 'react'
import { render } from '@testing-library/react'
import { expect } from '@esm-bundle/chai'
import ChartTooltip from '../ChartTooltip'

describe('<ChartTooltip />', () => {
  it('should only show events where the count is greater than 0', () => {
    const wrapper = render(
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

    expect(wrapper.getAllByRole('listitem')).to.have.lengthOf(1)
  })

  it('should only render unique event names', () => {
    const wrapper = render(
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

    expect(wrapper.getAllByRole('listitem')).to.have.lengthOf(2)
  })
})
