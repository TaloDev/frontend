import React from 'react'
import PropTypes from 'prop-types'
import { IconBrandSteam, IconQuestionMark, IconUser } from '@tabler/icons'
import Tippy from '@tippyjs/react'

const PlayerAliases = (props) => {
  const getIcon = (alias) => {
    switch (alias.service) {
      case 'steam': return <IconBrandSteam size={16} />
      case 'username': return <IconUser size={16} />
      default: return <IconQuestionMark size={16} />
    }
  }

  if (!props.aliases || props.aliases.length === 0) return 'None'

  return (
    <div className='space-y-2'>
      {props.aliases.map((alias, idx) => (
        <div key={idx} className='flex items-center'>
          <Tippy content={<p className='capitalize'>{alias.service}</p>}>
            <span className='p-1 rounded-full bg-gray-900'>{getIcon(alias)}</span>
          </Tippy>

          <span className='ml-2 text-sm'>{alias.identifier}</span>
        </div>
      ))}
    </div>
  )
}

PlayerAliases.propTypes = {
  aliases: PropTypes.array.isRequired
}

export default PlayerAliases
