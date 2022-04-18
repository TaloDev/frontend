import React from 'react'
import api from '../../api/api'
import MockAdapter from 'axios-mock-adapter'
import { createMemoryHistory } from 'history'
import { Router, Route } from 'react-router-dom'
import routes from '../../constants/routes'
import usePlayer from '../usePlayer'
import { render, screen, waitFor } from '@testing-library/react'
import RecoilObserver from '../../state/RecoilObserver'
import activeGameState from '../../state/activeGameState'
import { RecoilRoot } from 'recoil'

describe('usePlayer', () => {
  const axiosMock = new MockAdapter(api)

  const DummyHookRenderer = () => {
    const [player] = usePlayer()

    if (!player) return null
    return <div>{player.id}</div>
  }

  // eslint-disable-next-line react/prop-types
  const PlayerRoute = ({ history }) => (
    <Router history={history}>
      <Route exact path={routes.playerProps} component={DummyHookRenderer} />
    </Router>
  )

  it('should correctly set the player', async () => {
    const id = '82141b6e-e662-4ff2-bc77-5dc46236f339'

    const history = createMemoryHistory()
    history.push(routes.playerProps.replace(':id', id))

    axiosMock.onGet(`http://talo.test/players?gameId=1&search=${id}`).replyOnce(200, {
      players: [{ id }]
    })

    render(
      <RecoilObserver node={activeGameState} initialValue={{ id: 1 }}>
        <PlayerRoute history={history} />
      </RecoilObserver>
      , { wrapper: RecoilRoot }
    )

    expect(await screen.findByText(id)).toBeInTheDocument()
  })

  it('should return to the players page if the player does not exist', async () => {
    const history = createMemoryHistory()
    history.push(routes.playerProps.replace(':id', 1))

    axiosMock.onGet('http://talo.test/players?gameId=1&search=1').replyOnce(200, {
      players: []
    })

    render(
      <RecoilObserver node={activeGameState} initialValue={{ id: 1 }}>
        <PlayerRoute history={history} />
      </RecoilObserver>
      , { wrapper: RecoilRoot }
    )

    await waitFor(() => {
      expect(history.location.pathname).toBe('/players')
    })
  })

  it('should return to the players page if an unexpected error occurs', async () => {
    const history = createMemoryHistory()
    history.push(routes.playerProps.replace(':id', 1))

    axiosMock.onGet('http://talo.test/players?gameId=1&search=1').networkErrorOnce()

    render(
      <RecoilObserver node={activeGameState} initialValue={{ id: 1 }}>
        <PlayerRoute history={history} />
      </RecoilObserver>
      , { wrapper: RecoilRoot }
    )

    await waitFor(() => {
      expect(history.location.pathname).toBe('/players')
    })
  })
})
