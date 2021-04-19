import React from 'react'
import PropTypes from 'prop-types'
import { IconBrandSteam, IconQuestionMark } from '@tabler/icons'

const PlayerAliases = (props) => {
  const getIcon = (alias) => {
    switch (alias.service) {
      case 'steam': return <IconBrandSteam size={16} />
      default: return <IconQuestionMark size={16} />
    }
  }

  if (!props.aliases || props.aliases.length === 0) return 'None'

  return (
    <div className='space-y-2'>
      {props.aliases.map((alias) => (
        <div key={alias} className='flex items-center'>
          <span className='p-1 rounded-full bg-gray-900'>{getIcon(alias)}</span>
          <span className='ml-2 text-sm'>{alias.identifier}</span>
        </div>
      ))}
    </div>
  )
}

PlayerAliases.propTypes = {
  aliases: PropTypes.object.isRequired
}

export default PlayerAliases
