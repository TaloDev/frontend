import { useCallback, useContext, useEffect, useState } from 'react'
import useGameSettings from '../api/useGameSettings'
import Button from '../components/Button'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import Page from '../components/Page'
import SecondaryNav from '../components/SecondaryNav'
import TextInput from '../components/TextInput'
import Toggle from '../components/toggles/Toggle'
import { secondaryNavRoutes } from '../constants/secondaryNavRoutes'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import { useRecoilValue } from 'recoil'
import updateGame from '../api/updateGame'
import buildError from '../utils/buildError'
import ToastContext, { ToastType } from '../components/toast/ToastContext'
import Loading from '../components/Loading'
import { z, ZodError } from 'zod'

type Settings = NonNullable<ReturnType<typeof useGameSettings>['settings']>
const defaultSettings: Settings = {
  purgeDevPlayers: false,
  purgeLivePlayers: false,
  website: null
}

export default function GameSettings() {
  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame
  const toast = useContext(ToastContext)

  const { settings: fetchedSettings, error: fetchError, loading } = useGameSettings(activeGame)
  const [settings, setSettings] = useState<Settings>(fetchedSettings ?? defaultSettings)
  const [settingsLoaded, setSettingsLoaded] = useState(false)

  const [submitError, setSubmitError] = useState<TaloError | null>(null)

  useEffect(() => {
    if (fetchedSettings && !fetchError && !loading) {
      setSettings(fetchedSettings)
      setSettingsLoaded(true)
    }
  }, [fetchError, fetchedSettings, loading])

  const updateSetting = useCallback((key: keyof Settings, value: boolean | string) => {
    setSettings((curr) => {
      return {
        ...curr,
        [key]: value
      }
    })
  }, [])

  const onSaveClick = useCallback(async () => {
    try {
      setSubmitError(null)

      if (settings.website) {
        const websiteSchema = z.string().url('Website must be a valid URL').nullable()
        await websiteSchema.parseAsync(settings.website)
      }

      await updateGame(activeGame.id, settings)
      toast.trigger('Settings updated', ToastType.SUCCESS)
    } catch (err) {
      if (err instanceof ZodError) {
        setSubmitError(buildError({ message: err.issues[0].message }))
      } else {
        setSubmitError(buildError(err))
      }
    }
  }, [activeGame.id, settings, toast])

  return (
    <Page
      containerClassName='w-full md:w-2/3 lg:w-1/2'
      title={`${activeGame.name} settings`}
      isLoading={loading}
      secondaryNav={<SecondaryNav routes={secondaryNavRoutes} />}
    >
      {fetchError && <ErrorMessage error={fetchError} />}

      <div className='flex items-center space-x-4'>
        <div>
          {!settingsLoaded &&
            <div className='mx-4'><Loading size={32} thickness={180} /></div>
          }
          {settingsLoaded &&
            <Toggle
              id='purge-dev-players'
              enabled={settings.purgeDevPlayers}
              onToggle={(val) => updateSetting('purgeDevPlayers', val)}
            />
          }
        </div>
        <div>
          <p className='font-medium'>Purge dev players</p>
          <p className='text-sm'>Automatically delete players created in dev builds with no activity in the last 60 days</p>
        </div>
      </div>

      <div className='flex items-center space-x-4'>
        <div>
          {!settingsLoaded &&
            <div className='mx-4'><Loading size={32} thickness={180} /></div>
          }
          {settingsLoaded &&
            <Toggle
              id='purge-live-players'
              enabled={settings.purgeLivePlayers}
              onToggle={(val) => updateSetting('purgeLivePlayers', val)}
            />
          }
        </div>
        <div>
          <p className='font-medium'>Purge live players</p>
          <p className='text-sm'>Automatically delete players with no activity in the last 90 days</p>
        </div>
      </div>

      <div>
        <TextInput
          id='website'
          label='Website'
          placeholder="Your game's dedicated site, Steam page or itch.io page"
          onChange={(val) => updateSetting('website', val)}
          value={settings.website ?? ''}
        />
      </div>

      {submitError && <ErrorMessage error={submitError} />}

      <Button onClick={onSaveClick}>Save</Button>
    </Page>
  )
}
