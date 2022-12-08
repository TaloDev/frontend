import { render, screen } from '@testing-library/react'
import React from 'react'
import PlayerIdentifier from '../PlayerIdentifier'

describe('<PlayerIdentifier />', () => {
  it('should render player identifiers for players not from dev build', () => {
    render(<PlayerIdentifier player={{ id: '2a5adaba-fad2-471e-8ec1-47b9b24b5d3a', devBuild: false }} />)

    expect(screen.getByText('Player = 2a5adaba-fad2-471e-8ec1-47b9b24b5d3a')).toBeInTheDocument()
    expect(screen.queryByText('DEV')).not.toBeInTheDocument()
  })

  it('should render player identifiers for players from dev build', () => {
    render(<PlayerIdentifier player={{ id: 'f32be3f4-531c-4d28-97ab-1f7dc465cc65', devBuild: true }} />)

    expect(screen.getByText('Player = f32be3f4-531c-4d28-97ab-1f7dc465cc65')).toBeInTheDocument()
    expect(screen.getByText('DEV')).toBeInTheDocument()
  })
})
