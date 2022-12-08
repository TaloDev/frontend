import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import api from '../../api/api'
import MockAdapter from 'axios-mock-adapter'
import KitchenSink from '../../utils/KitchenSink'
import activeGameState from '../../state/activeGameState'
import IntegrationDetails from '../IntegrationDetails'
import ToastProvider from '../../components/toast/ToastProvider'

describe('<IntegrationDetails />', () => {
  const axiosMock = new MockAdapter(api)

  beforeAll(() => {
    jest.useFakeTimers('modern')
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('should enable a steamworks integration', async () => {
    axiosMock.onPost('http://talo.test/games/1/integrations').replyOnce(200, { integration: { id: 1 } })

    const closeMock = jest.fn()
    const mutateMock = jest.fn()

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: { id: 1 } }]}>
        <ToastProvider>
          <IntegrationDetails
            modalState={[true, closeMock]}
            mutate={mutateMock}
            editingIntegration={{ type: 'steamworks' }}
          />
        </ToastProvider>
      </KitchenSink>
    )

    expect(screen.getByText('Enable')).toBeDisabled()

    userEvent.type(screen.getByLabelText('Publisher API key'), '337e67be02be453695f8a5b8038496c2')
    expect(screen.getByText('Enable')).toBeDisabled()

    userEvent.type(screen.getByLabelText('Game app ID'), '375290')
    expect(await screen.findByText('Enable')).toBeEnabled()

    userEvent.click(screen.getByText('Enable'))

    expect(await screen.findByText('Steamworks integration successfully enabled')).toBeInTheDocument()

    await waitFor(() => {
      expect(closeMock).toHaveBeenCalled()
    })

    expect(mutateMock).toHaveBeenCalled()

    const mutator = mutateMock.mock.calls[0][0]
    expect(mutator({ integrations: [] })).toStrictEqual({
      integrations: [{ id: 1 }]
    })
  })

  it('should handle enabling errors', async () => {
    axiosMock.onPost('http://talo.test/games/1/integrations').networkErrorOnce()

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: { id: 1 } }]}>
        <ToastProvider>
          <IntegrationDetails
            modalState={[true, jest.fn()]}
            mutate={jest.fn()}
            editingIntegration={{ type: 'steamworks' }}
          />
        </ToastProvider>
      </KitchenSink>
    )

    userEvent.type(screen.getByLabelText('Publisher API key'), '337e67be02be453695f8a5b8038496c2')
    userEvent.type(screen.getByLabelText('Game app ID'), '375290')

    expect(await screen.findByText('Enable')).toBeEnabled()
    userEvent.click(screen.getByText('Enable'))

    expect(await screen.findByText('Network Error')).toBeInTheDocument()
  })

  it('should close the modal', async () => {
    const closeMock = jest.fn()
    const mutateMock = jest.fn()

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: { id: 1 } }]}>
        <ToastProvider>
          <IntegrationDetails
            modalState={[true, closeMock]}
            mutate={mutateMock}
            editingIntegration={{ type: 'steamworks' }}
          />
        </ToastProvider>
      </KitchenSink>
    )

    userEvent.click(screen.getByText('Cancel'))

    await waitFor(() => {
      expect(closeMock).toHaveBeenCalled()
    })
  })

  it('should check the publisher api key is only 32 characters', async () => {
    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: { id: 1 } }]}>
        <ToastProvider>
          <IntegrationDetails
            modalState={[true, jest.fn()]}
            mutate={jest.fn()}
            editingIntegration={{ type: 'steamworks' }}
          />
        </ToastProvider>
      </KitchenSink>
    )

    userEvent.type(screen.getByLabelText('Publisher API key'), '337e67be02be453695f8a5b8038496c')
    expect(await screen.findByText('Key must be exactly 32 characters')).toBeInTheDocument()

    userEvent.type(screen.getByLabelText('Publisher API key'), '2')
    await waitFor(() => {
      expect(screen.queryByText('Key must be exactly 32 characters')).not.toBeInTheDocument()
    })

    userEvent.type(screen.getByLabelText('Publisher API key'), 'a')
    expect(await screen.findByText('Key must be exactly 32 characters')).toBeInTheDocument()
  })

  it('should prefill the config when editing a steamworks integration', async () => {
    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: { id: 1 } }]}>
        <ToastProvider>
          <IntegrationDetails
            modalState={[true, jest.fn()]}
            mutate={jest.fn()}
            editingIntegration={{
              id: 1,
              type: 'steamworks',
              config: {
                appId: '375290',
                syncLeaderboards: true,
                syncStats: false
              }
            }}
          />
        </ToastProvider>
      </KitchenSink>
    )

    expect(await screen.findByDisplayValue('375290')).toBeInTheDocument()
    expect(await screen.findByTestId('sync-leaderboards')).toBeChecked()
    expect(await screen.findByTestId('sync-stats')).not.toBeChecked()
  })

  it('should disable an enabled steamworks integration', async () => {
    axiosMock.onDelete('http://talo.test/games/1/integrations/1').replyOnce(204)

    const closeMock = jest.fn()
    const mutateMock = jest.fn()

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: { id: 1 } }]}>
        <ToastProvider>
          <IntegrationDetails
            modalState={[true, closeMock]}
            mutate={mutateMock}
            editingIntegration={{
              id: 1,
              type: 'steamworks',
              config: {
                appId: '375290',
                syncLeaderboards: true,
                syncStats: false
              }
            }}
          />
        </ToastProvider>
      </KitchenSink>
    )

    userEvent.click(screen.getByText('Disable'))

    await waitFor(() => {
      expect(closeMock).toHaveBeenCalled()
    })

    expect(mutateMock).toHaveBeenCalled()

    expect(await screen.findByText('Steamworks integration successfully disabled')).toBeInTheDocument()

    const mutator = mutateMock.mock.calls[0][0]
    expect(mutator({ integrations: [{ id: 1 }, { id: 2 }] })).toStrictEqual({
      integrations: [{ id: 2 }]
    })
  })

  it('should handle disabling errors', async () => {
    axiosMock.onDelete('http://talo.test/games/1/integrations/1').networkErrorOnce()

    const closeMock = jest.fn()
    const mutateMock = jest.fn()

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: { id: 1 } }]}>
        <ToastProvider>
          <IntegrationDetails
            modalState={[true, closeMock]}
            mutate={mutateMock}
            editingIntegration={{
              id: 1,
              type: 'steamworks',
              config: {
                appId: '375290',
                syncLeaderboards: true,
                syncStats: false
              }
            }}
          />
        </ToastProvider>
      </KitchenSink>
    )

    userEvent.click(screen.getByText('Disable'))
    expect(await screen.findByText('Network Error')).toBeInTheDocument()
  })

  it('should update the steamworks integration api key', async () => {
    axiosMock.onPatch('http://talo.test/games/1/integrations/1').replyOnce(200, { integration: { id: 1 } })

    const mutateMock = jest.fn()

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: { id: 1 } }]}>
        <ToastProvider>
          <IntegrationDetails
            modalState={[true, jest.fn()]}
            mutate={mutateMock}
            editingIntegration={{
              id: 1,
              type: 'steamworks',
              config: {
                appId: '375290',
                syncLeaderboards: true,
                syncStats: false
              }
            }}
          />
        </ToastProvider>
      </KitchenSink>
    )

    userEvent.click(screen.getByText('Update key'))

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalled()
    })

    expect(await screen.findByText('Key successfully updated')).toBeInTheDocument()

    const mutator = mutateMock.mock.calls[0][0]
    expect(mutator({ integrations: [{ id: 1 }, { id: 2 }] })).toStrictEqual({
      integrations: [{ id: 1 }, { id: 2 }]
    })
  })

  it('should update the steamworks integration app id', async () => {
    axiosMock.onPatch('http://talo.test/games/1/integrations/1').replyOnce(200, { integration: { id: 1, config: { appId: '375299' } } })

    const mutateMock = jest.fn()

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: { id: 1 } }]}>
        <ToastProvider>
          <IntegrationDetails
            modalState={[true, jest.fn()]}
            mutate={mutateMock}
            editingIntegration={{
              id: 1,
              type: 'steamworks',
              config: {
                appId: '375290',
                syncLeaderboards: true,
                syncStats: false
              }
            }}
          />
        </ToastProvider>
      </KitchenSink>
    )

    userEvent.type(screen.getByLabelText('Game app ID'), '375299')
    userEvent.click(screen.getByText('Update app ID'))

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalled()
    })

    expect(await screen.findByText('App ID successfully updated')).toBeInTheDocument()

    const mutator = mutateMock.mock.calls[0][0]
    expect(mutator({ integrations: [{ id: 1, config: { appId: '325290' } }] })).toStrictEqual({
      integrations: [{ id: 1, config: { appId: '375299' } }]
    })
  })

  it('should update the steamworks integration leaderboard syncing', async () => {
    axiosMock.onPatch('http://talo.test/games/1/integrations/1').replyOnce(200, { integration: { id: 1, config: { syncLeaderboards: false } } })

    const mutateMock = jest.fn()

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: { id: 1 } }]}>
        <ToastProvider>
          <IntegrationDetails
            modalState={[true, jest.fn()]}
            mutate={mutateMock}
            editingIntegration={{
              id: 1,
              type: 'steamworks',
              config: {
                appId: '375290',
                syncLeaderboards: true,
                syncStats: false
              }
            }}
          />
        </ToastProvider>
      </KitchenSink>
    )

    userEvent.click(screen.getByTestId('sync-leaderboards'))

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalled()
    })

    expect(await screen.findByText('Leaderboard syncing successfully turned off')).toBeInTheDocument()

    const mutator = mutateMock.mock.calls[0][0]
    expect(mutator({ integrations: [{ id: 1, config: { syncLeaderboards: true } }] })).toStrictEqual({
      integrations: [{ id: 1, config: { syncLeaderboards: false } }]
    })
  })

  it('should update the steamworks integration stat syncing', async () => {
    axiosMock.onPatch('http://talo.test/games/1/integrations/1').replyOnce(200, { integration: { id: 1, config: { syncStats: true } } })

    const mutateMock = jest.fn()

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: { id: 1 } }]}>
        <ToastProvider>
          <IntegrationDetails
            modalState={[true, jest.fn()]}
            mutate={mutateMock}
            editingIntegration={{
              id: 1,
              type: 'steamworks',
              config: {
                appId: '375290',
                syncLeaderboards: true,
                syncStats: false
              }
            }}
          />
        </ToastProvider>
      </KitchenSink>
    )

    userEvent.click(screen.getByTestId('sync-stats'))

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalled()
    })

    expect(await screen.findByText('Stat syncing successfully turned on')).toBeInTheDocument()

    const mutator = mutateMock.mock.calls[0][0]
    expect(mutator({ integrations: [{ id: 1, config: { syncStats: false } }] })).toStrictEqual({
      integrations: [{ id: 1, config: { syncStats: true } }]
    })
  })

  it('should handle updating errors', async () => {
    axiosMock.onPatch('http://talo.test/games/1/integrations/1').networkErrorOnce()

    const mutateMock = jest.fn()

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: { id: 1 } }]}>
        <ToastProvider>
          <IntegrationDetails
            modalState={[true, jest.fn()]}
            mutate={mutateMock}
            editingIntegration={{
              id: 1,
              type: 'steamworks',
              config: {
                appId: '375290',
                syncLeaderboards: true,
                syncStats: false
              }
            }}
          />
        </ToastProvider>
      </KitchenSink>
    )

    userEvent.click(screen.getByText('Update key'))

    expect(await screen.findByText('Network Error')).toBeInTheDocument()

    expect(mutateMock).not.toHaveBeenCalled()
  })
})
