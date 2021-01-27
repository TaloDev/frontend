import React from 'react'
import PropTypes from 'prop-types'
import { IconBrandSteam } from '@tabler/icons'

const PlayerAliases = (props) => {
  const getIcon = (alias) => {
    switch (alias) {
      case 'steam': return <IconBrandSteam size={20} />
    }
  }

  return Object.keys(props.aliases).map((alias) => (
    <div key={alias} className='flex items-center'>
      <span className='hidden md:block md:mr-2 p-1 rounded-full bg-gray-900'>{getIcon(alias)}</span>
      <span>{props.aliases[alias]}</span>
    </div>
  ))
}

PlayerAliases.propTypes = {
  alias: PropTypes.object.isRequired
}

export default PlayerAliases
