import PropTypes from 'prop-types'
import { IconBrandSteam, IconCheck } from '@tabler/icons-react'
import { useRecoilValue } from 'recoil'
import useIntegrations from '../api/useIntegrations'
import Button from '../components/Button'
import Link from '../components/Link'
import Page from '../components/Page'
import Tile from '../components/Tile'
import activeGameState from '../state/activeGameState'
import { format } from 'date-fns'
import { useState } from 'react'
import IntegrationDetails from '../modals/IntegrationDetails'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import buildError from '../utils/buildError'
import syncLeaderboards from '../api/syncLeaderboards'
import syncStats from '../api/syncStats'

const syncingState = {
  INACTIVE: 'inactive',
  ACTIVE: 'active',
  SYNCING: 'syncing'
}

function ManualSyncSection({ loading, error, onClick, title, docs, cta, successTitle, successDesc }) {
  return (
    <div className='border-t border-gray-600 px-4 pt-4 flex justify-between items-start'>
      {loading !== syncingState.SYNCING &&
        <>
          <div>
            {title}
            <br />
            <Link to={docs}>Learn more about how it works</Link>

            {error &&
              <div className='mt-4'>
                <ErrorMessage error={error} />
              </div>
            }
          </div>

          <Button
            type='button'
            className='w-auto'
            variant='grey'
            onClick={onClick}
            isLoading={loading === syncingState.ACTIVE}
          >
            <span>{cta}</span>
          </Button>
        </>
      }

      {loading === syncingState.SYNCING &&
        <div className='p-4 bg-gray-900 rounded w-full leading-relaxed'>
          <p className='font-bold'>
            <IconCheck className='inline-block align-middle mr-2' size={16} />
            {successTitle}
          </p>
          <p>{successDesc}</p>
        </div>
      }
    </div>
  )
}

ManualSyncSection.propTypes = {
  loading: PropTypes.string.isRequired,
  error: PropTypes.object,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  docs: PropTypes.string.isRequired,
  cta: PropTypes.string.isRequired,
  successTitle: PropTypes.string.isRequired,
  successDesc: PropTypes.string.isRequired
}

export default function Integrations() {
  const activeGame = useRecoilValue(activeGameState)
  const { integrations, loading, error, mutate } = useIntegrations(activeGame)
  const [editingIntegration, setEditingIntegration] = useState(null)

  const steamIntegration = error ? null : integrations.find((integration) => integration.type === 'steamworks')

  const [isSyncingSteamworksLeaderboards, setSyncingSteamworksLeaderboards] = useState(syncingState.INACTIVE)
  const [syncingSteamworksLeaderboardsError, setSyncingSteamworksLeaderboardsError] = useState(null)

  const [isSyncingSteamworksStats, setSyncingSteamworksStats] = useState(syncingState.INACTIVE)
  const [syncingSteamworksStatsError, setSyncingSteamworksStatsError] = useState(null)

  const onSteamIntegrationClick = () => {
    setEditingIntegration(steamIntegration ?? { type: 'steamworks' })
  }

  const onSyncSteamworksLeaderboardsClick = async () => {
    setSyncingSteamworksLeaderboards(syncingState.ACTIVE)
    setSyncingSteamworksLeaderboardsError(null)

    try {
      await syncLeaderboards(activeGame.id, steamIntegration.id)
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
      await syncStats(activeGame.id, steamIntegration.id)
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
          header={(
            <>
              <h2 className='text-xl font-semibold'>
                <IconBrandSteam className='inline align-middle -mt-0.5 mr-2' size={20} />
                Steam
              </h2>
              {!loading &&
                <Button
                  variant='grey'
                  className='!w-auto'
                  onClick={onSteamIntegrationClick}
                >
                  {!steamIntegration && <span>Enable integration</span>}
                  {steamIntegration && <span>Update integration</span>}
                </Button>
              }
              {loading && <Loading size={24} thickness={180} />}
            </>
          )}
          content={(
            <div className='leading-relaxed'>
              {!steamIntegration && <p>Sync your leaderboards and stats in Steamworks</p>}
              {!steamIntegration && <p>Requires a <Link to='https://partner.steamgames.com/doc/webapi_overview/auth'>Web API Publisher key</Link></p>}
              {steamIntegration && <p className='font-bold'>Enabled {format(new Date(steamIntegration.createdAt), 'do MMM yyyy')}</p>}
              {steamIntegration && <p>Last updated {format(new Date(steamIntegration.updatedAt), 'do MMM yyyy HH:mm')}</p>}
            </div>
          )}
          footer={steamIntegration ? (
            <div className='space-y-4'>
              {steamIntegration.config.syncLeaderboards &&
                <ManualSyncSection
                  loading={isSyncingSteamworksLeaderboards}
                  error={syncingSteamworksLeaderboardsError}
                  title='Sync your Talo and Steamworks leaderboards'
                  docs='https://docs.trytalo.com/integrations/steam#manually-syncing-leaderboards'
                  onClick={onSyncSteamworksLeaderboardsClick}
                  cta='Sync leaderboards'
                  successTitle='Leaderboards syncing'
                  successDesc='This will usually only take a few minutes. Leaderboards will be updated in the background.'
                />
              }

              {steamIntegration.config.syncStats &&
                <ManualSyncSection
                  loading={isSyncingSteamworksStats}
                  error={syncingSteamworksStatsError}
                  title='Sync your Talo and Steamworks global stats'
                  docs='https://docs.trytalo.com/integrations/steam#manually-syncing-stats'
                  onClick={onSyncSteamworksStatsClick}
                  cta='Sync stats'
                  successTitle='Stats syncing'
                  successDesc='This will usually only take a few minutes.'
                />
              }
            </div>
          ) : null}
        />
      </div>

      {editingIntegration &&
        <IntegrationDetails
          modalState={[Boolean(editingIntegration), () => setEditingIntegration(null)]}
          mutate={mutate}
          editingIntegration={editingIntegration}
        />
      }
    </Page>
  )
}
