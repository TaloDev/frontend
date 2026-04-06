import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MockAdapter from 'axios-mock-adapter'
import api from '../../api/api'
import ToastProvider from '../../components/toast/ToastProvider'
import { IntegrationType } from '../../entities/integration'
import activeGameState from '../../state/activeGameState'
import KitchenSink from '../../utils/KitchenSink'
import { GameCenterIntegrationDetails } from '../GameCenterIntegrationDetails'

describe('<GameCenterIntegrationDetails />', () => {
  const axiosMock = new MockAdapter(api)

  it('should enable a game center integration', async () => {
    axiosMock
      .onPost('http://talo.api/games/1/integrations')
      .replyOnce(200, { integration: { id: 1 } })

    const closeMock = vi.fn()
    const mutateMock = vi.fn()

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: { id: 1 } }]}>
        <ToastProvider>
          <GameCenterIntegrationDetails
            modalState={[true, closeMock]}
            mutate={mutateMock}
            editingIntegration={{ type: IntegrationType.GAME_CENTER }}
          />
        </ToastProvider>
      </KitchenSink>,
    )

    expect(screen.getByText('Enable')).toBeDisabled()

    await userEvent.type(screen.getByLabelText('Bundle ID'), 'com.example.game')
    expect(await screen.findByText('Enable')).toBeEnabled()

    await userEvent.click(screen.getByText('Enable'))

    expect(
      await screen.findByText('Game Center integration successfully enabled'),
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(closeMock).toHaveBeenCalled()
    })

    expect(mutateMock).toHaveBeenCalled()

    const mutator = mutateMock.mock.calls[0][0]
    expect(mutator({ integrations: [] })).toStrictEqual({
      integrations: [{ id: 1 }],
    })
  })

  it('should handle enabling errors', async () => {
    axiosMock.onPost('http://talo.api/games/1/integrations').networkErrorOnce()

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: { id: 1 } }]}>
        <ToastProvider>
          <GameCenterIntegrationDetails
            modalState={[true, vi.fn()]}
            mutate={vi.fn()}
            editingIntegration={{ type: IntegrationType.GAME_CENTER }}
          />
        </ToastProvider>
      </KitchenSink>,
    )

    await userEvent.type(screen.getByLabelText('Bundle ID'), 'com.example.game')

    expect(await screen.findByText('Enable')).toBeEnabled()
    await userEvent.click(screen.getByText('Enable'))

    expect(await screen.findByText('Network Error')).toBeInTheDocument()
  })

  it('should close the modal', async () => {
    const closeMock = vi.fn()

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: { id: 1 } }]}>
        <ToastProvider>
          <GameCenterIntegrationDetails
            modalState={[true, closeMock]}
            mutate={vi.fn()}
            editingIntegration={{ type: IntegrationType.GAME_CENTER }}
          />
        </ToastProvider>
      </KitchenSink>,
    )

    await userEvent.click(screen.getByText('Cancel'))

    await waitFor(() => {
      expect(closeMock).toHaveBeenCalled()
    })
  })

  it('should require a bundle ID', async () => {
    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: { id: 1 } }]}>
        <ToastProvider>
          <GameCenterIntegrationDetails
            modalState={[true, vi.fn()]}
            mutate={vi.fn()}
            editingIntegration={{ type: IntegrationType.GAME_CENTER }}
          />
        </ToastProvider>
      </KitchenSink>,
    )

    await userEvent.type(screen.getByLabelText('Bundle ID'), 'a')
    await userEvent.clear(screen.getByLabelText('Bundle ID'))
    expect(await screen.findByText('Bundle ID is required')).toBeInTheDocument()
  })

  it('should disable an enabled game center integration', async () => {
    axiosMock.onDelete('http://talo.api/games/1/integrations/1').replyOnce(204)

    const closeMock = vi.fn()
    const mutateMock = vi.fn()

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: { id: 1 } }]}>
        <ToastProvider>
          <GameCenterIntegrationDetails
            modalState={[true, closeMock]}
            mutate={mutateMock}
            editingIntegration={{
              id: 1,
              type: IntegrationType.GAME_CENTER,
              config: {
                bundleId: 'com.example.game',
              },
            }}
          />
        </ToastProvider>
      </KitchenSink>,
    )

    await userEvent.click(screen.getByText('Disable'))

    await waitFor(() => {
      expect(closeMock).toHaveBeenCalled()
    })

    expect(mutateMock).toHaveBeenCalled()

    expect(
      await screen.findByText('Game Center integration successfully disabled'),
    ).toBeInTheDocument()

    const mutator = mutateMock.mock.calls[0][0]
    expect(mutator({ integrations: [{ id: 1 }, { id: 2 }] })).toStrictEqual({
      integrations: [{ id: 2 }],
    })
  })

  it('should handle disabling errors', async () => {
    axiosMock.onDelete('http://talo.api/games/1/integrations/1').networkErrorOnce()

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: { id: 1 } }]}>
        <ToastProvider>
          <GameCenterIntegrationDetails
            modalState={[true, vi.fn()]}
            mutate={vi.fn()}
            editingIntegration={{
              id: 1,
              type: IntegrationType.GAME_CENTER,
              config: {
                bundleId: 'com.example.game',
              },
            }}
          />
        </ToastProvider>
      </KitchenSink>,
    )

    await userEvent.click(screen.getByText('Disable'))
    expect(await screen.findByText('Network Error')).toBeInTheDocument()
  })

  it('should update the game center integration bundle ID', async () => {
    axiosMock
      .onPatch('http://talo.api/games/1/integrations/1')
      .replyOnce(200, { integration: { id: 1 } })

    const mutateMock = vi.fn()

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: { id: 1 } }]}>
        <ToastProvider>
          <GameCenterIntegrationDetails
            modalState={[true, vi.fn()]}
            mutate={mutateMock}
            editingIntegration={{
              id: 1,
              type: IntegrationType.GAME_CENTER,
              config: {
                bundleId: 'com.example.game',
              },
            }}
          />
        </ToastProvider>
      </KitchenSink>,
    )

    await userEvent.type(screen.getByLabelText('Bundle ID'), 'com.new.game')
    await userEvent.click(screen.getByText('Update bundle ID'))

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalled()
    })

    expect(await screen.findByText('Bundle ID successfully updated')).toBeInTheDocument()

    const mutator = mutateMock.mock.calls[0][0]
    expect(mutator({ integrations: [{ id: 1 }, { id: 2 }] })).toStrictEqual({
      integrations: [{ id: 1 }, { id: 2 }],
    })
  })

  it('should handle updating errors', async () => {
    axiosMock.onPatch('http://talo.api/games/1/integrations/1').networkErrorOnce()

    const mutateMock = vi.fn()

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: { id: 1 } }]}>
        <ToastProvider>
          <GameCenterIntegrationDetails
            modalState={[true, vi.fn()]}
            mutate={mutateMock}
            editingIntegration={{
              id: 1,
              type: IntegrationType.GAME_CENTER,
              config: {
                bundleId: 'com.example.game',
              },
            }}
          />
        </ToastProvider>
      </KitchenSink>,
    )

    await userEvent.type(screen.getByLabelText('Bundle ID'), 'com.new.game')
    await userEvent.click(screen.getByText('Update bundle ID'))

    expect(await screen.findByText('Network Error')).toBeInTheDocument()

    expect(mutateMock).not.toHaveBeenCalled()
  })
})
