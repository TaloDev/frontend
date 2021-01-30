import React from 'react'
import PropTypes from 'prop-types'
import { IconBrandSteam } from '@tabler/icons'

const PlayerAliases = (props) => {
  const getIcon = (alias) => {
    switch (alias) {
      case 'steam': return <IconBrandSteam size={20} />
    }
  }

  if (!props.aliases || Object.keys(props.aliases).length === 0) return 'None'

  return Object.keys(props.aliases).map((alias) => (
    <div key={alias} className='flex items-center'>
      <span className='p-1 rounded-full bg-gray-900'>{getIcon(alias)}</span>
      <span className='ml-2'>{props.aliases[alias]}</span>
    </div>
  ))
}

PlayerAliases.propTypes = {
  aliases: PropTypes.object.isRequired
}

export default PlayerAliases
