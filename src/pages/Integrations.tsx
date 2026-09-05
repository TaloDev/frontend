import {
  IconBrandApple,
  IconBrandGooglePlay,
  IconBrandSteam,
  IconCheck,
  IconPlus,
} from '@tabler/icons-react'
import { format } from 'date-fns'
import { useAtomValue } from 'jotai'
import { ComponentType, ReactNode, useState } from 'react'
import syncLeaderboards from '../api/syncLeaderboards'
import syncStats from '../api/syncStats'
import useIntegrations from '../api/useIntegrations'
import Button from '../components/Button'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import Link from '../components/Link'
import LinkButton from '../components/LinkButton'
import Loading from '../components/Loading'
import Page from '../components/Page'
import Tile from '../components/Tile'
import { Integration, IntegrationType } from '../entities/integration'
import { GameCenterIntegrationDetails } from '../modals/GameCenterIntegrationDetails'
import { GooglePlayGamesIntegrationDetails } from '../modals/GooglePlayGamesIntegrationDetails'
import { SteamworksIntegrationDetails } from '../modals/SteamworksIntegrationDetails'
import { activeGameState, SelectedActiveGame } from '../state/activeGameState'
import buildError from '../utils/buildError'

const syncingState = {
  INACTIVE: 'inactive',
  ACTIVE: 'active',
  SYNCING: 'syncing',
}

const createdAtFormat = 'dd MMM yyyy'
const updatedAtFormat = 'dd MMM yyyy HH:mm'

function ManualSyncSection({
  loading,
  error,
  onClick,
  title,
  docs,
  cta,
  successTitle,
  successDesc,
}: {
  loading: string
  error: TaloError | null
  onClick: () => void
  title: string
  docs: string
  cta: string
  successTitle: string
  successDesc: string
}) {
  return (
    <div className='flex items-start justify-between border-t border-gray-600 px-4 pt-4'>
      {loading !== syncingState.SYNCING && (
        <>
          <div>
            {title}
            <br />
            <Link to={docs}>Learn more about how it works</Link>

            {error && (
              <div className='mt-4'>
                <ErrorMessage error={error} />
              </div>
            )}
          </div>

          <Button
            type='button'
            className='w-auto!'
            variant='grey'
            onClick={onClick}
            isLoading={loading === syncingState.ACTIVE}
          >
            <span>{cta}</span>
          </Button>
        </>
      )}

      {loading === syncingState.SYNCING && (
        <div className='w-full rounded bg-gray-900 p-4 leading-relaxed'>
          <p className='font-bold'>
            <IconCheck className='mr-2 inline-block align-middle' size={16} />
            {successTitle}
          </p>
          <p>{successDesc}</p>
        </div>
      )}
    </div>
  )
}

function SteamworksSync({
  activeGame,
  integration,
}: {
  activeGame: SelectedActiveGame
  integration: Integration
}) {
  const [leaderboardsLoading, setLeaderboardsLoading] = useState(syncingState.INACTIVE)
  const [leaderboardsError, setLeaderboardsError] = useState<TaloError | null>(null)

  const [statsLoading, setStatsLoading] = useState(syncingState.INACTIVE)
  const [statsError, setStatsError] = useState<TaloError | null>(null)

  const showLeaderboards =
    integration.type === IntegrationType.STEAMWORKS && integration.config.syncLeaderboards
  const showStats = integration.type === IntegrationType.STEAMWORKS && integration.config.syncStats

  if (!showLeaderboards && !showStats) {
    return null
  }

  const onSyncLeaderboardsClick = async () => {
    setLeaderboardsLoading(syncingState.ACTIVE)
    setLeaderboardsError(null)

    try {
      await syncLeaderboards(activeGame.id, integration.id)
      setLeaderboardsLoading(syncingState.SYNCING)
    } catch (err) {
      setLeaderboardsError(buildError(err))
      setLeaderboardsLoading(syncingState.INACTIVE)
    }
  }

  const onSyncStatsClick = async () => {
    setStatsLoading(syncingState.ACTIVE)
    setStatsError(null)

    try {
      await syncStats(activeGame.id, integration.id)
      setStatsLoading(syncingState.SYNCING)
    } catch (err) {
      setStatsError(buildError(err))
      setStatsLoading(syncingState.INACTIVE)
    }
  }

  return (
    <div className='space-y-4'>
      {showLeaderboards && (
        <ManualSyncSection
          loading={leaderboardsLoading}
          error={leaderboardsError}
          onClick={onSyncLeaderboardsClick}
          title='Sync your Talo and Steamworks leaderboards'
          docs='https://docs.trytalo.com/docs/integrations/steamworks#manually-syncing-leaderboards?utm_source=dashboard&utm_medium=integrations'
          cta='Sync leaderboards'
          successTitle='Leaderboards syncing'
          successDesc='This will usually only take a few minutes. Leaderboards will be updated in the background.'
        />
      )}

      {showStats && (
        <ManualSyncSection
          loading={statsLoading}
          error={statsError}
          onClick={onSyncStatsClick}
          title='Sync your Talo and Steamworks global stats'
          docs='https://docs.trytalo.com/docs/integrations/steamworks#manually-syncing-stats?utm_source=dashboard&utm_medium=integrations'
          cta='Sync stats'
          successTitle='Stats syncing'
          successDesc='This will usually only take a few minutes.'
        />
      )}
    </div>
  )
}

