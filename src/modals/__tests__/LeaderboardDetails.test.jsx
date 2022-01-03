import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LeaderboardDetails from '../LeaderboardDetails'
import api from '../../api/api'
import MockAdapter from 'axios-mock-adapter'
import { RecoilRoot } from 'recoil'
import RecoilObserver from '../../state/RecoilObserver'
import activeGameState from '../../state/activeGameState'

describe('<LeaderboardDetails />', () => {
  const axiosMock = new MockAdapter(api)
  const activeGameValue = { id: 1, name: 'Shattered' }

  it('should create a leaderboard', async () => {
    axiosMock.onPost('http://talo.test/leaderboards').replyOnce(200, { leaderboard: { id: 4 } })

    const closeMock = jest.fn()
    const mutateMock = jest.fn()

    render(
      <RecoilObserver node={activeGameState} initialValue={activeGameValue}>
        <LeaderboardDetails modalState={[true, closeMock]} mutate={mutateMock} />
      </RecoilObserver>,
      { wrapper: RecoilRoot }
    )

    userEvent.type(screen.getByLabelText('Internal name'), 'score')

    userEvent.type(screen.getByLabelText('Display name'), 'Score')

    userEvent.click(screen.getByLabelText('Sort mode'))
    userEvent.click(screen.getByText('Ascending'))

    userEvent.click(screen.getByText('Yes'))

    userEvent.click(screen.getByText('Create'))

    await waitFor(() => {
      expect(closeMock).toHaveBeenCalled()
      expect(mutateMock).toHaveBeenCalled()
    })

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
    axiosMock.onPost('http://talo.test/leaderboards').networkErrorOnce()

    const closeMock = jest.fn()

    render(
      <RecoilObserver node={activeGameState} initialValue={activeGameValue}>
        <LeaderboardDetails modalState={[true, closeMock]} mutate={jest.fn()} />
      </RecoilObserver>,
      { wrapper: RecoilRoot }
    )

    userEvent.type(screen.getByLabelText('Internal name'), 'score')
    userEvent.type(screen.getByLabelText('Display name'), 'Score')

    userEvent.click(screen.getByText('Create'))

    await waitFor(() => {
      expect(screen.getByText('Network Error')).toBeInTheDocument()
    })
  })

  it('should close when clicking cancel', () => {
    const closeMock = jest.fn()

    render(
      <RecoilObserver node={activeGameState} initialValue={activeGameValue}>
        <LeaderboardDetails modalState={[true, closeMock]} mutate={jest.fn()} />
      </RecoilObserver>,
      { wrapper: RecoilRoot }
    )

    userEvent.click(screen.getByText('Cancel'))

    expect(closeMock).toHaveBeenCalled()
  })

  it('should prefill details if a leaderboard is being edited', () => {
    render(
      <RecoilObserver node={activeGameState} initialValue={activeGameValue}>
        <LeaderboardDetails
          modalState={[true, jest.fn()]}
          mutate={jest.fn()}
          editingLeaderboard={{
            internalName: 'score',
            name: 'Score',
            sortMode: 'asc',
            unique: true
          }}
        />
      </RecoilObserver>,
      { wrapper: RecoilRoot }
    )

    expect(screen.getByLabelText('Internal name')).toHaveValue('score')
    expect(screen.getByLabelText('Display name')).toHaveValue('Score')
    expect(screen.getByText('Ascending')).toBeInTheDocument()
    expect(screen.getByLabelText('Yes')).toBeChecked(true)

    expect(screen.getByText('Update')).toBeInTheDocument()
  })

  it('should update a leaderboard', async () => {
    const closeMock = jest.fn()
    const mutateMock = jest.fn()

    const initialLeaderboard = {
      id: 1,
      internalName: 'score',
      name: 'Score',
      sortMode: 'asc',
      unique: false
    }

    axiosMock.onPatch('http://talo.test/leaderboards/score').replyOnce(200, {
      leaderboard: {
        ...initialLeaderboard, unique: true
      }
    })

    render(
      <RecoilObserver node={activeGameState} initialValue={activeGameValue}>
        <LeaderboardDetails
          modalState={[true, closeMock]}
          mutate={mutateMock}
          editingLeaderboard={initialLeaderboard}
        />
      </RecoilObserver>,
      { wrapper: RecoilRoot }
    )

    userEvent.click(screen.getByText('Yes'))
    userEvent.click(screen.getByText('Update'))

    await waitFor(() => {
      expect(closeMock).toHaveBeenCalled()
      expect(mutateMock).toHaveBeenCalled()
    })

    const mutator = mutateMock.mock.calls[0][0]
    expect(mutator({ leaderboards: [initialLeaderboard, { id: 2 }] })).toStrictEqual({
      leaderboards: [{ ...initialLeaderboard, unique: true }, { id: 2 }]
    })
  })

  it('should handle updating errors', async () => {
    axiosMock.onPatch('http://talo.test/leaderboards/score').networkErrorOnce()

    const closeMock = jest.fn()

    render(
      <RecoilObserver node={activeGameState} initialValue={activeGameValue}>
        <LeaderboardDetails
          modalState={[true, closeMock]}
          mutate={jest.fn()}
          editingLeaderboard={{
            internalName: 'score',
            name: 'Score',
            sortMode: 'asc',
            unique: false
          }}
        />
      </RecoilObserver>,
      { wrapper: RecoilRoot }
    )

    userEvent.click(screen.getByText('Update'))

    await waitFor(() => {
      expect(screen.getByText('Network Error')).toBeInTheDocument()
    })
  })
})
