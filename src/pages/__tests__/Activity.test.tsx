import api from '../../api/api'
import MockAdapter from 'axios-mock-adapter'
import { render, screen } from '@testing-library/react'
import Activity from '../Activity'
import activeGameState from '../../state/activeGameState'
import { format } from 'date-fns'
import userState from '../../state/userState'
import KitchenSink from '../../utils/KitchenSink'
import { UserType } from '../../entities/user'

describe('<Activity />', () => {
  const axiosMock = new MockAdapter(api)

  it('should handle having no activities', async () => {
    axiosMock.onGet('http://talo.api/games/1/game-activities').replyOnce(200, { activities: [] })

    render(
      <KitchenSink
        states={[
          { node: userState, initialValue: { type: UserType.ADMIN } },
          { node: activeGameState, initialValue: { id: 1, name: 'Superstatic' } }
        ]}
      >
        <Activity />
      </KitchenSink>
    )

    expect(await screen.findByText('Superstatic doesn\'t have any activity yet')).toBeInTheDocument()
  })

  it('should render activities for a single day', async () => {
    const activities = [
      {
        description: 'Jeff did something',
        createdAt: '2022-01-01 19:53:00',
        extra: {
          'Player': '1234-567-89',
          'Other prop': 'another prop',
          'And another prop': 'something'
        }
      },
      {
        description: 'Jeff did something else',
        createdAt: '2022-01-01 19:58:00'
      },
      {
        description: 'Jeff did a final thing',
        createdAt: '2022-01-01 19:59:36'
      }
    ]

    axiosMock.onGet('http://talo.api/games/2/game-activities').replyOnce(200, { activities })

    render(
      <KitchenSink
        states={[
          { node: userState, initialValue: { type: UserType.ADMIN } },
          { node: activeGameState, initialValue: { id: 2, name: 'Superstatic' } }
        ]}
      >
        <Activity />
      </KitchenSink>
    )

    expect(await screen.findByText('01 Jan 2022')).toBeInTheDocument()

    for (const activity of activities) {
      expect(screen.getByText(activity.description)).toBeInTheDocument()
      expect(screen.getByText(format(new Date(activity.createdAt), 'HH:mm'))).toBeInTheDocument()
    }

    expect(screen.getByText('Player = 1234-567-89')).toBeInTheDocument()
    expect(screen.getByText('Other prop = another prop')).toBeInTheDocument()
  })

  it('should render activities for a multiple consecutive days', async () => {
    const activities = [
      {
        description: 'Jeff did something',
        createdAt: '2022-01-01 19:53:00'
      },
      {
        description: 'Jeff did something else',
        createdAt: '2022-01-02 19:58:00'
      },
      {
        description: 'Jeff did a final thing',
        createdAt: '2022-01-03 19:59:36'
      }
    ]

    axiosMock.onGet('http://talo.api/games/3/game-activities').replyOnce(200, { activities })

    render(
      <KitchenSink
        states={[
          { node: userState, initialValue: { type: UserType.ADMIN } },
          { node: activeGameState, initialValue: { id: 3, name: 'Superstatic' } }
        ]}
      >
        <Activity />
      </KitchenSink>
    )

    expect(await screen.findByText('01 Jan 2022')).toBeInTheDocument()
    expect(await screen.findByText('02 Jan 2022')).toBeInTheDocument()
    expect(await screen.findByText('03 Jan 2022')).toBeInTheDocument()

    for (const activity of activities) {
      expect(screen.getByText(activity.description)).toBeInTheDocument()
    }
  })

  it('should render activities for a multiple in-consecutive days and not show headers for days with no activity', async () => {
    const activities = [
      {
        description: 'Jeff did something',
        createdAt: '2022-01-01 19:53:00'
      },
      {
        description: 'Jeff did something else',
        createdAt: '2022-01-04 19:58:00'
      },
      {
        description: 'Jeff did a final thing',
        createdAt: '2022-01-06 19:59:36'
      }
    ]

    axiosMock.onGet('http://talo.api/games/4/game-activities').replyOnce(200, { activities })

    render(
      <KitchenSink
        states={[
          { node: userState, initialValue: { type: UserType.ADMIN } },
          { node: activeGameState, initialValue: { id: 4, name: 'Superstatic' } }
        ]}
      >
        <Activity />
      </KitchenSink>
    )

    expect(await screen.findByText('01 Jan 2022')).toBeInTheDocument()
    expect(await screen.findByText('04 Jan 2022')).toBeInTheDocument()
    expect(await screen.findByText('06 Jan 2022')).toBeInTheDocument()

    expect(screen.queryByText('02 Jan 2022')).not.toBeInTheDocument()
    expect(screen.queryByText('03 Jan 2022')).not.toBeInTheDocument()
    expect(screen.queryByText('05 Jan 2022')).not.toBeInTheDocument()

    for (const activity of activities) {
      expect(screen.getByText(activity.description)).toBeInTheDocument()
      expect(screen.getByText(format(new Date(activity.createdAt), 'HH:mm'))).toBeInTheDocument()
    }
  })

  it('should render an error', async () => {
    axiosMock.onGet('http://talo.api/games/5/game-activities').networkErrorOnce()

    render(
      <KitchenSink
        states={[
          { node: userState, initialValue: { type: UserType.ADMIN } },
          { node: activeGameState, initialValue: { id: 5, name: 'Superstatic' } }
        ]}
      >
        <Activity />
      </KitchenSink>
    )

    expect(await screen.findByRole('alert')).toBeInTheDocument()
  })
})
