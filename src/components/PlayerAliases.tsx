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

export default function PlayerAliases({
  aliases
}: PlayerAliasesProps) {
  const sortedAliases = useSortedItems(aliases, 'lastSeenAt')

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

  const alias = useMemo(() => {
    return sortedAliases.at(0)
  }, [sortedAliases])

  if (!alias) return 'None'

  return (
    <div className='space-y-2'>
      <div className='flex items-center'>
        <Tippy
          content={
            <p className={clsx({ 'capitalize': !alias.service.includes('_') && !alias.service.includes('-') })}>
              {alias.service}
            </p>
          }
        >
          <span className='p-1 rounded-full bg-gray-900'>{getIcon(alias)}</span>
        </Tippy>

        <span className='ml-2 text-sm'>{alias.identifier}</span>
      </div>

      {sortedAliases.length > 1 &&
        <p className='text-sm'>+ {sortedAliases.length - 1} more</p>
      }
    </div>
  )
}
