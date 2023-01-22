import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GroupDetails from '../GroupDetails'
import api from '../../../api/api'
import MockAdapter from 'axios-mock-adapter'
import activeGameState from '../../../state/activeGameState'
import userState from '../../../state/userState'
import userTypes from '../../../constants/userTypes'
import KitchenSink from '../../../utils/KitchenSink'

describe('<GroupDetails />', () => {
  const axiosMock = new MockAdapter(api)
  const activeGameValue = { id: '1', name: 'Shattered' }
  axiosMock.onGet(/(.*)preview-count(.*)/).reply(200, { count: 8 })

  it('should create a group', async () => {
    axiosMock.onPost('http://talo.api/games/1/player-groups').replyOnce(200, { group: { id: 2 } })

    const closeMock = vi.fn()
    const mutateMock = vi.fn()

    render(
      <KitchenSink states={[
        { node: userState, initialValue: { type: userTypes.ADMIN } },
        { node: activeGameState, initialValue: activeGameValue }
      ]}>
        <GroupDetails modalState={[true, closeMock]} mutate={mutateMock} />
      </KitchenSink>
    )

    await userEvent.type(screen.getByLabelText('Name'), 'Winners')
    await userEvent.type(screen.getByLabelText('Description'), 'Players who have won the game')

    await screen.findByText('8 players in group')

    await waitFor(() => expect(screen.getByText('Create')).toBeEnabled())
    await userEvent.click(screen.getByText('Create'))

    await waitFor(() => {
      expect(closeMock).toHaveBeenCalled()
    })

    expect(mutateMock).toHaveBeenCalled()

    const groups = [
      { id: '1' }
    ]

    const mutator = mutateMock.mock.calls[0][0]
    expect(mutator({ groups })).toStrictEqual({
      groups: [...groups, { id: 2 }]
    })
  })

  it('should handle creation errors', async () => {
    axiosMock.onPost('http://talo.api/games/1/player-groups').networkErrorOnce()

    const closeMock = vi.fn()

    render(
      <KitchenSink states={[
        { node: userState, initialValue: { type: userTypes.ADMIN } },
        { node: activeGameState, initialValue: activeGameValue }
      ]}>
        <GroupDetails modalState={[true, closeMock]} mutate={vi.fn()} />
      </KitchenSink>
    )

    await userEvent.type(screen.getByLabelText('Name'), 'Winners')
    await userEvent.type(screen.getByLabelText('Description'), 'Players who have won the game')

    await waitFor(() => expect(screen.getByText('Create')).toBeEnabled())
    await userEvent.click(screen.getByText('Create'))

    await waitFor(() => {
      expect(screen.getByText('Network Error')).toBeInTheDocument()
    })
  })

  it('should close when clicking close', async () => {
    const closeMock = vi.fn()

    render(
      <KitchenSink states={[
        { node: userState, initialValue: { type: userTypes.ADMIN } },
        { node: activeGameState, initialValue: activeGameValue }
      ]}>
        <GroupDetails modalState={[true, closeMock]} mutate={vi.fn()} />
      </KitchenSink>
    )

    await userEvent.click(screen.getByText('Close'))

    expect(closeMock).toHaveBeenCalled()
  })

  it('should prefill details if a group is being edited', () => {
    render(
      <KitchenSink states={[
        { node: userState, initialValue: { type: userTypes.ADMIN } },
        { node: activeGameState, initialValue: activeGameValue }
      ]}>
        <GroupDetails
          modalState={[true, vi.fn()]}
          mutate={vi.fn()}
          editingGroup={{
            id: '1',
            name: 'Winners',
            description: 'Players who have won the game',
            rules: [
              { name: 'SET', negate: false, operands: [], field: 'props.hasWonGame', castType: 'CHAR' },
              { name: 'GTE', negate: false, operands: ['70'], field: 'props.currentLevel', castType: 'DOUBLE' }
            ],
            ruleMode: '$and'
          }}
        />
      </KitchenSink>
    )

    expect(screen.getByLabelText('Name')).toHaveValue('Winners')
    expect(screen.getByLabelText('Description')).toHaveValue('Players who have won the game')

    expect(screen.getByText('Update')).toBeInTheDocument()
  })

  it('should update a group', async () => {
    const closeMock = vi.fn()
    const mutateMock = vi.fn()

    const initialGroup = {
      id: '1',
      name: 'Winners',
      description: 'Players who have won the game',
      rules: [
        { name: 'SET', negate: false, operands: [], field: 'props.hasWonGame', castType: 'CHAR' },
        { name: 'GTE', negate: false, operands: ['70'], field: 'props.currentLevel', castType: 'DOUBLE' }
      ],
      ruleMode: '$and'
    }

    axiosMock.onPut('http://talo.api/games/1/player-groups/1').replyOnce(200, {
      group: {
        ...initialGroup, name: 'High level winners'
      }
    })

    render(
      <KitchenSink states={[
        { node: userState, initialValue: { type: userTypes.ADMIN } },
        { node: activeGameState, initialValue: activeGameValue }
      ]}>
        <GroupDetails
          modalState={[true, closeMock]}
          mutate={mutateMock}
          editingGroup={initialGroup}
        />
      </KitchenSink>
    )

    await userEvent.type(screen.getByText('Name'), 'High level winners')

    await waitFor(() => expect(screen.getByText('Update')).toBeEnabled())
    await userEvent.click(screen.getByText('Update'))

    await waitFor(() => {
      expect(closeMock).toHaveBeenCalled()
    })

    expect(mutateMock).toHaveBeenCalled()

    const mutator = mutateMock.mock.calls[0][0]
    expect(mutator({ groups: [initialGroup, { id: 2 }] })).toStrictEqual({
      groups: [{ ...initialGroup, name: 'High level winners' }, { id: 2 }]
    })
  })

  it('should handle updating errors', async () => {
    axiosMock.onPut('http://talo.api/games/1/player-groups/1').networkErrorOnce()

    const closeMock = vi.fn()

    render(
      <KitchenSink states={[
        { node: userState, initialValue: { type: userTypes.ADMIN } },
        { node: activeGameState, initialValue: activeGameValue }
      ]}>
        <GroupDetails
          modalState={[true, closeMock]}
          mutate={vi.fn()}
          editingGroup={{
            id: '1',
            name: 'Winners',
            description: 'Players who have won the game',
            rules: [],
            ruleMode: '$and'
          }}
        />
      </KitchenSink>
    )

    await waitFor(() => expect(screen.getByText('Update')).toBeEnabled())
    await userEvent.click(screen.getByText('Update'))

    await waitFor(() => {
      expect(screen.getByText('Network Error')).toBeInTheDocument()
    })
  })

  it('should delete a group', async () => {
    const closeMock = vi.fn()
    const mutateMock = vi.fn()

    const initialGroup = {
      id: '1',
      name: 'Winners',
      description: 'Players who have won the game',
      rules: [],
      ruleMode: '$and'
    }

    axiosMock.onDelete('http://talo.api/games/1/player-groups/1').replyOnce(200)
    window.confirm = vi.fn(() => true)

    render(
      <KitchenSink states={[
        { node: userState, initialValue: { type: userTypes.ADMIN } },
        { node: activeGameState, initialValue: activeGameValue }
      ]}>
        <GroupDetails
          modalState={[true, closeMock]}
          mutate={mutateMock}
          editingGroup={initialGroup}
        />
      </KitchenSink>
    )

    await userEvent.click(screen.getByText('Delete'))

    await waitFor(() => {
      expect(closeMock).toHaveBeenCalled()
    })

    expect(mutateMock).toHaveBeenCalled()

    const mutator = mutateMock.mock.calls[0][0]
    expect(mutator({ groups: [initialGroup, { id: 2 }] })).toStrictEqual({
      groups: [{ id: 2 }]
    })
  })

  it('should not render the delete button for demo users', () => {
    const initialGroup = {
      id: '1',
      name: 'Winners',
      description: 'Players who have won the game',
      rules: [],
      ruleMode: '$and'
    }

    render(
      <KitchenSink states={[
        { node: userState, initialValue: { type: userTypes.DEMO } },
        { node: activeGameState, initialValue: activeGameValue }
      ]}>
        <GroupDetails
          modalState={[true, vi.fn()]}
          mutate={vi.fn()}
          editingGroup={initialGroup}
        />
      </KitchenSink>
    )

    expect(screen.queryByText('Delete')).not.toBeInTheDocument()
  })

  it('should handle deleting errors', async () => {
    axiosMock.onDelete('http://talo.api/games/1/player-groups/1').networkErrorOnce()

    const closeMock = vi.fn()

    render(
      <KitchenSink states={[
        { node: userState, initialValue: { type: userTypes.ADMIN } },
        { node: activeGameState, initialValue: activeGameValue }
      ]}>
        <GroupDetails
          modalState={[true, closeMock]}
          mutate={vi.fn()}
          editingGroup={{
            id: '1',
            name: 'Winners',
            description: 'Players who have won the game',
            rules: [],
            ruleMode: '$and'
          }}
        />
      </KitchenSink>
    )

    await userEvent.click(screen.getByText('Delete'))

    await waitFor(() => {
      expect(screen.getByText('Network Error')).toBeInTheDocument()
    })
  })
})
