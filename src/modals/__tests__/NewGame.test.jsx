import React from 'react'
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
    axiosMock.onPost('http://talo.test/games').replyOnce(200, { game: { id: 1, name: 'Shattered' } })

    const closeMock = jest.fn()
    const userChangeMock = jest.fn()

    render(
      <KitchenSink states={[{ node: userState, onChange: userChangeMock, initialValue: { organisation: { games: [] } } }]}>
        <NewGame modalState={[true, closeMock]} />
      </KitchenSink>
    )

    userEvent.type(screen.getByLabelText('Name'), 'Shattered')

    userEvent.click(screen.getByText('Create'))

    await waitFor(() => {
      expect(closeMock).toHaveBeenCalled()
      expect(userChangeMock).toHaveBeenCalledWith({
        organisation: {
          games: [{ id: 1, name: 'Shattered' }]
        }
      })
    })
  })

  it('should handle creation errors', async () => {
    axiosMock.onPost('http://talo.test/games').networkErrorOnce()

    const closeMock = jest.fn()
    const userChangeMock = jest.fn()

    render(
      <KitchenSink states={[{ node: userState, onChange: userChangeMock, initialValue: { organisation: { games: [] } } }]}>
        <NewGame modalState={[true, closeMock]} />
      </KitchenSink>
    )

    userEvent.type(screen.getByLabelText('Name'), 'Shattered')

    userEvent.click(screen.getByText('Create'))

    await waitFor(() => {
      expect(screen.getByText('Network Error')).toBeInTheDocument()
    })
  })

  it('should close when clicking cancel', () => {
    const closeMock = jest.fn()
    const userChangeMock = jest.fn()

    render(
      <KitchenSink states={[{ node: userState, onChange: userChangeMock, initialValue: { organisation: { games: [] } } }]}>
        <NewGame modalState={[true, closeMock]} />
      </KitchenSink>
    )

    userEvent.click(screen.getByText('Cancel'))

    expect(closeMock).toHaveBeenCalled()
  })
})
