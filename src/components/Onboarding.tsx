import { IconArrowRight, IconDownload, IconKey, IconSettings } from '@tabler/icons-react'
import { clsx } from 'clsx'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { ReactNode, useState } from 'react'
import createGame from '../api/createGame'
import taloIcon from '../assets/talo-icon.svg'
import routes from '../constants/routes'
import { activeGameState } from '../state/activeGameState'
import { userState, AuthedUserState } from '../state/userState'
import { focusStyle, linkStyle } from '../styles/theme'
import buildError from '../utils/buildError'
import { useDocsSelection } from '../utils/useDocsSelection'
import Button from './Button'
import { EmptyStateContainer, EmptyStateIcon, EmptyStateTitle } from './empty-states/EmptyState'
import ErrorMessage, { TaloError } from './ErrorMessage'
import TextInput from './TextInput'

const installationDocs = {
  api: 'https://docs.trytalo.com/docs/http/authentication',
  godot: 'https://docs.trytalo.com/docs/godot/install',
  unity: 'https://docs.trytalo.com/docs/unity/install',
}

function NextStep({
  title,
  content,
  icon,
}: {
  title: string
  content: ReactNode
  icon: ReactNode
}) {
  return (
    <div className='flex items-center gap-4 p-4'>
      <EmptyStateIcon icon={icon} className='size-10! shrink-0 rounded-xl' />
      <div>
        <div className='font-semibold'>{title}</div>
        <div>{content}</div>
      </div>
    </div>
  )
}

function DocsLink({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type='button'
      className={clsx('inline-flex cursor-pointer items-center gap-1', linkStyle, focusStyle)}
      onClick={onClick}
    >
      {children}
      <IconArrowRight size={16} stroke={3} className='mt-0.5' />
    </button>
  )
}

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const activeGame = useAtomValue(activeGameState)

  const [gameName, setGameName] = useState(activeGame?.name ?? '')
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState<TaloError | null>(null)
  const [gameCreated, setGameCreated] = useState(!!activeGame)
  const { openDocs, modalElement } = useDocsSelection(installationDocs)

  const [user, setUser] = useAtom(userState) as AuthedUserState
  const setActiveGame = useSetAtom(activeGameState)

  const handleCreate = async () => {
    setLoading(true)
    setError(null)

    try {
      const { game } = await createGame(gameName.trim())
      const allGames = [...user.organisation.games, game]

      setUser({
        ...user,
        organisation: {
          ...user.organisation,
          games: allGames,
        },
      })
      setActiveGame(game)
      setGameCreated(true)
    } catch (err) {
      setError(buildError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <EmptyStateContainer className='xl:w-1/2!'>
      <EmptyStateIcon
        className='border-[#ff3c7d]!'
        icon={<img src={taloIcon} alt='Talo Icon' className='h-8 w-8' />}
      />
      <EmptyStateTitle>Welcome to Talo. Let's get started!</EmptyStateTitle>

      <div className='w-full space-y-4 rounded-md bg-gray-900 p-4 text-left text-white md:p-8'>
        {!gameCreated && (
          <div className='space-y-4'>
            <p className='text-xl font-bold'>Create a game</p>

            <form
              className='flex flex-col gap-4'
              onSubmit={(e) => {
                e.preventDefault()
                if (gameName.trim()) {
                  void handleCreate()
                }
              }}
            >
              <div className='grow'>
                <TextInput
                  id='game-name'
                  placeholder='Game name'
                  onChange={setGameName}
                  value={gameName}
                />
              </div>

              {error && <ErrorMessage error={error} />}

              <Button disabled={!gameName.trim()} isLoading={isLoading} className='w-40! self-end'>
                Create
              </Button>
            </form>
          </div>
        )}
        {gameCreated && (
          <div className='space-y-4'>
            <p className='text-xl font-bold'>{gameName} created!</p>

            <p>Follow the steps below to finish setting up Talo</p>
          </div>
        )}

        {gameCreated && (
          <div className='divide-y-2 divide-gray-700 rounded-md border-2 border-gray-700'>
            <NextStep
              icon={<IconKey size={20} />}
              title='Get an access key'
              content={
                <>
                  Configure access to your game by creating your first{' '}
                  <a
                    href={routes.apiKeys}
                    target='_blank'
                    rel='noreferrer'
                    className={clsx(
                      'inline-flex cursor-pointer items-center gap-1',
                      linkStyle,
                      focusStyle,
                    )}
                  >
                    access key
                    <IconArrowRight size={16} stroke={3} className='mt-0.5' />
                  </a>
                </>
              }
            />

            <NextStep
              icon={<IconDownload size={20} />}
              title='Install Talo'
              content={
                <>
                  Add Talo to your game using the{' '}
                  <DocsLink onClick={openDocs}>installation docs</DocsLink>
                </>
              }
            />

            <NextStep
              icon={<IconSettings size={20} />}
              title='Customise settings'
              content={
                <>
                  Customise player retention and profanity filtering on the{' '}
                  <a
                    href={routes.gameSettings}
                    target='_blank'
                    rel='noreferrer'
                    className={clsx(
                      'inline-flex cursor-pointer items-center gap-1',
                      linkStyle,
                      focusStyle,
                    )}
                  >
                    settings page
                    <IconArrowRight size={16} stroke={3} className='mt-0.5' />
                  </a>
                </>
              }
            />
          </div>
        )}
      </div>

      {gameCreated && <Button onClick={onComplete}>Continue to dashboard</Button>}
      {modalElement}
    </EmptyStateContainer>
  )
}
