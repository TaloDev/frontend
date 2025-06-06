import { render, screen } from '@testing-library/react'
import api from '../../api/api'
import MockAdapter from 'axios-mock-adapter'
import KitchenSink from '../../utils/KitchenSink'
import userState from '../../state/userState'
import activeGameState from '../../state/activeGameState'
import devDataState from '../../state/devDataState'
import Dashboard from '../Dashboard'
import userEvent from '@testing-library/user-event'
import { PlayerGroupRuleMode } from '../../entities/playerGroup'

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
    axiosMock.onGet(/\/games\/\d\/headlines\/total_sessions/).replyOnce(200, {
      count: 122
    })
    axiosMock.onGet(/\/games\/\d\/headlines\/average_session_duration/).replyOnce(200, {
      hours: 2,
      minutes: 30,
      seconds: 45
    })
    axiosMock.onGet(/\/games\/\d\/headlines\/total_players/).replyOnce(200, {
      count: 150030
    })
    axiosMock.onGet(/\/games\/\d\/headlines\/online_players/).replyOnce(200, {
      count: 2094
    })

    axiosMock.onGet(/\/games\/\d\/player-groups\/pinned/).replyOnce(200, {
      groups: [
        {
          id: '1',
          name: 'Winners',
          description: 'Players who have won the game',
          rules: [],
          ruleMode: PlayerGroupRuleMode.AND,
          count: 0,
          updatedAt: new Date().toISOString()
        }
      ]
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
    expect(await screen.findByText('Returning players')).toBeInTheDocument()
    expect(await screen.findByText('Total sessions')).toBeInTheDocument()
    expect(await screen.findByText('Average session duration')).toBeInTheDocument()
    expect(await screen.findByText('New events')).toBeInTheDocument()
    expect(await screen.findByText('Unique event submitters')).toBeInTheDocument()

    expect(await screen.findByText('Stat A')).toBeInTheDocument()
    expect(await screen.findByText('Stat B')).toBeInTheDocument()

    expect(await screen.findByText('150,030')).toBeInTheDocument()
    expect(await screen.findByText('2,094')).toBeInTheDocument()
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
    axiosMock.onGet(/\/games\/\d\/headlines\/total_sessions/).replyOnce(200, {
      count: 122
    })
    axiosMock.onGet(/\/games\/\d\/headlines\/average_session_duration/).replyOnce(200, {
      hours: 2,
      minutes: 30,
      seconds: 45
    })

    await userEvent.click(screen.getByText('This year'))

    expect(await screen.findByText('2,103')).toBeInTheDocument()
  })

  it('should render headline, pinned group and stat errors', async () => {
    axiosMock.reset()
    axiosMock.onGet(/\/games\/\d\/headlines\/new_players/).networkErrorOnce()
    axiosMock.onGet(/\/games\/\d\/headlines\/returning_players/).networkErrorOnce()
    axiosMock.onGet(/\/games\/\d\/headlines\/events/).networkErrorOnce()
    axiosMock.onGet(/\/games\/\d\/headlines\/unique_event_submitters/).networkErrorOnce()
    axiosMock.onGet(/\/games\/\d\/headlines\/total_sessions/).networkErrorOnce()
    axiosMock.onGet(/\/games\/\d\/headlines\/average_session_duration/).networkErrorOnce()
    axiosMock.onGet(/\/games\/\d\/player-groups\/pinned/).networkErrorOnce()
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

    // easier to mock localStorage
    window.sessionStorage = window.localStorage

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
