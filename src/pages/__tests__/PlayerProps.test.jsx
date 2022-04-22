import React from 'react'
import api from '../../api/api'
import MockAdapter from 'axios-mock-adapter'
import { render, screen, waitFor } from '@testing-library/react'
import { Router, Route } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import PlayerProps from '../PlayerProps'
import { RecoilRoot } from 'recoil'
import RecoilObserver from '../../state/RecoilObserver'
import activeGameState from '../../state/activeGameState'
import routes from '../../constants/routes'
import { createMemoryHistory } from 'history'

describe('<PlayerProps />', () => {
  // eslint-disable-next-line react/prop-types
  const PlayerPropsRoute = ({ history }) => (
    <Router history={history}>
      <Route exact path={routes.playerProps} component={PlayerProps} />
    </Router>
  )

  const basePlayer = {
    id: 'abce-efgh-ijkl-mnop',
    props: [
      {
        key: 'health',
        value: '80'
      },
      {
        key: 'level',
        value: '42'
      }
    ],
    devBuild: false
  }

  const axiosMock = new MockAdapter(api)

  it('should render current props', () => {
    const history = createMemoryHistory()
    history.push(routes.playerProps.replace(':id', basePlayer.id), {
      player: basePlayer
    })

    render(
      <RecoilObserver node={activeGameState} initialValue={{ id: 1 }}>
        <PlayerPropsRoute history={history} />
      </RecoilObserver>
      , { wrapper: RecoilRoot }
    )

    expect(screen.getByText(`Player = ${basePlayer.id}`)).toBeInTheDocument()

    for (const prop of basePlayer.props) {
      expect(screen.getByText(prop.key)).toBeInTheDocument()
      expect(screen.getByDisplayValue(prop.value)).toBeInTheDocument()
    }
  })

  it('should only enable the reset button after a change', () => {
    const history = createMemoryHistory()
    history.push(routes.playerProps.replace(':id', basePlayer.id), {
      player: basePlayer
    })

    render(
      <RecoilObserver node={activeGameState} initialValue={{ id: 1 }}>
        <PlayerPropsRoute history={history} />
      </RecoilObserver>
      , { wrapper: RecoilRoot }
    )

    expect(screen.getByText('Reset')).toBeDisabled()

    userEvent.type(screen.getByDisplayValue('80'), '{backspace}4')

    expect(screen.getByDisplayValue('84')).toBeInTheDocument()

    expect(screen.getByText('Reset')).toBeEnabled()
  })

  it('should only enable the reset a change', () => {
    const history = createMemoryHistory()
    history.push(routes.playerProps.replace(':id', basePlayer.id), {
      player: basePlayer
    })

    render(
      <RecoilObserver node={activeGameState} initialValue={{ id: 1 }}>
        <PlayerPropsRoute history={history} />
      </RecoilObserver>
      , { wrapper: RecoilRoot }
    )

    expect(screen.getByDisplayValue('80')).toBeInTheDocument()
    userEvent.type(screen.getByDisplayValue('80'), '{backspace}4')
    expect(screen.getByDisplayValue('84')).toBeInTheDocument()

    userEvent.click(screen.getByText('Reset'))
    expect(screen.queryByDisplayValue('84')).not.toBeInTheDocument()
    expect(screen.getByDisplayValue('80')).toBeInTheDocument()
  })

  it('should delete existing props', () => {
    const history = createMemoryHistory()
    history.push(routes.playerProps.replace(':id', basePlayer.id), {
      player: basePlayer
    })

    render(
      <RecoilObserver node={activeGameState} initialValue={{ id: 1 }}>
        <PlayerPropsRoute history={history} />
      </RecoilObserver>
      , { wrapper: RecoilRoot }
    )

    expect(screen.getByText('health')).toBeInTheDocument()

    userEvent.click(screen.getByLabelText('Delete health prop'))
    expect(screen.queryByText('health')).not.toBeInTheDocument()
  })

  it('should add new props', () => {
    const history = createMemoryHistory()
    history.push(routes.playerProps.replace(':id', basePlayer.id), {
      player: basePlayer
    })

    render(
      <RecoilObserver node={activeGameState} initialValue={{ id: 1 }}>
        <PlayerPropsRoute history={history} />
      </RecoilObserver>
      , { wrapper: RecoilRoot }
    )

    userEvent.click(screen.getByText('New property'))

    userEvent.type(screen.getByPlaceholderText('Property'), 'treasuresDiscovered')
    userEvent.type(screen.getByDisplayValue(''), '5')

    expect(screen.getByDisplayValue('treasuresDiscovered')).toBeInTheDocument()
    expect(screen.getByDisplayValue('5')).toBeInTheDocument()
  })

  it('should delete new props', () => {
    const history = createMemoryHistory()
    history.push(routes.playerProps.replace(':id', basePlayer.id), {
      player: basePlayer
    })

    render(
      <RecoilObserver node={activeGameState} initialValue={{ id: 1 }}>
        <PlayerPropsRoute history={history} />
      </RecoilObserver>
      , { wrapper: RecoilRoot }
    )

    userEvent.click(screen.getByText('New property'))

    userEvent.type(screen.getByPlaceholderText('Property'), 'treasuresDiscovered')

    userEvent.click(screen.getByLabelText('Delete treasuresDiscovered prop'))

    expect(screen.queryByDisplayValue('treasuresDiscovered')).not.toBeInTheDocument()
  })

  it('should load in players that are not in the location state', async () => {
    const history = createMemoryHistory()
    history.push(routes.playerProps.replace(':id', basePlayer.id))

    axiosMock.onGet(`http://talo.test/players?gameId=1&search=${basePlayer.id}`).replyOnce(200, {
      players: [basePlayer]
    })

    render(
      <RecoilObserver node={activeGameState} initialValue={{ id: 1 }}>
        <PlayerPropsRoute history={history} />
      </RecoilObserver>
      , { wrapper: RecoilRoot }
    )

    expect(await screen.findByText(`Player = ${basePlayer.id}`)).toBeInTheDocument()

    for (const prop of basePlayer.props) {
      expect(screen.getByText(prop.key)).toBeInTheDocument()
      expect(screen.getByDisplayValue(prop.value)).toBeInTheDocument()
    }
  })

  it('should show a message for players with no props', async () => {
    const history = createMemoryHistory()
    history.push(routes.playerProps.replace(':id', basePlayer.id))

    axiosMock.onGet(`http://talo.test/players?gameId=1&search=${basePlayer.id}`).replyOnce(200, {
      players: [{ ...basePlayer, props: [] }]
    })

    render(
      <RecoilObserver node={activeGameState} initialValue={{ id: 1 }}>
        <PlayerPropsRoute history={history} />
      </RecoilObserver>
      , { wrapper: RecoilRoot }
    )

    expect(await screen.findByText(`Player = ${basePlayer.id}`)).toBeInTheDocument()

    expect(screen.getByText('This player has no custom properties. Click the button below to add one.')).toBeInTheDocument()
  })

  it('should return to the players page if the find request fails', async () => {
    const history = createMemoryHistory()
    history.push(routes.playerProps.replace(':id', basePlayer.id))

    axiosMock.onGet(`http://talo.test/players?gameId=1&search=${basePlayer.id}`).networkErrorOnce()

    render(
      <RecoilObserver node={activeGameState} initialValue={{ id: 1 }}>
        <PlayerPropsRoute history={history} />
      </RecoilObserver>
      , { wrapper: RecoilRoot }
    )

    await waitFor(() => {
      expect(history.location.pathname).toBe('/players')
    })
  })

  it('should save props', async () => {
    const history = createMemoryHistory()
    history.push(routes.playerProps.replace(':id', basePlayer.id), {
      player: basePlayer
    })

    axiosMock.onPatch(`http://talo.test/players/${basePlayer.id}`).replyOnce(200, {
      player: {
        ...basePlayer,
        props: [
          ...basePlayer.props,
          { key: 'treasuresDiscovered', value: '5' }
        ]
      }
    })

    render(
      <RecoilObserver node={activeGameState} initialValue={{ id: 1 }}>
        <PlayerPropsRoute history={history} />
      </RecoilObserver>
      , { wrapper: RecoilRoot }
    )

    userEvent.click(screen.getByText('New property'))

    userEvent.type(screen.getByPlaceholderText('Property'), 'treasuresDiscovered')
    userEvent.type(screen.getByDisplayValue(''), '5')

    userEvent.click(screen.getByText('Save changes'))

    await waitFor(() => {
      expect(screen.queryByDisplayValue('treasuresDiscovered')).not.toBeInTheDocument()
      expect(screen.getByText('treasuresDiscovered')).toBeInTheDocument()
    })
  })

  it('should keep new props without keys after saving', async () => {
    const history = createMemoryHistory()
    history.push(routes.playerProps.replace(':id', basePlayer.id), {
      player: basePlayer
    })

    axiosMock.onPatch(`http://talo.test/players/${basePlayer.id}`).replyOnce(200, {
      player: basePlayer
    })

    render(
      <RecoilObserver node={activeGameState} initialValue={{ id: 1 }}>
        <PlayerPropsRoute history={history} />
      </RecoilObserver>
      , { wrapper: RecoilRoot }
    )

    userEvent.click(screen.getByText('New property'))

    userEvent.click(screen.getByText('Save changes'))

    await waitFor(() => {
      expect(screen.getByText('Save changes')).toBeEnabled()
    })

    expect(screen.getAllByDisplayValue('')).toHaveLength(2)
  })

  it('should render saving errors', async () => {
    const history = createMemoryHistory()
    history.push(routes.playerProps.replace(':id', basePlayer.id), {
      player: basePlayer
    })

    axiosMock.onPatch(`http://talo.test/players/${basePlayer.id}`).networkErrorOnce()

    render(
      <RecoilObserver node={activeGameState} initialValue={{ id: 1 }}>
        <PlayerPropsRoute history={history} />
      </RecoilObserver>
      , { wrapper: RecoilRoot }
    )

    userEvent.click(screen.getByText('Save changes'))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })
})
