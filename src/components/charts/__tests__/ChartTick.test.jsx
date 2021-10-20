import React from 'react'
import { render, screen } from '@testing-library/react'
import ChartTick from '../ChartTick'

describe('<ChartTick />', () => {
  it('should correctly format labels', () => {
    render(
      <svg>
        <ChartTick
          payload={{ value: '1995-11-12 23:05:00' }}
          formatter={(tick) => tick.split(' ')[0]}
          transform={jest.fn()}
        />
      </svg>
    )

    expect(screen.getByText('1995-11-12')).toBeInTheDocument()
  })
})
