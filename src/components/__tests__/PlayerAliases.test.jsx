import React from 'react'
import { render, screen } from '@testing-library/react'
import PlayerAliases from '../PlayerAliases'

describe('<PlayerAliases />', () => {
  it('should render aliases', () => {
    const aliases = [
      { service: 'steam', identifier: 'yxre12' },
      { service: 'username', identifier: 'ryet12' },
      { service: 'epic', identifier: 'epic_23rd' }
    ]

    render(<PlayerAliases aliases={aliases} />)

    for (const alias of aliases) {
      expect(screen.getByText(alias.identifier)).toBeInTheDocument()
    }
  })

  it('should render none if the player has none', () => {
    const aliases = []

    render(<PlayerAliases aliases={aliases} />)

    expect(screen.getByText('None')).toBeInTheDocument()
  })
})
