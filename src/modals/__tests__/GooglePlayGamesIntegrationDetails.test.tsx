import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MockAdapter from 'axios-mock-adapter'
import api from '../../api/api'
import ToastProvider from '../../components/toast/ToastProvider'
import { IntegrationType } from '../../entities/integration'
import activeGameState from '../../state/activeGameState'
import KitchenSink from '../../utils/KitchenSink'
import { GooglePlayGamesIntegrationDetails } from '../GooglePlayGamesIntegrationDetails'

describe('<GooglePlayGamesIntegrationDetails />', () => {
  const axiosMock = new MockAdapter(api)

  it('should enable a google play games integration', async () => {
    axiosMock
      .onPost('http://talo.api/games/1/integrations')
      .replyOnce(200, { integration: { id: 1 } })

    const closeMock = vi.fn()
    const mutateMock = vi.fn()

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: { id: 1 } }]}>
        <ToastProvider>
          <GooglePlayGamesIntegrationDetails
            modalState={[true, closeMock]}
            mutate={mutateMock}
            editingIntegration={{ type: IntegrationType.GOOGLE_PLAY_GAMES }}
          />
        </ToastProvider>
      </KitchenSink>,
    )

    expect(screen.getByText('Enable')).toBeDisabled()

    await userEvent.type(
      screen.getByLabelText('OAuth client ID'),
      '1234567890-abc.apps.googleusercontent.com',
    )
    expect(screen.getByText('Enable')).toBeDisabled()

    await userEvent.type(screen.getByLabelText('OAuth client secret'), 'my-client-secret')
    expect(await screen.findByText('Enable')).toBeEnabled()

    await userEvent.click(screen.getByText('Enable'))

    expect(
      await screen.findByText('Google Play Games integration successfully enabled'),
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
          <GooglePlayGamesIntegrationDetails
            modalState={[true, vi.fn()]}
            mutate={vi.fn()}
            editingIntegration={{ type: IntegrationType.GOOGLE_PLAY_GAMES }}
          />
        </ToastProvider>
      </KitchenSink>,
    )

    await userEvent.type(
      screen.getByLabelText('OAuth client ID'),
      '1234567890-abc.apps.googleusercontent.com',
    )
    await userEvent.type(screen.getByLabelText('OAuth client secret'), 'my-client-secret')

    expect(await screen.findByText('Enable')).toBeEnabled()
    await userEvent.click(screen.getByText('Enable'))

    expect(await screen.findByText('Network Error')).toBeInTheDocument()
  })

  it('should close the modal', async () => {
    const closeMock = vi.fn()

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: { id: 1 } }]}>
        <ToastProvider>
          <GooglePlayGamesIntegrationDetails
            modalState={[true, closeMock]}
            mutate={vi.fn()}
            editingIntegration={{ type: IntegrationType.GOOGLE_PLAY_GAMES }}
          />
        </ToastProvider>
      </KitchenSink>,
    )

    await userEvent.click(screen.getByText('Cancel'))

    await waitFor(() => {
      expect(closeMock).toHaveBeenCalled()
    })
  })

  it('should require a client ID and client secret', async () => {
    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: { id: 1 } }]}>
        <ToastProvider>
          <GooglePlayGamesIntegrationDetails
            modalState={[true, vi.fn()]}
            mutate={vi.fn()}
            editingIntegration={{ type: IntegrationType.GOOGLE_PLAY_GAMES }}
          />
        </ToastProvider>
      </KitchenSink>,
    )

    await userEvent.type(screen.getByLabelText('OAuth client ID'), 'a')
    await userEvent.clear(screen.getByLabelText('OAuth client ID'))
    expect(await screen.findByText('Client ID is required')).toBeInTheDocument()

    await userEvent.type(screen.getByLabelText('OAuth client secret'), 'a')
    await userEvent.clear(screen.getByLabelText('OAuth client secret'))
    expect(await screen.findByText('Client secret is required')).toBeInTheDocument()
  })

  it('should disable an enabled google play games integration', async () => {
    axiosMock.onDelete('http://talo.api/games/1/integrations/1').replyOnce(204)

    const closeMock = vi.fn()
    const mutateMock = vi.fn()

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: { id: 1 } }]}>
        <ToastProvider>
          <GooglePlayGamesIntegrationDetails
            modalState={[true, closeMock]}
            mutate={mutateMock}
            editingIntegration={{
              id: 1,
              type: IntegrationType.GOOGLE_PLAY_GAMES,
              config: {
                clientId: '1234567890-abc.apps.googleusercontent.com',
                clientSecret: 'my-client-secret',
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
      await screen.findByText('Google Play Games integration successfully disabled'),
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
          <GooglePlayGamesIntegrationDetails
            modalState={[true, vi.fn()]}
            mutate={vi.fn()}
            editingIntegration={{
              id: 1,
              type: IntegrationType.GOOGLE_PLAY_GAMES,
              config: {
                clientId: '1234567890-abc.apps.googleusercontent.com',
                clientSecret: 'my-client-secret',
              },
            }}
          />
        </ToastProvider>
      </KitchenSink>,
    )

    await userEvent.click(screen.getByText('Disable'))
    expect(await screen.findByText('Network Error')).toBeInTheDocument()
  })

  it('should update the google play games integration client ID', async () => {
    axiosMock
      .onPatch('http://talo.api/games/1/integrations/1')
      .replyOnce(200, { integration: { id: 1 } })

    const mutateMock = vi.fn()

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: { id: 1 } }]}>
        <ToastProvider>
          <GooglePlayGamesIntegrationDetails
            modalState={[true, vi.fn()]}
            mutate={mutateMock}
            editingIntegration={{
              id: 1,
              type: IntegrationType.GOOGLE_PLAY_GAMES,
              config: {
                clientId: '1234567890-abc.apps.googleusercontent.com',
                clientSecret: 'my-client-secret',
              },
            }}
          />
        </ToastProvider>
      </KitchenSink>,
    )

    await userEvent.type(screen.getByLabelText('OAuth client ID'), 'new-client-id')
    await userEvent.click(screen.getByText('Update client ID'))

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalled()
    })

    expect(await screen.findByText('Client ID successfully updated')).toBeInTheDocument()

    const mutator = mutateMock.mock.calls[0][0]
    expect(mutator({ integrations: [{ id: 1 }, { id: 2 }] })).toStrictEqual({
      integrations: [{ id: 1 }, { id: 2 }],
    })
  })

  it('should update the google play games integration client secret', async () => {
    axiosMock
      .onPatch('http://talo.api/games/1/integrations/1')
      .replyOnce(200, { integration: { id: 1 } })

    const mutateMock = vi.fn()

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: { id: 1 } }]}>
        <ToastProvider>
          <GooglePlayGamesIntegrationDetails
            modalState={[true, vi.fn()]}
            mutate={mutateMock}
            editingIntegration={{
              id: 1,
              type: IntegrationType.GOOGLE_PLAY_GAMES,
              config: {
                clientId: '1234567890-abc.apps.googleusercontent.com',
                clientSecret: 'my-client-secret',
              },
            }}
          />
        </ToastProvider>
      </KitchenSink>,
    )

    await userEvent.type(screen.getByLabelText('OAuth client secret'), 'new-client-secret')
    await userEvent.click(screen.getByText('Update client secret'))

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalled()
    })

    expect(await screen.findByText('Client secret successfully updated')).toBeInTheDocument()

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
          <GooglePlayGamesIntegrationDetails
            modalState={[true, vi.fn()]}
            mutate={mutateMock}
            editingIntegration={{
              id: 1,
              type: IntegrationType.GOOGLE_PLAY_GAMES,
              config: {
                clientId: '1234567890-abc.apps.googleusercontent.com',
                clientSecret: 'my-client-secret',
              },
            }}
          />
        </ToastProvider>
      </KitchenSink>,
    )

    await userEvent.type(screen.getByLabelText('OAuth client ID'), 'new-client-id')
    await userEvent.click(screen.getByText('Update client ID'))

    expect(await screen.findByText('Network Error')).toBeInTheDocument()

    expect(mutateMock).not.toHaveBeenCalled()
  })
})
