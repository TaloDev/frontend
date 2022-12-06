import React from 'react'
import api from '../../api/api'
import MockAdapter from 'axios-mock-adapter'
import usePlayer from '../usePlayer'
import { render, screen, waitFor } from '@testing-library/react'
import activeGameState from '../../state/activeGameState'
import KitchenSink from '../KitchenSink'

describe('usePlayer', () => {
  const axiosMock = new MockAdapter(api)

  const DummyHookRenderer = () => {
    const [player] = usePlayer()

    if (!player) return null
    return <div>{player.id}</div>
  }

  it('should correctly set the player', async () => {
    const id = '82141b6e-e662-4ff2-bc77-5dc46236f339'

    axiosMock.onGet(`http://talo.test/games/1/players?search=${id}`).replyOnce(200, {
      players: [{ id }]
    })

    render(
      <KitchenSink
        states={[{ node: activeGameState, initialValue: { id: 1 } }]}
        routePath='/:id'
        initialEntries={[{ pathname: `/${id}` }]}
      >
        <DummyHookRenderer />
      </KitchenSink>
    )

    expect(await screen.findByText(id)).toBeInTheDocument()
  })

  it('should return to the players page if the player does not exist', async () => {
    const setLocationMock = vi.fn()

    axiosMock.onGet('http://talo.test/games/1/players?search=1').replyOnce(200, {
      players: []
    })

    render(
      <KitchenSink
        states={[{ node: activeGameState, initialValue: { id: 1 } }]}
        routePath='/players/:id'
        initialEntries={[{ pathname: '/players/1' }]}
        setLocation={setLocationMock}
      >
        <DummyHookRenderer />
      </KitchenSink>
    )

    await waitFor(() => {
      expect(setLocationMock).toHaveBeenCalledWith({ pathname: '/players', state: null })
    })
  })

  it('should return to the players page if an unexpected error occurs', async () => {
    const setLocationMock = vi.fn()

    axiosMock.onGet('http://talo.test/games/1/players?search=1').networkErrorOnce()

    render(
      <KitchenSink
        states={[{ node: activeGameState, initialValue: { id: 1 } }]}
        routePath='/players/:id'
        initialEntries={[{ pathname: '/players/1' }]}
        setLocation={setLocationMock}
      >
        <DummyHookRenderer />
      </KitchenSink>
    )

    await waitFor(() => {
      expect(setLocationMock).toHaveBeenCalledWith({ pathname: '/players', state: null })
    })
  })
})
