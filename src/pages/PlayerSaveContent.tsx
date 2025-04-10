import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import routes from '../constants/routes'
import Page from '../components/Page'
import useNodeGraph from '../utils/useNodeGraph'
import TextInput from '../components/TextInput'
import { Background, BackgroundVariant, Controls, ReactFlow } from '@xyflow/react'
import SaveDataNode from '../components/saves/SaveDataNode'
import SaveContentFitManager from '../components/saves/SaveContentFitManager'
import { GameSave } from '../entities/gameSave'

export default function PlayerSaveContent() {
  const { id: playerId } = useParams()

  const location = useLocation()
  const save: GameSave | undefined = location.state?.save

  const [isLoading, setLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    if (!save) {
      navigate(routes.playerSaves.replace(':id', playerId!))
    } else {
      setLoading(false)
    }
  }, [navigate, playerId, save])

  const [search, setSearch] = useState('')
  const { nodes, edges } = useNodeGraph(save, search)

  return (
    <Page
      showBackButton
      title={save?.name ?? 'Save content'}
      isLoading={isLoading}
    >
      <div className='w-full md:w-[400px]'>
        <TextInput
          id='node-search'
          type='search'
          placeholder='Search...'
          onChange={setSearch}
          value={search}
        />
      </div>

      <div className='w-full h-[68vh] rounded overflow-hidden'>
        <ReactFlow
          fitView
          className='!bg-gray-700'
          nodes={nodes}
          edges={edges}
          nodeTypes={{ default: SaveDataNode }}
          elementsSelectable={false}
        >
          <SaveContentFitManager />
          <Controls showInteractive={false} />
          <Background variant={BackgroundVariant.Dots} gap={32} size={1} />
        </ReactFlow>
      </div>
    </Page>
  )
}
