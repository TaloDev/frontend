import React from 'react'
import { render, screen } from '@testing-library/react'
import PlayerAliases from '../PlayerAliases'

describe('<PlayerAliases />', () => {
  it('should render an alias', () => {
    const aliases = [
      { service: 'steam', identifier: 'yxre12' }
    ]

    render(<PlayerAliases aliases={aliases} />)

    expect(screen.getByText(aliases[0].identifier)).toBeInTheDocument()
  })

  it('should render the first alias and an indicator for how many more', () => {
    const aliases = [
      { service: 'steam', identifier: 'yxre12' },
      { service: 'username', identifier: 'ryet12' },
      { service: 'epic', identifier: 'epic_23rd' }
    ]

    render(<PlayerAliases aliases={aliases} />)

    expect(screen.getByText(aliases[0].identifier)).toBeInTheDocument()
    expect(screen.getByText('+ 2 more')).toBeInTheDocument()
  })

  it('should render none if the player has none', () => {
    const aliases = []

    render(<PlayerAliases aliases={aliases} />)

    expect(screen.getByText('None')).toBeInTheDocument()
  })
})
