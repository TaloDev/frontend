import { IconBrandSteam, IconMail, IconQuestionMark, IconUser } from '@tabler/icons-react'
import Tippy from '@tippyjs/react'
import useSortedItems from '../utils/useSortedItems'
import { PlayerAlias } from '../entities/playerAlias'
import taloIcon from '../assets/talo-service.svg'
import clsx from 'clsx'
import { useCallback, useMemo } from 'react'

type PlayerAliasesProps = {
  aliases: PlayerAlias[]
}

export function SingleAlias({ alias }: { alias: PlayerAlias }) {
  const getIcon = useCallback((alias: PlayerAlias) => {
    /* v8ignore next */
    switch (alias.service) {
      case 'steam': return <IconBrandSteam size={16} />
      case 'username': return <IconUser size={16} />
      case 'email': return <IconMail size={16} />
      case 'talo': return <img src={taloIcon} alt='Talo' className='w-[16px] h-[16px]' />
      default: return <IconQuestionMark size={16} />
    }
  }, [])

  return (
    <Tippy
      content={
        <p className={clsx({ 'capitalize': !alias.service.includes('_') && !alias.service.includes('-') })}>
          {alias.service}{alias.player.presence?.online && ' (Online)'}
        </p>
      }
    >
      <span
        className={clsx('p-1 rounded-full bg-gray-900 text-white', {
          '!text-green-400': alias.player.presence?.online
        })}
      >
        {getIcon(alias)}
      </span>
    </Tippy>
  )
}

export default function PlayerAliases({
  aliases
}: PlayerAliasesProps) {
  const sortedAliases = useSortedItems(aliases, 'lastSeenAt')

  const alias = useMemo(() => {
    return sortedAliases.at(0)
  }, [sortedAliases])

  if (!alias) return 'None'

  return (
    <div className='space-y-2'>
      <div className='flex items-center space-x-2'>
        <SingleAlias alias={alias} />
        <span className='text-sm'>{alias.identifier}</span>
      </div>

      {sortedAliases.length > 1 &&
        <p className='text-sm'>+ {sortedAliases.length - 1} more</p>
      }
    </div>
  )
}
