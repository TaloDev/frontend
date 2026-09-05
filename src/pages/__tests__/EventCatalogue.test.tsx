import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MockAdapter from 'axios-mock-adapter'
import { vi } from 'vitest'
import api from '../../api/api'
import ToastProvider from '../../components/toast/ToastProvider'
import { UserType } from '../../entities/user'
import { activeGameState } from '../../state/activeGameState'
import { AuthedUser, userState } from '../../state/userState'
import KitchenSink from '../../utils/KitchenSink'
import EventCatalogue from '../EventCatalogue'

describe('<EventCatalogue />', () => {
  const axiosMock = new MockAdapter(api)

  const user: Partial<AuthedUser> = {
    id: 1,
    email: 'me@talo.dev',
    username: 'me',
    emailConfirmed: true,
    type: UserType.DEV,
    createdAt: '2021-01-01T00:00:00Z',
    organisation: {
      id: 1,
      name: 'Test Org',
      games: [],
      pricingPlan: { status: 'active' },
    },
  }

  const activeGame = {
    id: 1,
    name: 'Test Game',
    apiKey: 'key',
    devBuildApiKey: 'dev-key',
  }

  const event = {
    name: 'Open inventory',
    count: 3,
    players: 2,
    propKeys: ['version'],
    retentionDays: null as number | null,
  }

  beforeEach(() => {
    axiosMock.reset()
    localStorage.clear()
  })

  const renderPage = (catalogueEvent = event, userOverrides: Partial<AuthedUser> = {}) => {
    axiosMock.onGet('http://talo.api/games/1/events/catalogue?page=0').reply(200, {
      events: [catalogueEvent],
      count: 1,
      itemsPerPage: 50,
      isLastPage: true,
    })

    return render(
      <KitchenSink
        states={[
          { node: userState, initialValue: { ...user, ...userOverrides } },
          { node: activeGameState, initialValue: activeGame },
        ]}
      >
        <ToastProvider>
          <EventCatalogue />
        </ToastProvider>
      </KitchenSink>,
    )
  }

  it('lists events with their data', async () => {
    renderPage()

    expect(await screen.findByText('Open inventory')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('version')).toBeInTheDocument()
    expect(screen.getByText('None')).toBeInTheDocument()
  })

  it('hides retention buttons for devs', async () => {
    renderPage({ ...event, retentionDays: 30 })

    expect(await screen.findByText('30 days')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Edit retention' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Clear retention' })).not.toBeInTheDocument()
  })

  it('updates retention inline', async () => {
    renderPage(event, { type: UserType.ADMIN })

    await screen.findByText('Open inventory')
    axiosMock.onPut('http://talo.api/games/1/events/retention').replyOnce(200, {
      retention: {
        eventName: 'Open inventory',
        retentionDays: 30,
        updatedAt: '2026-01-01T00:00:00Z',
      },
    })

    await userEvent.click(screen.getByRole('button', { name: 'Edit retention' }))
    await userEvent.type(screen.getByPlaceholderText('Days'), '30')
    await userEvent.click(screen.getByRole('button', { name: 'Save retention' }))

    await waitFor(() => {
      expect(axiosMock.history.put.length).toBe(1)
    })
    expect(JSON.parse(axiosMock.history.put[0].data)).toEqual({
      eventName: 'Open inventory',
      retentionDays: 30,
    })
    expect(await screen.findByText('Retention updated')).toBeInTheDocument()
  })

  it('clears retention', async () => {
    renderPage({ ...event, retentionDays: 30 }, { type: UserType.ADMIN })

    await screen.findByText('30 days')
    axiosMock.onDelete('http://talo.api/games/1/events/retention').replyOnce(204)

    await userEvent.click(screen.getByRole('button', { name: 'Clear retention' }))

    await waitFor(() => {
      expect(axiosMock.history.delete.length).toBe(1)
    })
    expect(axiosMock.history.delete[0].params).toEqual({ eventName: 'Open inventory' })
    expect(await screen.findByText('Retention cleared')).toBeInTheDocument()
  })

  it('hides the purge button for devs', async () => {
    renderPage()

    expect(await screen.findByText('Open inventory')).toBeInTheDocument()
    expect(screen.queryByText('Purge')).not.toBeInTheDocument()
  })

  it('purges an event as an admin', async () => {
    renderPage(event, { type: UserType.ADMIN })

    await screen.findByText('Open inventory')
    axiosMock.onDelete('http://talo.api/games/1/events/purge').replyOnce(200, { purged: 3 })

    const confirmMock = vi.spyOn(window, 'confirm').mockImplementation(() => true)

    await userEvent.click(screen.getByText('Purge'))

    await waitFor(() => {
      expect(axiosMock.history.delete.length).toBe(1)
    })
    expect(axiosMock.history.delete[0].params).toEqual({ eventName: 'Open inventory' })
    expect(confirmMock).toHaveBeenCalledWith(
      "Are you sure you want to purge all 'Open inventory' events? This action cannot be undone.",
    )
    expect(await screen.findByText('Purged 3 events')).toBeInTheDocument()

    confirmMock.mockRestore()
  })
})
