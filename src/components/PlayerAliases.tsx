import {
  IconBrandGooglePlay,
  IconBrandSteam,
  IconMail,
  IconQuestionMark,
  IconUser,
} from '@tabler/icons-react'
import Tippy from '@tippyjs/react'
import clsx from 'clsx'
import { useCallback, useMemo } from 'react'
import taloIcon from '../assets/talo-service.svg'
import { PlayerAlias } from '../entities/playerAlias'
import useSortedItems from '../utils/useSortedItems'

type PlayerAliasesProps = {
  aliases: PlayerAlias[]
}

function transformService(service: string) {
  return service.replaceAll('-', ' ').replaceAll('_', ' ')
}

export function SingleAlias({ alias }: { alias: PlayerAlias }) {
  const getIcon = useCallback((alias: PlayerAlias) => {
    switch (alias.service) {
      case 'steam':
        return <IconBrandSteam size={16} />
      case 'google_play_games':
        return <IconBrandGooglePlay size={16} className='pl-0.5' />
      case 'username':
        return <IconUser size={16} />
      case 'email':
        return <IconMail size={16} />
      case 'talo':
        return <img src={taloIcon} alt='Talo' className='h-4 w-4' />
      default:
        return <IconQuestionMark size={16} />
    }
  }, [])

  const transformedService = transformService(alias.service)

  return (
    <Tippy
      content={
        <p className='capitalize'>
          {transformedService}
          {alias.player.presence?.online && ' (Online)'}
        </p>
      }
    >
      <span
        className={clsx('rounded-full bg-gray-900 p-1 text-white', {
          'text-green-400!': alias.player.presence?.online,
        })}
      >
        {getIcon(alias)}
      </span>
    </Tippy>
  )
}

export function PlayerAliases({ aliases }: PlayerAliasesProps) {
  const sortedAliases = useSortedItems(aliases, 'lastSeenAt')

  const alias = useMemo(() => {
    return sortedAliases.at(0)
  }, [sortedAliases])

  if (!alias) {
    return 'None'
  }

  return (
    <div className='space-y-2'>
      <div className='flex items-center space-x-2'>
        <SingleAlias alias={alias} />
        <span className='text-sm'>{alias.identifier}</span>
      </div>

      {sortedAliases.length > 1 && <p className='text-sm'>+ {sortedAliases.length - 1} more</p>}
    </div>
  )
}
