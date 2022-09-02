import React from 'react'
import { render, screen } from '@testing-library/react'
import api from '../../api/api'
import MockAdapter from 'axios-mock-adapter'
import KitchenSink from '../../utils/KitchenSink'
import activeGameState from '../../state/activeGameState'
import userEvent from '@testing-library/user-event'
import Integrations from '../Integrations'
import userState from '../../state/userState'

describe('<Integrations />', () => {
  const axiosMock = new MockAdapter(api)

  it('should render the not-enabled state for the steamworks integration', async () => {
    axiosMock.onGet('http://talo.test/games/1/integrations').replyOnce(200, { integrations: [] })

    render(
      <KitchenSink states={[
        { node: userState, initialValue: {} },
        { node: activeGameState, initialValue: { id: 1 } }
      ]}>
        <Integrations />
      </KitchenSink>
    )

    expect(await screen.findByText('Enable integration')).toBeInTheDocument()
    userEvent.click(screen.getByText('Enable integration'))

    expect(screen.getByText('Steamworks integration')).toBeInTheDocument()
    userEvent.click(screen.getByText('Cancel'))
  })

  it('should render the enabled state for the steamworks integration', async () => {
    axiosMock.onGet('http://talo.test/games/1/integrations').replyOnce(200, {
      integrations: [{
        id: 1,
        type: 'steamworks',
        createdAt: '2022-08-01 20:08:13',
        updatedAt: '2022-08-01 20:32:43',
        config: {
          appId: '375290',
          syncLeaderboards: true,
          syncStats: true
        }
      }]
    })

    render(
      <KitchenSink states={[
        { node: userState, initialValue: {} },
        { node: activeGameState, initialValue: { id: 1 } }
      ]}>
        <Integrations />
      </KitchenSink>
    )

    expect(await screen.findByText('Update integration')).toBeInTheDocument()
    userEvent.click(screen.getByText('Update integration'))

    expect(screen.getByText('Steamworks integration')).toBeInTheDocument()
    userEvent.click(screen.getByText('Done'))

    expect(screen.getByText('Enabled 1st Aug 2022'))
    expect(screen.getByText('Last updated 1st Aug 2022 20:32'))
  })

  it('should render the error state', async () => {
    axiosMock.onGet('http://talo.test/games/1/integrations').networkErrorOnce()

    render(
      <KitchenSink states={[
        { node: userState, initialValue: {} },
        { node: activeGameState, initialValue: { id: 1 } }
      ]}>
        <Integrations />
      </KitchenSink>
    )

    expect(await screen.findByText('Network Error')).toBeInTheDocument()
  })

  it.each([
    [false, false],
    [false, true],
    [true, false],
    [true, true]
  ])('should handle steamworks syncing when leaderboard syncing is %p and stat syncing is %p', async (syncLeaderboards, syncStats) => {
    axiosMock.onGet('http://talo.test/games/1/integrations').replyOnce(200, {
      integrations: [{
        id: 1,
        type: 'steamworks',
        createdAt: '2022-08-01 20:08:13',
        updatedAt: '2022-08-01 20:32:43',
        config: {
          appId: '375290',
          syncLeaderboards,
          syncStats
        }
      }]
    })

    if (syncLeaderboards) axiosMock.onPost('http://talo.test/games/1/integrations/1/sync-leaderboards').replyOnce(204)
    if (syncStats) axiosMock.onPost('http://talo.test/games/1/integrations/1/sync-stats').replyOnce(204)

    render(
      <KitchenSink states={[
        { node: userState, initialValue: {} },
        { node: activeGameState, initialValue: { id: 1 } }
      ]}>
        <Integrations />
      </KitchenSink>
    )

    if (syncLeaderboards) {
      expect(await screen.findByText('Sync leaderboards')).toBeInTheDocument()
      userEvent.click(screen.getByText('Sync leaderboards'))
      expect(await screen.findByText('This will usually only take a few minutes. Leaderboards will be updated in the background.')).toBeInTheDocument()
    }

    if (syncStats) {
      expect(await screen.findByText('Sync stats')).toBeInTheDocument()
      userEvent.click(screen.getByText('Sync stats'))
      expect(await screen.findByText('This will usually only take a few minutes.')).toBeInTheDocument()
    }
  })

  it('should handle steamworks leaderboards syncing errors', async () => {
    axiosMock.onGet('http://talo.test/games/1/integrations').replyOnce(200, {
      integrations: [{
        id: 1,
        type: 'steamworks',
        createdAt: '2022-08-01 20:08:13',
        updatedAt: '2022-08-01 20:32:43',
        config: {
          appId: '375290',
          syncLeaderboards: true,
          syncStats: true
        }
      }]
    })

    axiosMock.onPost('http://talo.test/games/1/integrations/1/sync-leaderboards').networkErrorOnce()

    render(
      <KitchenSink states={[
        { node: userState, initialValue: {} },
        { node: activeGameState, initialValue: { id: 1 } }
      ]}>
        <Integrations />
      </KitchenSink>
    )
    expect(await screen.findByText('Sync leaderboards')).toBeInTheDocument()
    userEvent.click(screen.getByText('Sync leaderboards'))
    expect(await screen.findByText('Network Error')).toBeInTheDocument()
  })

  it('should handle steamworks stats syncing errors', async () => {
    axiosMock.onGet('http://talo.test/games/1/integrations').replyOnce(200, {
      integrations: [{
        id: 1,
        type: 'steamworks',
        createdAt: '2022-08-01 20:08:13',
        updatedAt: '2022-08-01 20:32:43',
        config: {
          appId: '375290',
          syncLeaderboards: true,
          syncStats: true
        }
      }]
    })

    axiosMock.onPost('http://talo.test/games/1/integrations/1/sync-stats').networkErrorOnce()

    render(
      <KitchenSink states={[
        { node: userState, initialValue: {} },
        { node: activeGameState, initialValue: { id: 1 } }
      ]}>
        <Integrations />
      </KitchenSink>
    )
    expect(await screen.findByText('Sync stats')).toBeInTheDocument()
    userEvent.click(screen.getByText('Sync stats'))
    expect(await screen.findByText('Network Error')).toBeInTheDocument()
  })
})
