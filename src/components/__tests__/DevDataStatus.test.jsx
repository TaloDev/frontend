import React from 'react'
import { render, screen } from '@testing-library/react'
import devDataState from '../../state/devDataState'
import DevDataStatus from '../DevDataStatus'
import KitchenSink from '../../utils/KitchenSink'

describe('<DevDataStatus />', () => {
  it('should render the not enabled state', () => {
    render(
      <KitchenSink states={[{ node: devDataState, initialValue: false }]}>
        <DevDataStatus />
      </KitchenSink>
    )

    expect(screen.getByText('not enabled')).toBeInTheDocument()
  })

  it('should render the enabled state', () => {
    render(
      <KitchenSink states={[{ node: devDataState, initialValue: true }]}>
        <DevDataStatus />
      </KitchenSink>
    )

    expect(screen.queryByText('not enabled')).not.toBeInTheDocument()
    expect(screen.getByText('enabled')).toBeInTheDocument()
  })
})
