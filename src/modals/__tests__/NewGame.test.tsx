import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewGame from '../NewGame'
import api from '../../api/api'
import MockAdapter from 'axios-mock-adapter'
import userState from '../../state/userState'
import KitchenSink from '../../utils/KitchenSink'

describe('<NewGame />', () => {
  const axiosMock = new MockAdapter(api)

  it('should create a game', async () => {
    axiosMock.onPost('http://talo.api/games').replyOnce(200, { game: { id: 1, name: 'Shattered' } })

    const closeMock = vi.fn()
    const userChangeMock = vi.fn()

    render(
      <KitchenSink states={[{ node: userState, onChange: userChangeMock, initialValue: { organisation: { games: [] } } }]}>
        <NewGame modalState={[true, closeMock]} />
      </KitchenSink>
    )

    await userEvent.type(screen.getByLabelText('Name'), 'Shattered')

    await userEvent.click(screen.getByText('Create'))

    await waitFor(() => {
      expect(closeMock).toHaveBeenCalled()
    })

    expect(userChangeMock).toHaveBeenCalledWith({
      organisation: {
        games: [{ id: 1, name: 'Shattered' }]
      }
    })
  })

  it('should handle creation errors', async () => {
    axiosMock.onPost('http://talo.api/games').networkErrorOnce()

    const closeMock = vi.fn()
    const userChangeMock = vi.fn()

    render(
      <KitchenSink states={[{ node: userState, onChange: userChangeMock, initialValue: { organisation: { games: [] } } }]}>
        <NewGame modalState={[true, closeMock]} />
      </KitchenSink>
    )

    await userEvent.type(screen.getByLabelText('Name'), 'Shattered')

    await userEvent.click(screen.getByText('Create'))

    await waitFor(() => {
      expect(screen.getByText('Network Error')).toBeInTheDocument()
    })
  })

  it('should close when clicking cancel', async () => {
    const closeMock = vi.fn()
    const userChangeMock = vi.fn()

    render(
      <KitchenSink states={[{ node: userState, onChange: userChangeMock, initialValue: { organisation: { games: [] } } }]}>
        <NewGame modalState={[true, closeMock]} />
      </KitchenSink>
    )

    await userEvent.click(screen.getByText('Cancel'))

    expect(closeMock).toHaveBeenCalled()
  })
})
