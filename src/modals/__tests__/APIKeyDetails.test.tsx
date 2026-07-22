import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MockAdapter from 'axios-mock-adapter'
import { ComponentProps } from 'react'
import api from '../../api/api'
import ToastProvider from '../../components/toast/ToastProvider'
import { AdminApiKey } from '../../entities/adminApiKey'
import { APIKey } from '../../entities/apiKey'
import { User, UserType } from '../../entities/user'
import { activeGameState } from '../../state/activeGameState'
import { userState } from '../../state/userState'
import KitchenSink from '../../utils/KitchenSink'
import { APIKeyDetails, type EditableKey } from '../APIKeyDetails'

const gameKey: APIKey = {
  id: 1,
  scopes: ['read:leaderboards', 'read:players', 'write:players'],
  gameId: 1,
  createdBy: 'admin',
  createdAt: '2021-01-01T00:00:00Z',
  lastUsedAt: '2021-01-01T00:00:00Z',
}

const adminApiKey: AdminApiKey = {
  id: 7,
  scopes: ['read:stats'],
  gameId: 1,
  createdBy: 'admin',
  keyEnding: 'a1b2',
  createdAt: '2021-01-01T00:00:00Z',
  lastUsedAt: null,
}

const gameScopes = {
  leaderboards: ['read:leaderboards', 'write:leaderboards'],
  players: ['read:players', 'write:players'],
}

const adminApiKeyScopes = {
  stats: ['read:stats', 'write:stats'],
}

