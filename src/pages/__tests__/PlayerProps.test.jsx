import api from '../../api/api'
import MockAdapter from 'axios-mock-adapter'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PlayerProps from '../PlayerProps'
import activeGameState from '../../state/activeGameState'
import KitchenSink from '../../utils/KitchenSink'
import userState from '../../state/userState'

describe('<PlayerProps />', () => {
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

  const userValue = { emailConfirmed: true }

  const axiosMock = new MockAdapter(api)

  it('should render current props', () => {
    render(
      <KitchenSink
        states={[
          { node: activeGameState, initialValue: { id: 1 } },
          { node: userState, initialValue: userValue }
        ]}
        routePath='/:id'
        initialEntries={[{ pathname: `/${basePlayer.id}`, state: { player: basePlayer } }]}
      >
        <PlayerProps />
      </KitchenSink>
    )

    expect(screen.getByText(`Player = ${basePlayer.id}`)).toBeInTheDocument()

    for (const prop of basePlayer.props) {
      expect(screen.getByText(prop.key)).toBeInTheDocument()
      expect(screen.getByDisplayValue(prop.value)).toBeInTheDocument()
    }
  })

  it('should only enable the reset button after a change', async () => {
    render(
      <KitchenSink
        states={[
          { node: activeGameState, initialValue: { id: 1 } },
          { node: userState, initialValue: userValue }
        ]}
        routePath='/:id'
        initialEntries={[{ pathname: `/${basePlayer.id}`, state: { player: basePlayer } }]}
      >
        <PlayerProps />
      </KitchenSink>
    )

    expect(screen.getByText('Reset')).toBeDisabled()

    await userEvent.type(screen.getByDisplayValue('80'), '{backspace}4')

    expect(screen.getByDisplayValue('84')).toBeInTheDocument()

    expect(screen.getByText('Reset')).toBeEnabled()
  })

  it('should only enable the reset a change', async () => {
    render(
      <KitchenSink
        states={[
          { node: activeGameState, initialValue: { id: 1 } },
          { node: userState, initialValue: userValue }
        ]}
        routePath='/:id'
        initialEntries={[{ pathname: `/${basePlayer.id}`, state: { player: basePlayer } }]}
      >
        <PlayerProps />
      </KitchenSink>
    )

    expect(screen.getByDisplayValue('80')).toBeInTheDocument()
    await userEvent.type(screen.getByDisplayValue('80'), '{backspace}4')
    expect(screen.getByDisplayValue('84')).toBeInTheDocument()

    await userEvent.click(screen.getByText('Reset'))
    expect(screen.queryByDisplayValue('84')).not.toBeInTheDocument()
    expect(screen.getByDisplayValue('80')).toBeInTheDocument()
  })

  it('should delete existing props', async () => {
    render(
      <KitchenSink
        states={[
          { node: activeGameState, initialValue: { id: 1 } },
          { node: userState, initialValue: userValue }
        ]}
        routePath='/:id'
        initialEntries={[{ pathname: `/${basePlayer.id}`, state: { player: basePlayer } }]}
      >
        <PlayerProps />
      </KitchenSink>
    )

    expect(screen.getByText('health')).toBeInTheDocument()

    await userEvent.click(screen.getByLabelText('Delete health prop'))
    expect(screen.queryByText('health')).not.toBeInTheDocument()
  })

  it('should add new props', async () => {
    render(
      <KitchenSink
        states={[
          { node: activeGameState, initialValue: { id: 1 } },
          { node: userState, initialValue: userValue }
        ]}
        routePath='/:id'
        initialEntries={[{ pathname: `/${basePlayer.id}`, state: { player: basePlayer } }]}
      >
        <PlayerProps />
      </KitchenSink>
    )

    await userEvent.click(screen.getByText('New property'))

    await userEvent.type(screen.getByPlaceholderText('Property'), 'treasuresDiscovered')
    await userEvent.type(screen.getByDisplayValue(''), '5')

    expect(screen.getByDisplayValue('treasuresDiscovered')).toBeInTheDocument()
    expect(screen.getByDisplayValue('5')).toBeInTheDocument()
  })

  it('should delete new props', async () => {
    render(
      <KitchenSink
        states={[
          { node: activeGameState, initialValue: { id: 1 } },
          { node: userState, initialValue: userValue }
        ]}
        routePath='/:id'
        initialEntries={[{ pathname: `/${basePlayer.id}`, state: { player: basePlayer } }]}
      >
        <PlayerProps />
      </KitchenSink>
    )

    await userEvent.click(screen.getByText('New property'))

    await userEvent.type(screen.getByPlaceholderText('Property'), 'treasuresDiscovered')

    await userEvent.click(screen.getByLabelText('Delete treasuresDiscovered prop'))

    expect(screen.queryByDisplayValue('treasuresDiscovered')).not.toBeInTheDocument()
  })

  it('should load in players that are not in the location state', async () => {
    axiosMock.onGet(`http://talo.api/games/1/players?search=${basePlayer.id}`).replyOnce(200, {
      players: [basePlayer]
    })

    render(
      <KitchenSink
        states={[
          { node: activeGameState, initialValue: { id: 1 } },
          { node: userState, initialValue: userValue }
        ]}
        routePath='/:id'
        initialEntries={[{ pathname: `/${basePlayer.id}` }]}
      >
        <PlayerProps />
      </KitchenSink>
    )

    expect(await screen.findByText(`Player = ${basePlayer.id}`)).toBeInTheDocument()

    for (const prop of basePlayer.props) {
      expect(screen.getByText(prop.key)).toBeInTheDocument()
      expect(screen.getByDisplayValue(prop.value)).toBeInTheDocument()
    }
  })

  it('should show a message for players with no props', async () => {
    axiosMock.onGet(`http://talo.api/games/1/players?search=${basePlayer.id}`).replyOnce(200, {
      players: [{ ...basePlayer, props: [] }]
    })

    render(
      <KitchenSink
        states={[
          { node: activeGameState, initialValue: { id: 1 } },
          { node: userState, initialValue: userValue }
        ]}
        routePath='/:id'
        initialEntries={[{ pathname: `/${basePlayer.id}` }]}
      >
        <PlayerProps />
      </KitchenSink>
    )

    expect(await screen.findByText(`Player = ${basePlayer.id}`)).toBeInTheDocument()

    expect(screen.getByText('This player has no custom properties. Click the button below to add one.')).toBeInTheDocument()
  })

  it('should return to the players page if the find request fails', async () => {
    axiosMock.onGet(`http://talo.api/games/1/players?search=${basePlayer.id}`).networkErrorOnce()

    const setLocationMock = vi.fn()

    render(
      <KitchenSink
        states={[
          { node: activeGameState, initialValue: { id: 1 } },
          { node: userState, initialValue: userValue }
        ]}
        routePath='/players/:id'
        initialEntries={[{ pathname: `/players/${basePlayer.id}` }]}
        setLocation={setLocationMock}
      >
        <PlayerProps />
      </KitchenSink>
    )

    await waitFor(() => {
      expect(setLocationMock).toHaveBeenCalledWith({ pathname: '/players', state: null })
    })
  })

  it('should save props', async () => {
    axiosMock.onPatch(`http://talo.api/games/1/players/${basePlayer.id}`).replyOnce(200, {
      player: {
        ...basePlayer,
        props: [
          ...basePlayer.props,
          { key: 'treasuresDiscovered', value: '5' }
        ]
      }
    })

    render(
      <KitchenSink
        states={[
          { node: activeGameState, initialValue: { id: 1 } },
          { node: userState, initialValue: userValue }
        ]}
        routePath='/:id'
        initialEntries={[{ pathname: `/${basePlayer.id}`, state: { player: basePlayer } }]}
      >
        <PlayerProps />
      </KitchenSink>
    )

    await userEvent.click(screen.getByText('New property'))

    await userEvent.type(screen.getByPlaceholderText('Property'), 'treasuresDiscovered')
    await userEvent.type(screen.getByDisplayValue(''), '5')

    await userEvent.click(screen.getByText('Save changes'))

    await waitFor(() => {
      expect(screen.queryByDisplayValue('treasuresDiscovered')).not.toBeInTheDocument()
    })

    expect(screen.getByText('treasuresDiscovered')).toBeInTheDocument()
  })

  it('should render saving errors', async () => {
    axiosMock.onPatch(`http://talo.api/games/1/players/${basePlayer.id}`).networkErrorOnce()

    render(
      <KitchenSink
        states={[
          { node: activeGameState, initialValue: { id: 1 } },
          { node: userState, initialValue: userValue }
        ]}
        routePath='/:id'
        initialEntries={[{ pathname: `/${basePlayer.id}`, state: { player: basePlayer } }]}
      >
        <PlayerProps />
      </KitchenSink>
    )

    await userEvent.type(screen.getByDisplayValue('42'), '6')
    await userEvent.click(screen.getByText('Save changes'))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  it('should render meta props', () => {
    const player = {
      ...basePlayer,
      props: [
        ...basePlayer.props,
        { key: 'META_DEV_BUILD', value: '1' },
        { key: 'META_WINDOW_MODE', value: 'Windowed' },
        { key: 'META_SCREEN_WIDTH', value: '1920' }
      ]
    }

    render(
      <KitchenSink
        states={[
          { node: activeGameState, initialValue: { id: 1 } },
          { node: userState, initialValue: userValue }
        ]}
        routePath='/:id'
        initialEntries={[{ pathname: `/${basePlayer.id}`, state: { player } }]}
      >
        <PlayerProps />
      </KitchenSink>
    )

    expect(screen.getByText('DEV BUILD')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()

    expect(screen.getByText('WINDOW MODE')).toBeInTheDocument()
    expect(screen.getByText('Windowed')).toBeInTheDocument()

    expect(screen.getByText('SCREEN WIDTH')).toBeInTheDocument()
    expect(screen.getByText('1920')).toBeInTheDocument()
  })
})
