import { IconBrandSteam, IconCheck } from '@tabler/icons-react'
import { format } from 'date-fns'
import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import syncLeaderboards from '../api/syncLeaderboards'
import syncStats from '../api/syncStats'
import useIntegrations from '../api/useIntegrations'
import Button from '../components/Button'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import Link from '../components/Link'
import Loading from '../components/Loading'
import Page from '../components/Page'
import Tile from '../components/Tile'
import { Integration, IntegrationType } from '../entities/integration'
import IntegrationDetails from '../modals/IntegrationDetails'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import buildError from '../utils/buildError'

const syncingState = {
  INACTIVE: 'inactive',
  ACTIVE: 'active',
  SYNCING: 'syncing',
}

type ManualSyncSectionProps = {
  loading: string
  error: TaloError | null
  onClick: () => void
  title: string
  docs: string
  cta: string
  successTitle: string
  successDesc: string
}

function ManualSyncSection({
  loading,
  error,
  onClick,
  title,
  docs,
  cta,
  successTitle,
  successDesc,
}: ManualSyncSectionProps) {
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

export default function Integrations() {
  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame
  const { integrations, loading, error, mutate } = useIntegrations(activeGame)
  const [editingIntegration, setEditingIntegration] = useState<Partial<Integration> | null>(null)

  const steamIntegration = error
    ? null
    : integrations.find((integration) => integration.type === IntegrationType.STEAMWORKS)

  const [isSyncingSteamworksLeaderboards, setSyncingSteamworksLeaderboards] = useState(
    syncingState.INACTIVE,
  )
  const [syncingSteamworksLeaderboardsError, setSyncingSteamworksLeaderboardsError] =
    useState<TaloError | null>(null)

  const [isSyncingSteamworksStats, setSyncingSteamworksStats] = useState(syncingState.INACTIVE)
  const [syncingSteamworksStatsError, setSyncingSteamworksStatsError] = useState<TaloError | null>(
    null,
  )

  const onSteamIntegrationClick = () => {
    setEditingIntegration(steamIntegration ?? { type: IntegrationType.STEAMWORKS })
  }

  const onSyncSteamworksLeaderboardsClick = async () => {
    setSyncingSteamworksLeaderboards(syncingState.ACTIVE)
    setSyncingSteamworksLeaderboardsError(null)

    try {
      await syncLeaderboards(activeGame.id, steamIntegration!.id)
      setSyncingSteamworksLeaderboards(syncingState.SYNCING)
    } catch (err) {
      setSyncingSteamworksLeaderboardsError(buildError(err))
      setSyncingSteamworksLeaderboards(syncingState.INACTIVE)
    }
  }

  const onSyncSteamworksStatsClick = async () => {
    setSyncingSteamworksStats(syncingState.ACTIVE)
    setSyncingSteamworksStatsError(null)

    try {
      await syncStats(activeGame.id, steamIntegration!.id)
      setSyncingSteamworksStats(syncingState.SYNCING)
    } catch (err) {
      setSyncingSteamworksStatsError(buildError(err))
      setSyncingSteamworksStats(syncingState.INACTIVE)
    }
  }

  return (
    <Page title='Integrations'>
      {error && <ErrorMessage error={error} />}

      <div className='lg:w-1/2'>
        <Tile
          header={
            <>
              <h2 className='text-xl font-semibold'>
                <IconBrandSteam className='-mt-0.5 mr-2 inline align-middle' size={20} />
                Steam
              </h2>
              {!loading && (
                <Button variant='grey' className='w-auto!' onClick={onSteamIntegrationClick}>
                  {!steamIntegration && <span>Enable integration</span>}
                  {steamIntegration && <span>Update integration</span>}
                </Button>
              )}
              {loading && <Loading size={24} thickness={180} />}
            </>
          }
          content={
            <div className='leading-relaxed'>
              {!steamIntegration && (
                <p>
                  Authenticate Steam players and sync your leaderboards and stats from Steamworks
                </p>
              )}
              {!steamIntegration && (
                <p>
                  Requires a{' '}
                  <Link to='https://partner.steamgames.com/doc/webapi_overview/auth'>
                    Web API Publisher key
                  </Link>
                </p>
              )}
              {steamIntegration && (
                <p className='font-bold'>
                  Enabled {format(new Date(steamIntegration.createdAt), 'dd MMM yyyy')}
                </p>
              )}
              {steamIntegration && (
                <p>
                  Last updated {format(new Date(steamIntegration.updatedAt), 'dd MMM yyyy HH:mm')}
                </p>
              )}
            </div>
          }
          footer={
            steamIntegration ? (
              <div className='space-y-4'>
                {steamIntegration.config.syncLeaderboards && (
                  <ManualSyncSection
                    loading={isSyncingSteamworksLeaderboards}
                    error={syncingSteamworksLeaderboardsError}
                    title='Sync your Talo and Steamworks leaderboards'
                    docs='https://docs.trytalo.com/docs/integrations/steamworks#manually-syncing-leaderboards?utm_source=dashboard&utm_medium=integrations'
                    onClick={onSyncSteamworksLeaderboardsClick}
                    cta='Sync leaderboards'
                    successTitle='Leaderboards syncing'
                    successDesc='This will usually only take a few minutes. Leaderboards will be updated in the background.'
                  />
                )}

                {steamIntegration.config.syncStats && (
                  <ManualSyncSection
                    loading={isSyncingSteamworksStats}
                    error={syncingSteamworksStatsError}
                    title='Sync your Talo and Steamworks global stats'
                    docs='https://docs.trytalo.com/docs/integrations/steamworks#manually-syncing-stats?utm_source=dashboard&utm_medium=integrations'
                    onClick={onSyncSteamworksStatsClick}
                    cta='Sync stats'
                    successTitle='Stats syncing'
                    successDesc='This will usually only take a few minutes.'
                  />
                )}
              </div>
            ) : null
          }
        />
      </div>

      {editingIntegration && (
        <IntegrationDetails
          modalState={[Boolean(editingIntegration), () => setEditingIntegration(null)]}
          mutate={mutate}
          editingIntegration={editingIntegration}
        />
      )}
    </Page>
  )
}