const integrationMeta: {
  type: IntegrationType
  icon: ComponentType<{ className?: string; size?: number }>
  iconClass: string
  title: string
  addLabel: string
  emptyContent: ReactNode
}[] = [
  {
    type: IntegrationType.STEAMWORKS,
    icon: IconBrandSteam,
    iconClass: '-mt-1',
    title: 'Steam',
    addLabel: 'Add another Steam app',
    emptyContent: (
      <>
        <p>Authenticate Steam players and sync your leaderboards and stats from Steamworks</p>
        <p>
          Requires a{' '}
          <Link to='https://partner.steamgames.com/doc/webapi_overview/auth'>
            Web API Publisher key
          </Link>
        </p>
      </>
    ),
  },
  {
    type: IntegrationType.GOOGLE_PLAY_GAMES,
    icon: IconBrandGooglePlay,
    iconClass: '-mt-0.5',
    title: 'Google Play Games',
    addLabel: 'Add another Google Play Games client',
    emptyContent: (
      <>
        <p>Authenticate Google Play Games players using OAuth 2.0</p>
        <p>
          Requires an{' '}
          <Link to='https://developer.android.com/games/pgs/console/setup#generate_an_oauth_20_client_id'>
            OAuth 2.0 client ID and secret
          </Link>
        </p>
      </>
    ),
  },
  {
    type: IntegrationType.GAME_CENTER,
    icon: IconBrandApple,
    iconClass: '-mt-1',
    title: 'Game Center',
    addLabel: 'Add another Game Center app',
    emptyContent: (
      <>
        <p>Authenticate iOS players using Apple Game Center</p>
        <p>
          Requires your{' '}
          <Link to='https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleidentifier'>
            app bundle identifier
          </Link>
        </p>
      </>
    ),
  },
]

const getIntegrationLabel = (integration: Integration) => {
  switch (integration.type) {
    case IntegrationType.STEAMWORKS:
      return `App ${integration.config.appId}`
    case IntegrationType.GOOGLE_PLAY_GAMES:
      return `Client ${integration.config.clientId}`
    case IntegrationType.GAME_CENTER:
      return `Bundle ${integration.config.bundleId}`
  }
}

export default function Integrations() {
  const activeGame = useAtomValue(activeGameState) as SelectedActiveGame
  const { integrations, loading, error, mutate } = useIntegrations(activeGame)
  const [editingIntegration, setEditingIntegration] = useState<Partial<Integration> | null>(null)

  return (
    <Page title='Integrations'>
      {error && <ErrorMessage error={error} />}

      <div className='space-y-8 lg:w-1/2'>
        {integrationMeta.map(({ type, icon: Icon, iconClass, title, addLabel, emptyContent }) => {
          const typeIntegrations = integrations.filter((integration) => integration.type === type)

          const renderHeader = (label: string | null, buttonLabel: string, onClick: () => void) => (
            <>
              <div>
                <h2 className='text-xl font-semibold'>
                  <Icon className={`${iconClass} mr-2 inline align-middle`} size={20} />
                  {title}
                </h2>
                {label && <p className='text-sm text-white'>{label}</p>}
              </div>
              {!loading && (
                <Button variant='grey' className='w-auto!' onClick={onClick}>
                  <span>{buttonLabel}</span>
                </Button>
              )}
              {loading && <Loading size={24} thickness={180} />}
            </>
          )

          const onAdd = () => setEditingIntegration({ type })

          return (
            <div key={type} className='space-y-4'>
              {typeIntegrations.map((integration) => (
                <Tile
                  key={integration.id}
                  header={renderHeader(getIntegrationLabel(integration), 'Update integration', () =>
                    setEditingIntegration(integration),
                  )}
                  content={
                    <div className='leading-relaxed'>
                      <p className='font-bold'>
                        Enabled {format(new Date(integration.createdAt), createdAtFormat)}
                      </p>
                      <p>Last updated {format(new Date(integration.updatedAt), updatedAtFormat)}</p>
                    </div>
                  }
                  footer={
                    type === IntegrationType.STEAMWORKS ? (
                      <SteamworksSync activeGame={activeGame} integration={integration} />
                    ) : null
                  }
                />
              ))}

              {typeIntegrations.length > 0 && (
                <LinkButton onClick={onAdd} className='flex items-center space-x-1'>
                  <IconPlus size={16} />
                  <span>{addLabel}</span>
                </LinkButton>
              )}

              {typeIntegrations.length === 0 && (
                <Tile
                  header={renderHeader(null, 'Enable integration', onAdd)}
                  content={<div className='leading-relaxed'>{emptyContent}</div>}
                />
              )}
            </div>
          )
        })}
      </div>

      {editingIntegration?.type === IntegrationType.STEAMWORKS && (
        <SteamworksIntegrationDetails
          modalState={[Boolean(editingIntegration), () => setEditingIntegration(null)]}
          mutate={mutate}
          editingIntegration={editingIntegration}
        />
      )}

      {editingIntegration?.type === IntegrationType.GOOGLE_PLAY_GAMES && (
        <GooglePlayGamesIntegrationDetails
          modalState={[Boolean(editingIntegration), () => setEditingIntegration(null)]}
          mutate={mutate}
          editingIntegration={editingIntegration}
        />
      )}

      {editingIntegration?.type === IntegrationType.GAME_CENTER && (
        <GameCenterIntegrationDetails
          modalState={[Boolean(editingIntegration), () => setEditingIntegration(null)]}
          mutate={mutate}
          editingIntegration={editingIntegration}
        />
      )}
    </Page>
  )
}
