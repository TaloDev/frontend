import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import api from '../../api/api'
import MockAdapter from 'axios-mock-adapter'
import activeGameState from '../../state/activeGameState'
import userState from '../../state/userState'
import KitchenSink from '../../utils/KitchenSink'
import FeedbackCategoryDetails from '../FeedbackCategoryDetails'
import { UserType } from '../../entities/user'
import gameFeedbackCategoryMock from '../../__mocks__/gameFeedbackCategoryMock'

describe('<FeedbackCategoryDetails />', () => {
  const axiosMock = new MockAdapter(api)
  const activeGameValue = { id: 1, name: 'Shattered' }

  it('should create a feedback category', async () => {
    axiosMock.onPost('http://talo.api/games/1/game-feedback/categories').replyOnce(200, { feedbackCategory: { id: 4 } })

    const closeMock = vi.fn()
    const mutateMock = vi.fn()

    render(
      <KitchenSink states={[
        { node: userState, initialValue: { type: UserType.ADMIN } },
        { node: activeGameState, initialValue: activeGameValue }
      ]}>
        <FeedbackCategoryDetails modalState={[true, closeMock]} mutate={mutateMock} editingCategory={null} />
      </KitchenSink>
    )

    await userEvent.type(screen.getByLabelText('Internal name'), 'bugs')
    await userEvent.type(screen.getByLabelText('Display name'), 'Bugs')
    await userEvent.type(screen.getByLabelText('Description'), 'Bug reports')
    await userEvent.click(screen.getByText('Yes'))

    await userEvent.click(screen.getByText('Create'))

    await waitFor(() => {
      expect(closeMock).toHaveBeenCalled()
    })

    expect(mutateMock).toHaveBeenCalled()

    const feedbackCategories = [
      { id: 1 },
      { id: 2 },
      { id: 3 }
    ]

    const mutator = mutateMock.mock.calls[0][0]
    expect(mutator({ feedbackCategories })).toStrictEqual({
      feedbackCategories: [...feedbackCategories, { id: 4 }]
    })
  })

  it('should handle creation errors', async () => {
    axiosMock.onPost('http://talo.api/games/1/game-feedback/categories').networkErrorOnce()

    const closeMock = vi.fn()

    render(
      <KitchenSink states={[
        { node: userState, initialValue: { type: UserType.ADMIN } },
        { node: activeGameState, initialValue: activeGameValue }
      ]}>
        <FeedbackCategoryDetails modalState={[true, closeMock]} mutate={vi.fn()} editingCategory={null} />
      </KitchenSink>
    )

    await userEvent.type(screen.getByLabelText('Internal name'), 'bugs')
    await userEvent.type(screen.getByLabelText('Display name'), 'Bugs')
    await userEvent.type(screen.getByLabelText('Description'), 'Bug reports')
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
        <FeedbackCategoryDetails modalState={[true, closeMock]} mutate={vi.fn()} editingCategory={null} />
      </KitchenSink>
    )

    await userEvent.click(screen.getByText('Close'))

    expect(closeMock).toHaveBeenCalled()
  })

  it('should prefill details if a category is being edited', () => {
    render(
      <KitchenSink states={[
        { node: userState, initialValue: { type: UserType.ADMIN } },
        { node: activeGameState, initialValue: activeGameValue }
      ]}>
        <FeedbackCategoryDetails
          modalState={[true, vi.fn()]}
          mutate={vi.fn()}
          editingCategory={gameFeedbackCategoryMock({ anonymised: true })}
        />
      </KitchenSink>
    )

    expect(screen.getByLabelText('Internal name')).toHaveValue('bugs')
    expect(screen.getByLabelText('Display name')).toHaveValue('Bugs')
    expect(screen.getByLabelText('Description')).toHaveValue('Bug reports')
    expect(screen.getByLabelText('Yes')).toBeChecked()

    expect(screen.getByText('Update')).toBeInTheDocument()
  })

  it('should update a category', async () => {
    const closeMock = vi.fn()
    const mutateMock = vi.fn()

    const initialCategory = gameFeedbackCategoryMock()

    axiosMock.onPut('http://talo.api/games/1/game-feedback/categories/1').replyOnce(200, {
      feedbackCategory: {
        ...initialCategory, anonymised: true
      }
    })

    render(
      <KitchenSink states={[
        { node: userState, initialValue: { type: UserType.ADMIN } },
        { node: activeGameState, initialValue: activeGameValue }
      ]}>
        <FeedbackCategoryDetails
          modalState={[true, closeMock]}
          mutate={mutateMock}
          editingCategory={initialCategory}
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
    expect(mutator({ feedbackCategories: [initialCategory, { id: 2 }] })).toStrictEqual({
      feedbackCategories: [{ ...initialCategory, anonymised: true }, { id: 2 }]
    })
  })

  it('should handle updating errors', async () => {
    axiosMock.onPut('http://talo.api/games/1/game-feedback/categories/1').networkErrorOnce()

    render(
      <KitchenSink states={[
        { node: userState, initialValue: { type: UserType.ADMIN } },
        { node: activeGameState, initialValue: activeGameValue }
      ]}>
        <FeedbackCategoryDetails
          modalState={[true, vi.fn()]}
          mutate={vi.fn()}
          editingCategory={gameFeedbackCategoryMock()}
        />
      </KitchenSink>
    )

    await userEvent.click(screen.getByText('Update'))

    await waitFor(() => {
      expect(screen.getByText('Network Error')).toBeInTheDocument()
    })
  })

  it('should delete a category', async () => {
    const closeMock = vi.fn()
    const mutateMock = vi.fn()

    const initialCategory = gameFeedbackCategoryMock()

    axiosMock.onDelete('http://talo.api/games/1/game-feedback/categories/1').replyOnce(200)
    window.confirm = vi.fn(() => true)

    render(
      <KitchenSink states={[
        { node: userState, initialValue: { type: UserType.ADMIN } },
        { node: activeGameState, initialValue: activeGameValue }
      ]}>
        <FeedbackCategoryDetails
          modalState={[true, closeMock]}
          mutate={mutateMock}
          editingCategory={initialCategory}
        />
      </KitchenSink>
    )

    await userEvent.click(screen.getByText('Delete'))

    await waitFor(() => {
      expect(closeMock).toHaveBeenCalled()
    })

    expect(mutateMock).toHaveBeenCalled()

    const mutator = mutateMock.mock.calls[0][0]
    expect(mutator({ feedbackCategories: [initialCategory, { id: 2 }] })).toStrictEqual({
      feedbackCategories: [{ id: 2 }]
    })
  })

  it('should not render the delete button for dev users', () => {
    const initialCategory = gameFeedbackCategoryMock()

    render(
      <KitchenSink states={[
        { node: userState, initialValue: { type: UserType.DEV } },
        { node: activeGameState, initialValue: activeGameValue }
      ]}>
        <FeedbackCategoryDetails
          modalState={[true, vi.fn()]}
          mutate={vi.fn()}
          editingCategory={initialCategory}
        />
      </KitchenSink>
    )

    expect(screen.queryByText('Delete')).not.toBeInTheDocument()
  })

  it('should handle deleting errors', async () => {
    axiosMock.onDelete('http://talo.api/games/1/game-feedback/categories/1').networkErrorOnce()

    const closeMock = vi.fn()

    render(
      <KitchenSink states={[
        { node: userState, initialValue: { type: UserType.ADMIN } },
        { node: activeGameState, initialValue: activeGameValue }
      ]}>
        <FeedbackCategoryDetails
          modalState={[true, closeMock]}
          mutate={vi.fn()}
          editingCategory={gameFeedbackCategoryMock()}
        />
      </KitchenSink>
    )

    await userEvent.click(screen.getByText('Delete'))

    await waitFor(() => {
      expect(screen.getByText('Network Error')).toBeInTheDocument()
    })
  })
})
