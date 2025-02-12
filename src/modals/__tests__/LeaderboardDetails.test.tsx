import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LeaderboardDetails from '../LeaderboardDetails'
import api from '../../api/api'
import MockAdapter from 'axios-mock-adapter'
import activeGameState from '../../state/activeGameState'
import userState from '../../state/userState'
import KitchenSink from '../../utils/KitchenSink'
import { UserType } from '../../entities/user'
import { LeaderboardSortMode, LeaderboardRefreshInterval } from '../../entities/leaderboard'
import leaderboardMock from '../../__mocks__/leaderboardMock'

describe('<LeaderboardDetails />', () => {
  const axiosMock = new MockAdapter(api)
  const activeGameValue = { id: 1, name: 'Shattered' }

  it('should create a leaderboard', async () => {
    axiosMock.onPost('http://talo.api/games/1/leaderboards').replyOnce(200, { leaderboard: { id: 4 } })

    const closeMock = vi.fn()
    const mutateMock = vi.fn()

    render(
      <KitchenSink states={[
        { node: userState, initialValue: { type: UserType.ADMIN } },
        { node: activeGameState, initialValue: activeGameValue }
      ]}>
        <LeaderboardDetails modalState={[true, closeMock]} mutate={mutateMock} editingLeaderboard={null} />
      </KitchenSink>
    )

    await userEvent.type(screen.getByLabelText('Internal name'), 'score')
    await userEvent.type(screen.getByLabelText('Display name'), 'Score')

    await userEvent.click(screen.getByLabelText('Sort mode'))
    await userEvent.click(screen.getByText('Ascending'))

    await userEvent.click(screen.getByText('Yes'))
    await userEvent.click(screen.getByText('Create'))

    await waitFor(() => {
      expect(closeMock).toHaveBeenCalled()
    })

    expect(mutateMock).toHaveBeenCalled()

    const leaderboards = [
      { id: 1 },
      { id: 2 },
      { id: 3 }
    ]

    const mutator = mutateMock.mock.calls[0][0]
    expect(mutator({ leaderboards })).toStrictEqual({
      leaderboards: [...leaderboards, { id: 4 }]
    })
  })

  it('should handle creation errors', async () => {
    axiosMock.onPost('http://talo.api/games/1/leaderboards').networkErrorOnce()

    const closeMock = vi.fn()

    render(
      <KitchenSink states={[
        { node: userState, initialValue: { type: UserType.ADMIN } },
        { node: activeGameState, initialValue: activeGameValue }
      ]}>
        <LeaderboardDetails modalState={[true, closeMock]} mutate={vi.fn()} editingLeaderboard={null} />
      </KitchenSink>
    )

    await userEvent.type(screen.getByLabelText('Internal name'), 'score')
    await userEvent.type(screen.getByLabelText('Display name'), 'Score')

    await userEvent.click(screen.getByText('Create'))

    await waitFor(() => {
      expect(screen.getByText('Network Error')).toBeInTheDocument()
    })
  })

  it('should close when clicking close', async () => {
    const closeMock = vi.fn()

    render(
      <KitchenSink states={[
        { node: userState, initialValue: { type: UserType.ADMIN } },
        { node: activeGameState, initialValue: activeGameValue }
      ]}>
        <LeaderboardDetails modalState={[true, closeMock]} mutate={vi.fn()} editingLeaderboard={null} />
      </KitchenSink>
    )

    await userEvent.click(screen.getByText('Close'))

    expect(closeMock).toHaveBeenCalled()
  })

  it('should prefill details if a leaderboard is being edited', () => {
    render(
      <KitchenSink states={[
        { node: userState, initialValue: { type: UserType.ADMIN } },
        { node: activeGameState, initialValue: activeGameValue }
      ]}>
        <LeaderboardDetails
          modalState={[true, vi.fn()]}
          mutate={vi.fn()}
          editingLeaderboard={leaderboardMock({
            sortMode: LeaderboardSortMode.ASC,
            unique: true,
            refreshInterval: LeaderboardRefreshInterval.WEEKLY
          })}
        />
      </KitchenSink>
    )

    expect(screen.getByLabelText('Internal name')).toHaveValue('score')
    expect(screen.getByLabelText('Display name')).toHaveValue('Score')
    expect(screen.getByText('Ascending')).toBeInTheDocument()
    expect(screen.getByText('Weekly')).toBeInTheDocument()
    expect(screen.getByLabelText('Yes')).toBeChecked()

    expect(screen.getByText('Update')).toBeInTheDocument()
  })

  it('should update a leaderboard', async () => {
    const closeMock = vi.fn()
    const mutateMock = vi.fn()

    const initialLeaderboard = leaderboardMock({ unique: false })

    axiosMock.onPut('http://talo.api/games/1/leaderboards/1').replyOnce(200, {
      leaderboard: {
        ...initialLeaderboard, unique: true
      }
    })

    render(
      <KitchenSink states={[
        { node: userState, initialValue: { type: UserType.ADMIN } },
        { node: activeGameState, initialValue: activeGameValue }
      ]}>
        <LeaderboardDetails
          modalState={[true, closeMock]}
          mutate={mutateMock}
          editingLeaderboard={initialLeaderboard}
        />
      </KitchenSink>
    )

    await userEvent.click(screen.getByText('Yes'))
    await userEvent.click(screen.getByText('Update'))

    await waitFor(() => {
      expect(closeMock).toHaveBeenCalled()
    })

    expect(mutateMock).toHaveBeenCalled()

    const mutator = mutateMock.mock.calls[0][0]
    expect(mutator({ leaderboards: [initialLeaderboard, { id: 2 }] })).toStrictEqual({
      leaderboards: [{ ...initialLeaderboard, unique: true }, { id: 2 }]
    })
  })

  it('should handle updating errors', async () => {
    axiosMock.onPut('http://talo.api/games/1/leaderboards/1').networkErrorOnce()

    render(
      <KitchenSink states={[
        { node: userState, initialValue: { type: UserType.ADMIN } },
        { node: activeGameState, initialValue: activeGameValue }
      ]}>
        <LeaderboardDetails
          modalState={[true, vi.fn()]}
          mutate={vi.fn()}
          editingLeaderboard={leaderboardMock()}
        />
      </KitchenSink>
    )

    await userEvent.click(screen.getByText('Update'))

    await waitFor(() => {
      expect(screen.getByText('Network Error')).toBeInTheDocument()
    })
  })

  it('should delete a leaderboard', async () => {
    const closeMock = vi.fn()
    const mutateMock = vi.fn()

    const initialLeaderboard = leaderboardMock()

    axiosMock.onDelete('http://talo.api/games/1/leaderboards/1').replyOnce(200)
    window.confirm = vi.fn(() => true)

    render(
      <KitchenSink states={[
        { node: userState, initialValue: { type: UserType.ADMIN } },
        { node: activeGameState, initialValue: activeGameValue }
      ]}>
        <LeaderboardDetails
          modalState={[true, closeMock]}
          mutate={mutateMock}
          editingLeaderboard={initialLeaderboard}
        />
      </KitchenSink>
    )

    await userEvent.click(screen.getByText('Delete'))

    await waitFor(() => {
      expect(closeMock).toHaveBeenCalled()
    })

    expect(mutateMock).toHaveBeenCalled()

    const mutator = mutateMock.mock.calls[0][0]
    expect(mutator({ leaderboards: [initialLeaderboard, { id: 2 }] })).toStrictEqual({
      leaderboards: [{ id: 2 }]
    })
  })

  it('should not render the delete button for dev users', () => {
    const initialLeaderboard = leaderboardMock()

    render(
      <KitchenSink states={[
        { node: userState, initialValue: { type: UserType.DEV } },
        { node: activeGameState, initialValue: activeGameValue }
      ]}>
        <LeaderboardDetails
          modalState={[true, vi.fn()]}
          mutate={vi.fn()}
          editingLeaderboard={initialLeaderboard}
        />
      </KitchenSink>
    )

    expect(screen.queryByText('Delete')).not.toBeInTheDocument()
  })

  it('should handle deleting errors', async () => {
    axiosMock.onDelete('http://talo.api/games/1/leaderboards/1').networkErrorOnce()

    const closeMock = vi.fn()

    render(
      <KitchenSink states={[
        { node: userState, initialValue: { type: UserType.ADMIN } },
        { node: activeGameState, initialValue: activeGameValue }
      ]}>
        <LeaderboardDetails
          modalState={[true, closeMock]}
          mutate={vi.fn()}
          editingLeaderboard={leaderboardMock()}
        />
      </KitchenSink>
    )

    await userEvent.click(screen.getByText('Delete'))

    await waitFor(() => {
      expect(screen.getByText('Network Error')).toBeInTheDocument()
    })
  })

  it('should create a leaderboard with daily refresh', async () => {
    axiosMock.onPost('http://talo.api/games/1/leaderboards').replyOnce(200, { leaderboard: { id: 4 } })

    const closeMock = vi.fn()
    const mutateMock = vi.fn()

    render(
      <KitchenSink states={[
        { node: userState, initialValue: { type: UserType.ADMIN } },
        { node: activeGameState, initialValue: activeGameValue }
      ]}>
        <LeaderboardDetails modalState={[true, closeMock]} mutate={mutateMock} editingLeaderboard={null} />
      </KitchenSink>
    )

    await userEvent.type(screen.getByLabelText('Internal name'), 'score')
    await userEvent.type(screen.getByLabelText('Display name'), 'Score')

    await userEvent.click(screen.getByLabelText('Refresh entries'))
    await userEvent.click(screen.getByText('Daily'))

    await userEvent.click(screen.getByText('Create'))

    await waitFor(() => {
      expect(closeMock).toHaveBeenCalled()
    })

    expect(mutateMock).toHaveBeenCalled()
  })
})
