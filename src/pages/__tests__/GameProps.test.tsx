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
import GameProps from '../GameProps'

describe('<GameProps />', () => {
  const axiosMock = new MockAdapter(api)

  const user: Partial<AuthedUser> = {
    id: 1,
    email: 'me@talo.dev',
    username: 'me',
    emailConfirmed: true,
    type: UserType.ADMIN,
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
    props: [{ key: 'health', value: '80' }],
    createdAt: '2025-01-01T00:00:00Z',
  }

  const scheduledChange = {
    id: 5,
    key: 'currentEvent',
    value: 'winter',
    applyAt: '2026-01-01T00:00:00Z',
    createdAt: '2025-12-01T00:00:00Z',
  }

  const scheduledChangesUrl = 'http://talo.api/games/1/game-config/scheduled-changes'

  beforeEach(() => {
    axiosMock.reset()
    localStorage.clear()
  })

  const renderPage = () => {
    return render(
      <KitchenSink
        states={[
          { node: userState, initialValue: user },
          { node: activeGameState, initialValue: activeGame },
        ]}
      >
        <ToastProvider>
          <GameProps />
        </ToastProvider>
      </KitchenSink>,
    )
  }

  it('saves props to the game config endpoint', async () => {
    axiosMock.onGet(scheduledChangesUrl).reply(200, { changes: [] })
    axiosMock.onPatch('http://talo.api/games/1/game-config').replyOnce(200, {
      game: {
        ...activeGame,
        props: [
          { key: 'health', value: '80' },
          { key: 'level', value: '10' },
        ],
      },
    })

    renderPage()

    await userEvent.click(await screen.findByText('New property'))
    await userEvent.type(screen.getByPlaceholderText('Property'), 'level')
    await userEvent.type(screen.getAllByPlaceholderText('Value').at(-1)!, '10')
    await userEvent.click(screen.getByText('Save changes'))

    await waitFor(() => {
      expect(axiosMock.history.patch.length).toBe(1)
    })
    expect(JSON.parse(axiosMock.history.patch[0].data)).toEqual({
      props: [
        { key: 'health', value: '80' },
        { key: 'level', value: '10' },
      ],
    })
    expect(await screen.findByText('Live config updated')).toBeInTheDocument()
  })

  it('lists scheduled changes with relative apply times', async () => {
    axiosMock.onGet(scheduledChangesUrl).reply(200, {
      changes: [
        {
          ...scheduledChange,
          id: 6,
          key: 'doubleCoins',
          value: '2x',
          applyAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
        },
        scheduledChange,
      ],
    })

    renderPage()

    expect(await screen.findByText('doubleCoins')).toBeInTheDocument()
    expect(screen.getByText('currentEvent')).toBeInTheDocument()
    expect(screen.getByText('winter')).toBeInTheDocument()
    expect(screen.getByText('2x')).toBeInTheDocument()
    expect(screen.getByText(/01 Jan 2026, 00:00/)).toBeInTheDocument()
    expect(screen.getByText(/in \d+ minutes/)).toBeInTheDocument()
  })

  it('shows [Deleted] for changes that will delete a prop', async () => {
    axiosMock.onGet(scheduledChangesUrl).reply(200, {
      changes: [{ ...scheduledChange, value: null }],
    })

    renderPage()

    expect(await screen.findByText('[Deleted]')).toBeInTheDocument()
  })

  it('shows an empty state when there are no scheduled changes', async () => {
    axiosMock.onGet(scheduledChangesUrl).reply(200, { changes: [] })

    renderPage()

    expect(await screen.findByText(/No scheduled changes/)).toBeInTheDocument()
  })

  it('cancels a scheduled change', async () => {
    let changes = [scheduledChange]
    axiosMock.onGet(scheduledChangesUrl).reply(() => [200, { changes }])
    axiosMock.onDelete('http://talo.api/games/1/game-config/scheduled-changes/5').replyOnce(204)

    const confirmMock = vi.spyOn(window, 'confirm').mockImplementation(() => true)

    renderPage()

    await screen.findByText('currentEvent')
    changes = []

    await userEvent.click(
      screen.getByRole('button', { name: 'Cancel scheduled change to currentEvent' }),
    )

    await waitFor(() => {
      expect(axiosMock.history.delete.length).toBe(1)
    })
    expect(confirmMock).toHaveBeenCalledWith(
      "Are you sure you want to cancel the scheduled change to 'currentEvent'?",
    )
    expect(await screen.findByText('Scheduled change cancelled')).toBeInTheDocument()
    expect(screen.queryByText('currentEvent')).not.toBeInTheDocument()

    confirmMock.mockRestore()
  })

  it('schedules a change', async () => {
    axiosMock.onGet(scheduledChangesUrl).reply(200, { changes: [] })
    axiosMock.onPost(scheduledChangesUrl).replyOnce(200, { changes: [scheduledChange] })

    renderPage()

    await userEvent.click(await screen.findByRole('button', { name: 'Scheduled change' }))
    await userEvent.type(screen.getByLabelText('Key'), 'currentEvent')
    await userEvent.type(screen.getByLabelText('Value'), 'winter')
    await userEvent.click(screen.getByText('Schedule'))

    await waitFor(() => {
      expect(axiosMock.history.post.length).toBe(1)
    })

    const body = JSON.parse(axiosMock.history.post[0].data)
    expect(body.changes).toHaveLength(1)
    expect(body.changes[0].key).toBe('currentEvent')
    expect(body.changes[0].value).toBe('winter')
    expect(new Date(body.changes[0].applyAt).getTime()).toBeGreaterThan(Date.now())

    expect(await screen.findByText('Change scheduled')).toBeInTheDocument()
  })

  it('schedules a prop deletion', async () => {
    axiosMock.onGet(scheduledChangesUrl).reply(200, { changes: [] })
    axiosMock.onPost(scheduledChangesUrl).replyOnce(200, { changes: [scheduledChange] })

    renderPage()

    await userEvent.click(await screen.findByRole('button', { name: 'Scheduled change' }))
    await userEvent.type(screen.getByLabelText('Key'), 'currentEvent')
    await userEvent.click(screen.getByLabelText('Delete this prop when applied'))
    await userEvent.click(screen.getByText('Schedule'))

    await waitFor(() => {
      expect(axiosMock.history.post.length).toBe(1)
    })

    const body = JSON.parse(axiosMock.history.post[0].data)
    expect(body.changes[0].value).toBeNull()
  })
})
