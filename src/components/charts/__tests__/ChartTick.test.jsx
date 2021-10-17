import React from 'react'
import { render } from '@testing-library/react'
import { expect } from '@esm-bundle/chai'
import ChartTick from '../ChartTick'
import { mock } from 'sinon'

describe('<ChartTick />', () => {
  it('should correctly format labels', () => {
    const wrapper = render(
      <svg>
        <ChartTick
          payload={{ value: '1995-11-12 23:05:00' }}
          formatter={(tick) => tick.split(' ')[0]}
          transform={mock()}
        />
      </svg>
    )

    expect(wrapper.getByText('1995-11-12')).to.exist
  })
})
