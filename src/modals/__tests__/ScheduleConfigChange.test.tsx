import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MockAdapter from 'axios-mock-adapter'
import { vi } from 'vitest'
import api from '../../api/api'
import { UserType } from '../../entities/user'
import { activeGameState } from '../../state/activeGameState'
import { AuthedUser, userState } from '../../state/userState'
import KitchenSink from '../../utils/KitchenSink'
import ScheduleConfigChange from '../ScheduleConfigChange'

describe('<ScheduleConfigChange />', () => {
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
    props: [],
    createdAt: '2025-01-01T00:00:00Z',
  }

  const url = 'http://talo.api/games/1/game-config/scheduled-changes'

  beforeEach(() => {
    axiosMock.reset()
    localStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const renderModal = (mutate = vi.fn()) => {
    render(
      <KitchenSink
        states={[
          { node: userState, initialValue: user },
          { node: activeGameState, initialValue: activeGame },
        ]}
      >
        <ScheduleConfigChange modalState={[true, vi.fn()]} mutate={mutate} />
      </KitchenSink>,
    )

    return mutate
  }

  it('rejects an apply time in the past', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-15T12:00:00Z'))

    renderModal()

    fireEvent.change(screen.getByLabelText('Apply at'), { target: { value: '00:00' } })

    expect(screen.getByText('The apply time must be in the future')).toBeInTheDocument()
    expect(screen.getByText('Schedule')).toBeDisabled()
  })

  it('clears the value when scheduling a delete', async () => {
    renderModal()

    await userEvent.type(screen.getByLabelText('Value'), 'winter')
    await userEvent.click(screen.getByLabelText('Delete this prop when applied'))

    const valueInput = screen.getByLabelText('Value')
    expect(valueInput).toHaveValue('')
    expect(valueInput).toBeDisabled()
    expect(valueInput).toHaveAttribute('placeholder', 'This prop will be deleted when applied')
  })

  it('renders scheduling errors', async () => {
    axiosMock.onPost(url).networkErrorOnce()

    renderModal()

    await userEvent.type(screen.getByLabelText('Key'), 'currentEvent')
    expect(screen.getByText('Schedule')).toBeEnabled()
    await userEvent.click(screen.getByText('Schedule'))

    await waitFor(() => {
      expect(axiosMock.history.post.length, 'posts').toBe(1)
    })
    expect(await screen.findByText('Network Error')).toBeInTheDocument()
  })
})
