import React from 'react'
import { render, screen, within, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GameSwitcher from '../GameSwitcher'
import { RecoilRoot } from 'recoil'
import activeGameState from '../../state/activeGameState'
import RecoilObserver from '../../state/RecoilObserver'
import userState from '../../state/userState'

describe('<GameSwitcher />', () => {
  it('should render a cta if there is no active game', () => {
    render(
      <GameSwitcher />,
      { wrapper: RecoilRoot }
    )

    expect(screen.getByText('New game')).toBeInTheDocument()
  })

  it('should open the new game modal', () => {
    render(
      <GameSwitcher />,
      { wrapper: RecoilRoot }
    )

    userEvent.click(screen.getByRole('button'))

    expect(screen.getByText('Create new game')).toBeInTheDocument()
  })

  it('should render the active game name', () => {
    render(
      <RecoilObserver node={activeGameState} initialValue={{ name: 'Crawle' }}>
        <GameSwitcher />
      </RecoilObserver>,
      { wrapper: RecoilRoot }
    )

    expect(screen.getByText('Crawle')).toBeInTheDocument()
  })

  it('should render all the organisation\'s games', () => {
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
      <RecoilObserver node={userState} initialValue={user}>
        <RecoilObserver node={activeGameState} initialValue={{ name: 'Crawle' }}>
          <GameSwitcher />
        </RecoilObserver>
      </RecoilObserver>,
      { wrapper: RecoilRoot }
    )

    userEvent.click(screen.getByLabelText('Switch games or create a new one'))
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

    const switchMock = jest.fn()

    render(
      <RecoilObserver node={userState} initialValue={user}>
        <RecoilObserver node={activeGameState} onChange={switchMock} initialValue={{ name: 'Crawle' }}>
          <GameSwitcher />
        </RecoilObserver>
      </RecoilObserver>,
      { wrapper: RecoilRoot }
    )

    userEvent.click(screen.getByLabelText('Switch games or create a new one'))

    userEvent.click(screen.getByText(user.organisation.games[1].name))

    await waitFor(() => {
      expect(switchMock).toHaveBeenCalledWith(user.organisation.games[1])
    })
  })

  it('should open the new game modal from the dropdown', () => {
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
      <RecoilObserver node={userState} initialValue={user}>
        <RecoilObserver node={activeGameState} initialValue={{ name: 'Crawle' }}>
          <GameSwitcher />
        </RecoilObserver>
      </RecoilObserver>,
      { wrapper: RecoilRoot }
    )

    userEvent.click(screen.getByLabelText('Switch games or create a new one'))
    userEvent.click(screen.getByText('New game'))

    expect(screen.getByText('Create new game')).toBeInTheDocument()
  })

  it('should hide the dropdown when clicking outside', () => {
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
      <RecoilObserver node={userState} initialValue={user}>
        <RecoilObserver node={activeGameState} initialValue={{ name: 'Crawle' }}>
          <GameSwitcher />
        </RecoilObserver>
      </RecoilObserver>,
      { wrapper: RecoilRoot, container: document.body.appendChild(main) }
    )

    userEvent.click(screen.getByLabelText('Switch games or create a new one'))

    act(() => {
      userEvent.click(screen.getByRole('main'))
    })

    expect(screen.queryByText('Create new game')).not.toBeInTheDocument()
  })
})
