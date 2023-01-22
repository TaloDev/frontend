import { render, screen } from '@testing-library/react'
import api from '../../api/api'
import MockAdapter from 'axios-mock-adapter'
import KitchenSink from '../../utils/KitchenSink'
import userState from '../../state/userState'
import activeGameState from '../../state/activeGameState'
import devDataState from '../../state/devDataState'
import Dashboard from '../Dashboard'
import userEvent from '@testing-library/user-event'

describe('<Dashboard />', () => {
  const axiosMock = new MockAdapter(api)

  beforeEach(() => {
    axiosMock.onGet(/\/games\/\d\/headlines\/new_players/).replyOnce(200, {
      count: 3
    })
    axiosMock.onGet(/\/games\/\d\/headlines\/returning_players/).replyOnce(200, {
      count: 1
    })
    axiosMock.onGet(/\/games\/\d\/headlines\/events/).replyOnce(200, {
      count: 104
    })
    axiosMock.onGet(/\/games\/\d\/headlines\/unique_event_submitters/).replyOnce(200, {
      count: 8
    })
  })

  axiosMock.onGet(/\/game-stats/).reply(200, {
    stats: [
      { id: 1, global: true, name: 'Stat A', globalValue: 10 },
      { id: 2, global: true, name: 'Stat B', globalValue: 30 }
    ]
  })

  it('should render an empty state if there is no active game', async () => {
    render(
      <KitchenSink
        states={[
          { node: userState, initialValue: {} },
          { node: devDataState, initialValue: false }
        ]}
      >
        <Dashboard />
      </KitchenSink>
    )

    expect(await screen.findByText('Welcome to Talo! To get started, create a new game using the button in the top right')).toBeInTheDocument()
  })

  it('should render the dashboard for an existing game', async () => {
    render(
      <KitchenSink
        states={[
          { node: userState, initialValue: {} },
          { node: activeGameState, initialValue: { id: 1, name: 'Swerve City' } },
          { node: devDataState, initialValue: false }
        ]}
      >
        <Dashboard />
      </KitchenSink>
    )

    expect(await screen.findByText('Swerve City dashboard')).toBeInTheDocument()

    expect(await screen.findByText('New players')).toBeInTheDocument()
    expect(screen.getByText('Returning players')).toBeInTheDocument()
    expect(screen.getByText('New events')).toBeInTheDocument()
    expect(screen.getByText('Unique event submitters')).toBeInTheDocument()

    expect(await screen.findByText('Stat A')).toBeInTheDocument()
    expect(screen.getByText('Stat B')).toBeInTheDocument()
  })

  it('should be able to change the time period for headlines', async () => {
    render(
      <KitchenSink
        states={[
          { node: userState, initialValue: {} },
          { node: activeGameState, initialValue: { id: 2, name: 'Swerve City' } },
          { node: devDataState, initialValue: false }
        ]}
      >
        <Dashboard />
      </KitchenSink>
    )

    expect(await screen.findByText('Swerve City dashboard')).toBeInTheDocument()

    expect(await screen.findByText('New players')).toBeInTheDocument()

    axiosMock.reset()
    axiosMock.onGet(/\/games\/\d\/headlines\/new_players/).replyOnce(200, {
      count: 3
    })
    axiosMock.onGet(/\/games\/\d\/headlines\/returning_players/).replyOnce(200, {
      count: 1
    })
    axiosMock.onGet(/\/games\/\d\/headlines\/events/).replyOnce(200, {
      count: 2103
    })
    axiosMock.onGet(/\/games\/\d\/headlines\/unique_event_submitters/).replyOnce(200, {
      count: 8
    })

    await userEvent.click(screen.getByText('This year'))

    expect(await screen.findByText('2103')).toBeInTheDocument()
  })

  it('should render headline and stat errors', async () => {
    axiosMock.reset()
    axiosMock.onGet(/\/games\/\d\/headlines\/new_players/).networkErrorOnce()
    axiosMock.onGet(/\/games\/\d\/headlines\/returning_players/).networkErrorOnce()
    axiosMock.onGet(/\/games\/\d\/headlines\/events/).networkErrorOnce()
    axiosMock.onGet(/\/games\/\d\/headlines\/unique_event_submitters/).networkErrorOnce()
    axiosMock.onGet(/\/games\/\d\/game-stats/).networkErrorOnce()

    render(
      <KitchenSink
        states={[
          { node: userState, initialValue: {} },
          { node: activeGameState, initialValue: { id: 3, name: 'Swerve City' } },
          { node: devDataState, initialValue: false }
        ]}
      >
        <Dashboard />
      </KitchenSink>
    )

    expect(await screen.findByText('Swerve City dashboard')).toBeInTheDocument()

    expect(await screen.findByText('Couldn\'t fetch headlines')).toBeInTheDocument()
    expect(await screen.findByText('Couldn\'t fetch stats')).toBeInTheDocument()
  })

  it('should go to the intended route', () => {
    const locationMock = vi.fn()
    window.localStorage.setItem('intendedRoute', '/players')

    render(
      <KitchenSink
        states={[
          { node: userState, initialValue: {} },
          { node: activeGameState, initialValue: { id: 4, name: 'Swerve City' } },
          { node: devDataState, initialValue: false }
        ]}
        setLocation={locationMock}
      >
        <Dashboard />
      </KitchenSink>
    )

    expect(locationMock).toHaveBeenCalledWith({ pathname: '/players', state: null })
  })
})
