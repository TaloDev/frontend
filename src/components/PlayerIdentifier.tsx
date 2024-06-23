import Identifier from './Identifier'

type PlayerIdentifierProps = {
  player?: {
    id: string
    devBuild: boolean
  }
}

function PlayerIdentifier({
  player
}: PlayerIdentifierProps) {
  return (
    <Identifier id={`Player = ${player?.id}`}>
      {player?.devBuild && <span className='mr-2 bg-orange-600 rounded px-1 py-0.5'>DEV</span>}
    </Identifier>
  )
}

export default PlayerIdentifier
