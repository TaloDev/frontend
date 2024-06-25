import { IconBrandSteam, IconMail, IconQuestionMark, IconUser } from '@tabler/icons-react'
import Tippy from '@tippyjs/react'
import useSortedItems from '../utils/useSortedItems'
import { PlayerAlias } from '../entities/playerAlias'

type PlayerAliasesProps = {
  aliases: PlayerAlias[]
}

export default function PlayerAliases({
  aliases
}: PlayerAliasesProps) {
  const sortedAliases = useSortedItems(aliases, 'updatedAt')

  const getIcon = (alias: PlayerAlias) => {
    /* v8ignore next */
    switch (alias.service) {
      case 'steam': return <IconBrandSteam size={16} />
      case 'username': return <IconUser size={16} />
      case 'email': return <IconMail size={16} />
      default: return <IconQuestionMark size={16} />
    }
  }

  if (aliases.length === 0) return 'None'

  return (
    <div className='space-y-2'>
      <div className='flex items-center'>
        <Tippy content={<p className='capitalize'>{sortedAliases[0].service}</p>}>
          <span className='p-1 rounded-full bg-gray-900'>{getIcon(sortedAliases[0])}</span>
        </Tippy>

        <span className='ml-2 text-sm'>{sortedAliases[0].identifier}</span>
      </div>

      {sortedAliases.length > 1 &&
        <p className='text-sm'>+ {sortedAliases.length - 1} more</p>
      }
    </div>
  )
}
