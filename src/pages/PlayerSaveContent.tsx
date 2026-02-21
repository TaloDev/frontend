import { Background, BackgroundVariant, Controls, Node, ReactFlow } from '@xyflow/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import usePlayerSaves from '../api/usePlayerSaves'
import Page from '../components/Page'
import SaveContentFitManager, { minZoom } from '../components/saves/SaveContentFitManager'
import SaveDataNode from '../components/saves/SaveDataNode'
import SaveModePicker, { SaveMode } from '../components/saves/SaveModePicker'
import TextInput from '../components/TextInput'
import routes from '../constants/routes'
import { GameSave } from '../entities/gameSave'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import useLinearNodeGraph from '../utils/useLinearNodeGraph'
import useLocalStorage from '../utils/useLocalStorage'
import useNodeGraph from '../utils/useNodeGraph'

const nodeTypes = { default: SaveDataNode }

export default function PlayerSaveContent() {
  const { id: playerId, saveId } = useParams()

  const location = useLocation()
  const [save, setSave] = useState<GameSave | undefined>(location.state?.save)

  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame
  const { saves } = usePlayerSaves(activeGame, playerId!)

  useEffect(() => {
    if (saves.length > 0) {
      const matchingSave = saves.find((s) => s.id === Number(saveId))
      if (matchingSave) {
        setSave(matchingSave)
      }
    }
  }, [saves, saveId])

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
  const [mode, setMode] = useLocalStorage<SaveMode>('saveContentViewMode', 'linear')
  const treeGraph = useNodeGraph(save, search, mode === 'tree')
  const linearGraph = useLinearNodeGraph(save, search, mode === 'linear')
  const { nodes, edges } = mode === 'tree' ? treeGraph : linearGraph

  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)

  const onNodeMouseEnter = useCallback((_: React.MouseEvent, node: Node) => {
    setHoveredNodeId(node.id)
  }, [])

  const onNodeMouseLeave = useCallback(() => {
    setHoveredNodeId(null)
  }, [])

  const nodesWithHoverState = useMemo(() => {
    return nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        isHovered: node.id === hoveredNodeId,
      },
    }))
  }, [hoveredNodeId, nodes])

  return (
    <Page showBackButton title={save?.name ?? 'Save content'} isLoading={isLoading}>
      <div className='items-start justify-between md:flex'>
        <div className='w-full md:w-100'>
          <TextInput
            id='node-search'
            type='search'
            placeholder='Search...'
            onChange={setSearch}
            value={search}
          />
        </div>

        <div className='mt-4 md:mt-0'>
          <SaveModePicker selectedMode={mode} onModeChange={setMode} />
        </div>
      </div>

      <div className='h-[68vh] w-full overflow-hidden rounded'>
        <ReactFlow
          key={mode}
          fitView
          className='bg-gray-700!'
          nodes={nodesWithHoverState}
          edges={edges}
          nodeTypes={nodeTypes}
          elementsSelectable={false}
          onNodeMouseEnter={onNodeMouseEnter}
          onNodeMouseLeave={onNodeMouseLeave}
          minZoom={minZoom}
        >
          <SaveContentFitManager />
          <Controls showInteractive={false} />
          <Background variant={BackgroundVariant.Dots} gap={32} size={1} />
        </ReactFlow>
      </div>
    </Page>
  )
}
