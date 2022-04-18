import React from 'react'
import { render, screen } from '@testing-library/react'
import { Router, Route } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import Title from '../Title'

describe('<Title />', () => {
  it('should go back', () => {
    const history = createMemoryHistory()
    history.push('/players')
    history.push('/players/1/props')

    render(
      <Router history={history}>
        <Route exact path='/players' component={() => <Title>Players</Title>} />
        <Route exact path='/players/:id/props' component={() => <Title showBackButton>Player Props</Title>} />
      </Router>
    )

    expect(screen.getByText('Player Props')).toBeInTheDocument()

    userEvent.click(screen.getByLabelText('Go back'))

    expect(screen.getByText('Players')).toBeInTheDocument()
  })
})
