import React from 'react'
import { render, screen } from '@testing-library/react'
import devDataState from '../../state/devDataState'
import RecoilObserver from '../../state/RecoilObserver'
import DevDataStatus from '../DevDataStatus'
import { RecoilRoot } from 'recoil'

describe('<DevDataStatus />', () => {
  it('should render the not enabled state', () => {
    render(
      <RecoilObserver node={devDataState} initialValue={false}>
        <DevDataStatus />
      </RecoilObserver>
      , { wrapper: RecoilRoot }
    )

    expect(screen.getByText('not enabled')).toBeInTheDocument()
  })

  it('should render the enabled state', () => {
    render(
      <RecoilObserver node={devDataState} initialValue={true}>
        <DevDataStatus />
      </RecoilObserver>
      , { wrapper: RecoilRoot }
    )

    expect(screen.queryByText('not enabled')).not.toBeInTheDocument()
    expect(screen.getByText('enabled')).toBeInTheDocument()
  })
})
