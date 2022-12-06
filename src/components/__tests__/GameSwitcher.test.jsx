import React from 'react'
import { render, screen, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GameSwitcher from '../GameSwitcher'
import activeGameState from '../../state/activeGameState'
import userState from '../../state/userState'
import KitchenSink from '../../utils/KitchenSink'

describe('<GameSwitcher />', () => {
  it('should render a cta if there is no active game', () => {
    render(
      <KitchenSink>
        <GameSwitcher />
      </KitchenSink>
    )

    expect(screen.getByText('New game')).toBeInTheDocument()
  })

  it('should open the new game modal', async () => {
    render(
      <KitchenSink>
        <GameSwitcher />
      </KitchenSink>
    )

    await userEvent.click(screen.getByRole('button'))

    expect(screen.getByText('New game')).toBeInTheDocument()
  })

  it('should render the active game name', () => {
    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: { name: 'Crawle' } }]}>
        <GameSwitcher />
      </KitchenSink>
    )

    expect(screen.getByText('Crawle')).toBeInTheDocument()
  })

  it('should render all the organisation\'s games', async () => {
    const user = {
      organisation: {
        games: [
          { id: 1, name: 'Crawle' },
          { id: 2, name: 'Superstatic' },
          { id: 3, name: 'Scrunk' }
        ]
      }
    }

    render(
      <KitchenSink states={[
        { node: userState, initialValue: user },
        { node: activeGameState, initialValue: { name: 'Crawle' } }
      ]}>
        <GameSwitcher />
      </KitchenSink>
    )

    await userEvent.click(screen.getByLabelText('Switch games or create a new one'))
    const list = screen.getByRole('list')

    for (const game of user.organisation.games) {
      expect(within(list).getByText(game.name)).toBeInTheDocument()
    }
  })

  it('should render be able to switch games', async () => {
    const user = {
      organisation: {
        games: [
          { id: 1, name: 'Crawle' },
          { id: 2, name: 'Superstatic' },
          { id: 3, name: 'Scrunk' }
        ]
      }
    }

    const switchMock = vi.fn()

    render(
      <KitchenSink states={[
        { node: userState, initialValue: user },
        { node: activeGameState, onChange: switchMock, initialValue: { name: 'Crawle' } }
      ]}>
        <GameSwitcher />
      </KitchenSink>
    )

    await userEvent.click(screen.getByLabelText('Switch games or create a new one'))

    await userEvent.click(screen.getByText(user.organisation.games[1].name))

    await waitFor(() => {
      expect(switchMock).toHaveBeenCalledWith(user.organisation.games[1])
    })
  })

  it('should open the new game modal from the dropdown', async () => {
    const user = {
      organisation: {
        games: [
          { id: 1, name: 'Crawle' },
          { id: 2, name: 'Superstatic' },
          { id: 3, name: 'Scrunk' }
        ]
      }
    }

    render(
      <KitchenSink states={[
        { node: userState, initialValue: user },
        { node: activeGameState, initialValue: { name: 'Crawle' } }
      ]}>
        <GameSwitcher />
      </KitchenSink>
    )

    await userEvent.click(screen.getByLabelText('Switch games or create a new one'))
    await userEvent.click(screen.getByText('New game'))

    expect(screen.getByText('Create new game')).toBeInTheDocument()
  })

  it('should hide the dropdown when clicking outside', async () => {
    const main = document.createElement('main')

    const user = {
      organisation: {
        games: [
          { id: 1, name: 'Crawle' },
          { id: 2, name: 'Superstatic' },
          { id: 3, name: 'Scrunk' }
        ]
      }
    }

    render(
      <KitchenSink states={[
        { node: userState, initialValue: user },
        { node: activeGameState, initialValue: { name: 'Crawle' } }
      ]}>
        <GameSwitcher />
      </KitchenSink>,
      { container: document.body.appendChild(main) }
    )

    await userEvent.click(screen.getByLabelText('Switch games or create a new one'))

    act(async () => {
      await userEvent.click(screen.getByRole('main'))
    })

    expect(screen.queryByText('Create game')).not.toBeInTheDocument()
  })
})
