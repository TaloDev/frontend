import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import api from '../../api/api'
import MockAdapter from 'axios-mock-adapter'
import activeGameState from '../../state/activeGameState'
import userState from '../../state/userState'
import KitchenSink from '../../utils/KitchenSink'
import Scopes from '../Scopes'
import ToastProvider from '../../components/toast/ToastProvider'
import { UserType } from '../../entities/user'

describe('<Scopes />', () => {
  const axiosMock = new MockAdapter(api)
  const activeGameValue = { id: 1, name: 'Shattered' }

  it('should close when clicking close', async () => {
    const closeMock = vi.fn()

    render(
      <KitchenSink states={[
        { node: userState, initialValue: { type: UserType.ADMIN, emailConfirmed: true } },
        { node: activeGameState, initialValue: activeGameValue }
      ]}>
        <ToastProvider>
          <Scopes modalState={[true, closeMock]} mutate={vi.fn()} availableScopes={{}} selectedKey={null} />
        </ToastProvider>
      </KitchenSink>
    )

    await userEvent.click(screen.getByText('Close'))

    expect(closeMock).toHaveBeenCalled()
  })

  it('should prefill details for an api key', () => {
    render(
      <KitchenSink states={[
        { node: userState, initialValue: { type: UserType.ADMIN } },
        { node: activeGameState, initialValue: activeGameValue }
      ]}>
        <ToastProvider>
          <Scopes
            modalState={[true, vi.fn()]}
            mutate={vi.fn()}
            selectedKey={{
              id: 1,
              scopes: [
                'read:leaderboards',
                'read:players',
                'write:players'
              ],
              gameId: activeGameValue.id,
              createdBy: 'admin',
              createdAt: '2021-01-01T00:00:00Z',
              lastUsedAt: '2021-01-01T00:00:00Z'
            }}
            availableScopes={{
              leaderboards: ['read:leaderboards', 'write:leaderboards'],
              players: ['read:players', 'write:players']
            }}
          />
        </ToastProvider>
      </KitchenSink>
    )

    expect(screen.getAllByRole('checkbox', { hidden: true })).toHaveLength(4)

    expect(screen.getByDisplayValue('read:leaderboards')).toBeChecked()
    expect(screen.getByDisplayValue('write:leaderboards')).not.toBeChecked()
    expect(screen.getByDisplayValue('read:players')).toBeChecked()
    expect(screen.getByDisplayValue('write:players')).toBeChecked()

    expect(screen.getByText('Update')).toBeInTheDocument()
  })

  it('should check and uncheck scopes', async () => {
    render(
      <KitchenSink states={[
        { node: userState, initialValue: { type: UserType.ADMIN } },
        { node: activeGameState, initialValue: activeGameValue }
      ]}>
        <ToastProvider>
          <Scopes
            modalState={[true, vi.fn()]}
            mutate={vi.fn()}
            selectedKey={{
              id: 1,
              scopes: [
                'read:leaderboards',
                'read:players',
                'write:players'
              ],
              gameId: activeGameValue.id,
              createdBy: 'admin',
              createdAt: '2021-01-01T00:00:00Z',
              lastUsedAt: '2021-01-01T00:00:00Z'
            }}
            availableScopes={{
              leaderboards: ['read:leaderboards', 'write:leaderboards'],
              players: ['read:players', 'write:players']
            }}
          />
        </ToastProvider>
      </KitchenSink>
    )

    expect(screen.getByDisplayValue('write:leaderboards')).not.toBeChecked()
    await userEvent.click(screen.getByDisplayValue('write:leaderboards'))
    expect(screen.getByDisplayValue('write:leaderboards')).toBeChecked()

    expect(screen.getByDisplayValue('read:players')).toBeChecked()
    await userEvent.click(screen.getByDisplayValue('read:players'))
    expect(screen.getByDisplayValue('read:players')).not.toBeChecked()
  })

  it('should update a key\'s scopes', async () => {
    const closeMock = vi.fn()
    const mutateMock = vi.fn()

    const initialKey = {
      id: 1,
      scopes: [
        'read:leaderboards',
        'read:players',
        'write:players'
      ],
      gameId: activeGameValue.id,
      createdBy: 'admin',
      createdAt: '2021-01-01T00:00:00Z',
      lastUsedAt: '2021-01-01T00:00:00Z'
    }

    const newScopes = ['read:leaderboards', 'write:leaderboards', 'read:players', 'write:players']

    axiosMock.onPut('http://talo.api/games/1/api-keys/1').replyOnce(200, {
      apiKey: {
        ...initialKey,
        scopes: newScopes
      }
    })

    render(
      <KitchenSink states={[
        { node: userState, initialValue: { type: UserType.ADMIN, emailConfirmed: true } },
        { node: activeGameState, initialValue: activeGameValue }
      ]}>
        <ToastProvider>
          <Scopes
            modalState={[true, closeMock]}
            mutate={mutateMock}
            selectedKey={initialKey}
            availableScopes={{
              leaderboards: ['read:leaderboards', 'write:leaderboards'],
              players: ['read:players', 'write:players']
            }}
          />
        </ToastProvider>
      </KitchenSink>
    )

    await userEvent.click(screen.getByDisplayValue('write:leaderboards'))
    await userEvent.click(screen.getByText('Update'))

    await waitFor(() => {
      expect(closeMock).toHaveBeenCalled()
    })

    expect(mutateMock).toHaveBeenCalled()

    const mutator = mutateMock.mock.calls[0][0]
    expect(mutator({ apiKeys: [initialKey, { id: 2 }] })).toStrictEqual({
      apiKeys: [{ ...initialKey, scopes: newScopes }, { id: 2 }]
    })
  })

  it('should be able to select all scopes', async () => {
    const closeMock = vi.fn()
    const mutateMock = vi.fn()

    render(
      <KitchenSink states={[
        { node: userState, initialValue: { type: UserType.ADMIN, emailConfirmed: true } },
        { node: activeGameState, initialValue: activeGameValue }
      ]}>
        <ToastProvider>
          <Scopes
            modalState={[true, closeMock]}
            mutate={mutateMock}
            selectedKey={{
              id: 1,
              scopes: [],
              gameId: activeGameValue.id,
              createdBy: 'admin',
              createdAt: '2021-01-01T00:00:00Z',
              lastUsedAt: '2021-01-01T00:00:00Z'
            }}
            availableScopes={{
              leaderboards: ['read:leaderboards', 'write:leaderboards'],
              players: ['read:players', 'write:players']
            }}
          />
        </ToastProvider>
      </KitchenSink>
    )

    await userEvent.click(screen.getByText('Select all scopes'))

    expect(screen.getAllByRole('checkbox', { hidden: true })).toHaveLength(4)

    expect(screen.getByDisplayValue('read:leaderboards')).toBeChecked()
    expect(screen.getByDisplayValue('write:leaderboards')).toBeChecked()
    expect(screen.getByDisplayValue('read:players')).toBeChecked()
    expect(screen.getByDisplayValue('write:players')).toBeChecked()
  })

  it('should handle updating errors', async () => {
    axiosMock.onPut('http://talo.api/games/1/api-keys/1').networkErrorOnce()

    render(
      <KitchenSink states={[
        { node: userState, initialValue: { type: UserType.ADMIN, emailConfirmed: true } },
        { node: activeGameState, initialValue: activeGameValue }
      ]}>
        <ToastProvider>
          <Scopes
            modalState={[true, vi.fn()]}
            mutate={vi.fn()}
            selectedKey={{
              id: 1,
              scopes: [
                'read:leaderboards',
                'read:players',
                'write:players'
              ],
              gameId: activeGameValue.id,
              createdBy: 'admin',
              createdAt: '2021-01-01T00:00:00Z',
              lastUsedAt: '2021-01-01T00:00:00Z'
            }}
            availableScopes={{
              leaderboards: ['read:leaderboards', 'write:leaderboards'],
              players: ['read:players', 'write:players']
            }}
          />
        </ToastProvider>
      </KitchenSink>
    )

    await userEvent.click(screen.getByText('Update'))

    await waitFor(() => {
      expect(screen.getByText('Network Error')).toBeInTheDocument()
    })
  })
})
