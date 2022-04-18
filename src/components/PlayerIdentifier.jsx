import React from 'react'
import PropTypes from 'prop-types'

function PlayerIdentifier({ player }) {
  return (
    <div>
      <code className='bg-gray-900 rounded p-2 text-xs md:text-sm'>
        {player?.devBuild && <span className='mr-2 bg-orange-600 rounded px-1 py-0.5'>DEV</span>}
        Player = {player?.id}
      </code>
    </div>
  )
}

PlayerIdentifier.propTypes = {
  player: PropTypes.shape({
    id: PropTypes.string.isRequired,
    devBuild: PropTypes.bool.isRequired
  })
}

export default PlayerIdentifier