describe('<APIKeyDetails />', () => {
  const axiosMock = new MockAdapter(api)
  const activeGameValue = { id: 1, name: 'Shattered' }

  const renderModal = ({
    editingKey = null,
    user = { type: UserType.ADMIN, emailConfirmed: true },
    mutateGame = vi.fn(),
    mutateAdmin = vi.fn(),
  }: {
    editingKey?: EditableKey
    user?: Partial<User>
    mutateGame?: ComponentProps<typeof APIKeyDetails>['mutateGame']
    mutateAdmin?: ComponentProps<typeof APIKeyDetails>['mutateAdmin']
  }) => {
    return render(
      <KitchenSink
        states={[
          { node: userState, initialValue: user },
          { node: activeGameState, initialValue: activeGameValue },
        ]}
      >
        <ToastProvider>
          <APIKeyDetails
            modalState={[true, vi.fn()]}
            editingKey={editingKey}
            gameScopes={gameScopes}
            adminApiKeyScopes={adminApiKeyScopes}
            mutateGame={mutateGame}
            mutateAdmin={mutateAdmin}
          />
        </ToastProvider>
      </KitchenSink>,
    )
  }

  beforeEach(() => {
    axiosMock.reset()
  })

  it('should close when clicking close', async () => {
    const closeMock = vi.fn()

    render(
      <KitchenSink
        states={[
          { node: userState, initialValue: { type: UserType.ADMIN, emailConfirmed: true } },
          { node: activeGameState, initialValue: activeGameValue },
        ]}
      >
        <ToastProvider>
          <APIKeyDetails
            modalState={[true, closeMock]}
            editingKey={null}
            gameScopes={gameScopes}
            adminApiKeyScopes={adminApiKeyScopes}
            mutateGame={vi.fn()}
            mutateAdmin={vi.fn()}
          />
        </ToastProvider>
      </KitchenSink>,
    )

    await userEvent.click(screen.getByText('Close'))

    expect(closeMock).toHaveBeenCalled()
  })

  it('should prefill details for an api key', () => {
    renderModal({ editingKey: { type: 'game', key: gameKey } })

    expect(screen.getAllByRole('checkbox', { hidden: true })).toHaveLength(6)

    expect(screen.getByDisplayValue('read:leaderboards')).toBeChecked()
    expect(screen.getByDisplayValue('write:leaderboards')).not.toBeChecked()
    expect(screen.getByDisplayValue('read:players')).toBeChecked()
    expect(screen.getByDisplayValue('write:players')).toBeChecked()

    expect(screen.getByText('Update')).toBeInTheDocument()
  })

  it('should hide the radio in edit mode and lock the scopes to the editing key type', () => {
    renderModal({ editingKey: { type: 'admin', key: adminApiKey } })

    expect(screen.queryByText('Game API key')).not.toBeInTheDocument()
    expect(screen.queryByText('Admin API key')).not.toBeInTheDocument()
    expect(screen.getByText('Update admin API key')).toBeInTheDocument()
    expect(screen.getByDisplayValue('read:stats')).toBeChecked()
    expect(screen.queryByDisplayValue('read:leaderboards')).not.toBeInTheDocument()
  })

  it('should default to game API key in create mode (key type selection hidden)', () => {
    renderModal({})

    expect(screen.getByText('Create API key')).toBeInTheDocument()
    expect(screen.queryByText('Game API key')).not.toBeInTheDocument()
    expect(screen.queryByText('Admin API key')).not.toBeInTheDocument()
    expect(
      screen.getByText('These keys can be used directly inside your game client'),
    ).toBeInTheDocument()
    expect(screen.getByDisplayValue('read:leaderboards')).toBeInTheDocument()
  })

  it.skip('should switch the description and scope list when switching to admin API key in create mode', async () => {
    renderModal({})

    await userEvent.click(screen.getByDisplayValue('read:leaderboards'))
    expect(screen.getByDisplayValue('read:leaderboards')).toBeChecked()

    await userEvent.click(screen.getByLabelText('Admin API key'))

    expect(screen.getByDisplayValue('read:stats')).toBeInTheDocument()
    expect(screen.queryByDisplayValue('read:leaderboards')).not.toBeInTheDocument()
    expect(
      screen.getByText(
        'These keys should be used inside a secure environment (like a game server)',
      ),
    ).toBeInTheDocument()
    expect(
      screen.queryByText('These keys can be used directly inside your game client'),
    ).not.toBeInTheDocument()
    expect(
      screen.getByText('You should never use this key inside a game client'),
    ).toBeInTheDocument()
    expect(screen.getByDisplayValue('read:stats')).not.toBeChecked()
  })

  it('should check and uncheck scopes', async () => {
    renderModal({ editingKey: { type: 'game', key: gameKey } })

    expect(screen.getByDisplayValue('write:leaderboards')).not.toBeChecked()
    await userEvent.click(screen.getByDisplayValue('write:leaderboards'))
    expect(screen.getByDisplayValue('write:leaderboards')).toBeChecked()

    expect(screen.getByDisplayValue('read:players')).toBeChecked()
    await userEvent.click(screen.getByDisplayValue('read:players'))
    expect(screen.getByDisplayValue('read:players')).not.toBeChecked()
  })

  it("should update a game key's scopes", async () => {
    const closeMock = vi.fn()
    const mutateGame = vi.fn()
    const mutateAdmin = vi.fn()

    const newScopes = ['read:leaderboards', 'write:leaderboards', 'read:players', 'write:players']

    axiosMock.onPut('http://talo.api/games/1/api-keys/1').replyOnce(200, {
      apiKey: { ...gameKey, scopes: newScopes },
    })

    render(
      <KitchenSink
        states={[
          { node: userState, initialValue: { type: UserType.ADMIN, emailConfirmed: true } },
          { node: activeGameState, initialValue: activeGameValue },
        ]}
      >
        <ToastProvider>
          <APIKeyDetails
            modalState={[true, closeMock]}
            mutateGame={mutateGame}
            mutateAdmin={mutateAdmin}
            editingKey={{ type: 'game', key: gameKey }}
            gameScopes={gameScopes}
            adminApiKeyScopes={adminApiKeyScopes}
          />
        </ToastProvider>
      </KitchenSink>,
    )

    await userEvent.click(screen.getByDisplayValue('write:leaderboards'))
    await userEvent.click(screen.getByText('Update'))

    await waitFor(() => {
      expect(closeMock).toHaveBeenCalled()
    })

    expect(mutateGame).toHaveBeenCalled()
    expect(mutateAdmin).not.toHaveBeenCalled()
  })

  it("should update an admin API key's scopes and use the admin endpoint", async () => {
    const closeMock = vi.fn()
    const mutateGame = vi.fn()
    const mutateAdmin = vi.fn()

    axiosMock.onPut('http://talo.api/games/1/admin-api-keys/7').replyOnce(200, {
      apiKey: { ...adminApiKey, scopes: ['read:stats', 'write:stats'] },
    })

    render(
      <KitchenSink
        states={[
          { node: userState, initialValue: { type: UserType.ADMIN, emailConfirmed: true } },
          { node: activeGameState, initialValue: activeGameValue },
        ]}
      >
        <ToastProvider>
          <APIKeyDetails
            modalState={[true, closeMock]}
            mutateGame={mutateGame}
            mutateAdmin={mutateAdmin}
            editingKey={{ type: 'admin', key: adminApiKey }}
            gameScopes={gameScopes}
            adminApiKeyScopes={adminApiKeyScopes}
          />
        </ToastProvider>
      </KitchenSink>,
    )

    await userEvent.click(screen.getByDisplayValue('write:stats'))
    await userEvent.click(screen.getByText('Update'))

    await waitFor(() => {
      expect(closeMock).toHaveBeenCalled()
    })

    expect(mutateAdmin).toHaveBeenCalled()
    expect(mutateGame).not.toHaveBeenCalled()
  })

  it('should create a game key when game API key is selected', async () => {
    const mutateGame = vi.fn()
    const mutateAdmin = vi.fn()

    axiosMock.onPost('http://talo.api/games/1/api-keys').replyOnce(200, {
      token: 'jwt-token-here',
      apiKey: { ...gameKey, id: 99 },
    })

    renderModal({ mutateGame, mutateAdmin })

    await userEvent.click(screen.getByDisplayValue('read:leaderboards'))
    await userEvent.click(screen.getByText('Create'))

    await waitFor(() => {
      expect(screen.getByText('jwt-token-here')).toBeInTheDocument()
    })

    expect(mutateGame).toHaveBeenCalled()
    expect(mutateAdmin).not.toHaveBeenCalled()
  })

  it.skip('should create an admin API key when admin API key is selected and use the admin endpoint', async () => {
    const mutateGame = vi.fn()
    const mutateAdmin = vi.fn()

    axiosMock.onPost('http://talo.api/games/1/admin-api-keys').replyOnce(200, {
      key: 'ta_admin-secret',
      apiKey: { ...adminApiKey, id: 99 },
    })

    renderModal({ mutateGame, mutateAdmin })

    await userEvent.click(screen.getByLabelText('Admin API key'))
    await userEvent.click(screen.getByDisplayValue('read:stats'))
    await userEvent.click(screen.getByText('Create'))

    await waitFor(() => {
      expect(screen.getByText('ta_admin-secret')).toBeInTheDocument()
    })

    expect(mutateAdmin).toHaveBeenCalled()
    expect(mutateGame).not.toHaveBeenCalled()
  })

  it('should be able to select all scopes', async () => {
    renderModal({ editingKey: { type: 'game', key: { ...gameKey, scopes: [] } } })

    await userEvent.click(screen.getByText('Select all scopes'))

    expect(screen.getAllByRole('checkbox', { hidden: true })).toHaveLength(6)

    expect(screen.getByDisplayValue('read:leaderboards')).toBeChecked()
    expect(screen.getByDisplayValue('write:leaderboards')).toBeChecked()
    expect(screen.getByDisplayValue('read:players')).toBeChecked()
    expect(screen.getByDisplayValue('write:players')).toBeChecked()
  })

  it('should handle updating errors', async () => {
    axiosMock.onPut('http://talo.api/games/1/api-keys/1').networkErrorOnce()

    renderModal({
      editingKey: { type: 'game', key: gameKey },
      user: { type: UserType.ADMIN, emailConfirmed: true },
    })

    await userEvent.click(screen.getByText('Update'))

    await waitFor(() => {
      expect(screen.getByText('Network Error')).toBeInTheDocument()
    })
  })
})
