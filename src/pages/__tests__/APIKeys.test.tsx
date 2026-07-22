import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MockAdapter from 'axios-mock-adapter'
import api from '../../api/api'
import ToastProvider from '../../components/toast/ToastProvider'
import { User, UserType } from '../../entities/user'
import { activeGameState } from '../../state/activeGameState'
import { userState } from '../../state/userState'
import KitchenSink from '../../utils/KitchenSink'
import APIKeys from '../APIKeys'

describe('<APIKeys />', () => {
  const axiosMock = new MockAdapter(api)
  const activeGameValue = { id: 1, name: 'Shattered' }

  beforeEach(() => {
    axiosMock.reset()
  })

  const renderPage = (userOverrides: Partial<User>) => {
    const baseUser = {
      username: 'me',
      emailConfirmed: true,
      organisation: {
        id: 1,
        name: 'Test Org',
        games: [],
        pricingPlan: { status: 'active' as const },
      },
    }

    return render(
      <KitchenSink
        states={[
          { node: userState, initialValue: { ...baseUser, ...userOverrides } },
          { node: activeGameState, initialValue: activeGameValue },
        ]}
      >
        <ToastProvider>
          <APIKeys />
        </ToastProvider>
      </KitchenSink>,
    )
  }

  it('renders the page with no subheaders when there are no admin API keys', async () => {
    axiosMock.onGet('http://talo.api/games/1/api-keys').replyOnce(200, { apiKeys: [] })
    axiosMock.onGet('http://talo.api/games/1/api-keys/scopes').replyOnce(200, {
      scopes: { players: ['read:players', 'write:players'] },
    })

    axiosMock.onGet('http://talo.api/games/1/admin-api-keys').replyOnce(200, { apiKeys: [] })
    axiosMock
      .onGet('http://talo.api/games/1/admin-api-keys/scopes')
      .replyOnce(200, { scopes: { stats: ['read:stats', 'write:stats'] } })

    renderPage({ type: UserType.ADMIN })

    expect(await screen.findByText('API keys')).toBeInTheDocument()
    expect(await screen.findByText("Shattered doesn't have any API keys yet")).toBeInTheDocument()
    expect(screen.queryByText('Game API keys')).not.toBeInTheDocument()
    expect(screen.queryByText('Admin API keys')).not.toBeInTheDocument()
  })

  it('renders both subheaders when there are game and admin API keys', async () => {
    axiosMock.onGet('http://talo.api/games/1/api-keys').replyOnce(200, {
      apiKeys: [
        {
          id: 1,
          scopes: ['read:players'],
          gameId: 1,
          createdBy: 'me',
          createdAt: '2021-01-01T00:00:00Z',
          lastUsedAt: null,
        },
      ],
    })
    axiosMock
      .onGet('http://talo.api/games/1/api-keys/scopes')
      .replyOnce(200, { scopes: { players: ['read:players', 'write:players'] } })
    axiosMock.onGet('http://talo.api/games/1/admin-api-keys').replyOnce(200, {
      apiKeys: [
        {
          id: 7,
          scopes: ['read:stats'],
          gameId: 1,
          createdBy: 'me',
          keyEnding: 'a1b2',
          createdAt: '2021-01-01T00:00:00Z',
          lastUsedAt: null,
        },
      ],
    })
    axiosMock
      .onGet('http://talo.api/games/1/admin-api-keys/scopes')
      .replyOnce(200, { scopes: { stats: ['read:stats', 'write:stats'] } })

    renderPage({ type: UserType.ADMIN })

    expect(await screen.findByText('Game API keys')).toBeInTheDocument()
    expect(await screen.findByText('Admin API keys')).toBeInTheDocument()
  })

  it('hides the game subheader and empty state when there are admin keys but no game keys', async () => {
    axiosMock.onGet('http://talo.api/games/1/api-keys').replyOnce(200, { apiKeys: [] })
    axiosMock.onGet('http://talo.api/games/1/api-keys/scopes').replyOnce(200, { scopes: {} })
    axiosMock.onGet('http://talo.api/games/1/admin-api-keys').replyOnce(200, {
      apiKeys: [
        {
          id: 7,
          scopes: ['read:stats'],
          gameId: 1,
          createdBy: 'me',
          keyEnding: 'a1b2',
          createdAt: '2021-01-01T00:00:00Z',
          lastUsedAt: null,
        },
      ],
    })
    axiosMock
      .onGet('http://talo.api/games/1/admin-api-keys/scopes')
      .replyOnce(200, { scopes: { stats: ['read:stats', 'write:stats'] } })

    renderPage({ type: UserType.ADMIN })

    expect(await screen.findByText('Admin API keys')).toBeInTheDocument()
    expect(screen.queryByText('Game API keys')).not.toBeInTheDocument()
    expect(screen.queryByText("Shattered doesn't have any API keys yet")).not.toBeInTheDocument()
  })

  it('opens the modal in admin mode when modifying an admin API key', async () => {
    axiosMock.onGet('http://talo.api/games/1/api-keys').replyOnce(200, { apiKeys: [] })
    axiosMock.onGet('http://talo.api/games/1/api-keys/scopes').replyOnce(200, { scopes: {} })
    axiosMock.onGet('http://talo.api/games/1/admin-api-keys').replyOnce(200, {
      apiKeys: [
        {
          id: 7,
          scopes: ['read:stats'],
          gameId: 1,
          createdBy: 'me',
          keyEnding: 'a1b2',
          createdAt: '2021-01-01T00:00:00Z',
          lastUsedAt: null,
        },
      ],
    })
    axiosMock
      .onGet('http://talo.api/games/1/admin-api-keys/scopes')
      .replyOnce(200, { scopes: { stats: ['read:stats', 'write:stats'] } })

    renderPage({ type: UserType.ADMIN })

    const modifyButtons = await screen.findAllByText('Modify scopes')
    await userEvent.click(modifyButtons[0])

    expect(await screen.findByText('Update admin API key')).toBeInTheDocument()
  })

  it('revokes an admin API key', async () => {
    axiosMock.onGet('http://talo.api/games/1/api-keys').replyOnce(200, { apiKeys: [] })
    axiosMock.onGet('http://talo.api/games/1/api-keys/scopes').replyOnce(200, { scopes: {} })
    axiosMock.onGet('http://talo.api/games/1/admin-api-keys').replyOnce(200, {
      apiKeys: [
        {
          id: 7,
          scopes: ['read:stats'],
          gameId: 1,
          createdBy: 'me',
          keyEnding: 'a1b2',
          createdAt: '2021-01-01T00:00:00Z',
          lastUsedAt: null,
        },
      ],
    })
    axiosMock
      .onGet('http://talo.api/games/1/admin-api-keys/scopes')
      .replyOnce(200, { scopes: { stats: ['read:stats', 'write:stats'] } })
    axiosMock.onDelete('http://talo.api/games/1/admin-api-keys/7').replyOnce(204)

    vi.spyOn(window, 'confirm').mockReturnValueOnce(true)

    renderPage({ type: UserType.ADMIN })

    const revokeButtons = await screen.findAllByText('Revoke')
    await userEvent.click(revokeButtons[0])

    await waitFor(() => {
      expect(axiosMock.history.delete.length).toBe(1)
    })
    expect(axiosMock.history.delete[0].url).toBe('/games/1/admin-api-keys/7')
  })
})
