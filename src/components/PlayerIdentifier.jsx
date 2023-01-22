import PropTypes from 'prop-types'
import Identifier from './Identifier'

function PlayerIdentifier({ player }) {
  return (
    <Identifier id={`Player = ${player?.id}`}>
      {player?.devBuild && <span className='mr-2 bg-orange-600 rounded px-1 py-0.5'>DEV</span>}
    </Identifier>
  )
}

PlayerIdentifier.propTypes = {
  player: PropTypes.shape({
    id: PropTypes.string.isRequired,
    devBuild: PropTypes.bool.isRequired
  })
}

export default PlayerIdentifier
