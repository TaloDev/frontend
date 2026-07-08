import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { Cell, Pie, PieChart, Tooltip } from 'recharts'
import { z } from 'zod'
import { eventsVisualisationPayloadSchema } from '../../api/useEvents'
import { EventChartContainer } from '../../components/charts/EventChartContainer'
import { EventsPieTooltip } from '../../components/charts/EventsPieTooltip'
import routes from '../../constants/routes'
import { getPersistentColour, getPersistentStroke } from '../../utils/getPersistentColour'

type Events = Record<string, z.infer<typeof eventsVisualisationPayloadSchema>[]>

type Props = {
  events?: Events
  selectedEventNames: string[]
  showBreakdown?: boolean
}

export function EventsPieChart({ events, selectedEventNames, showBreakdown }: Props) {
  const navigate = useNavigate()

  const pieData = useMemo(
    () =>
      selectedEventNames.map((name) => ({
        name,
        value: events?.[name]?.reduce((acc, item) => acc + item.count, 0) ?? 0,
      })),
    [selectedEventNames, events],
  )

  const sampledLabelNames = useMemo(() => {
    const s = pieData.length
    if (s === 0) {
      return new Set<string>()
    }
    if (s <= 10) {
      return new Set(pieData.map((d) => d.name))
    }

    const step = s / 10
    const names = new Set<string>()
    for (let i = 0; i < 10; i++) {
      names.add(pieData[Math.floor(i * step)].name)
    }

    return names
  }, [pieData])

  const pieTotal = useMemo(() => pieData.reduce((acc, d) => acc + d.value, 0), [pieData])

  const hasSelection = selectedEventNames.length > 0
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <EventChartContainer>
      <PieChart>
        <Pie
          data={pieData}
          dataKey='value'
          nameKey='name'
          cx='50%'
          cy='50%'
          innerRadius='50%'
          outerRadius='80%'
          paintOrder='stroke'
          onMouseEnter={(_, index) => setActiveIndex(index)}
          onMouseLeave={() => setActiveIndex(null)}
          labelLine={false}
          animationDuration={300}
          label={({ cx, cy, midAngle, outerRadius, name, index }) => {
            if (!sampledLabelNames.has(name ?? '')) {
              return null
            }

            const RADIAN = Math.PI / 180
            const angle = -(midAngle ?? 0) * RADIAN
            const edgeX = (cx ?? 0) + ((outerRadius ?? 0) + 1) * Math.cos(angle)
            const edgeY = (cy ?? 0) + ((outerRadius ?? 0) + 1) * Math.sin(angle)
            const lineEndX = (cx ?? 0) + ((outerRadius ?? 0) + 16) * Math.cos(angle)
            const lineEndY = (cy ?? 0) + ((outerRadius ?? 0) + 16) * Math.sin(angle)
            const textX = (cx ?? 0) + ((outerRadius ?? 0) + 32) * Math.cos(angle)
            const textY = (cy ?? 0) + ((outerRadius ?? 0) + 32) * Math.sin(angle)
            const isActive = index === activeIndex
            const lineColor = isActive ? '#fff' : getPersistentStroke(name ?? '')

            return (
              <g key={name}>
                <line
                  x1={edgeX}
                  y1={edgeY}
                  x2={lineEndX}
                  y2={lineEndY}
                  stroke={lineColor}
                  className='transition-colors duration-150'
                />
                <text
                  x={textX}
                  y={textY}
                  fill='#fff'
                  fontSize={14}
                  textAnchor={textX > (cx ?? 0) ? 'start' : 'end'}
                  dominantBaseline='central'
                >
                  {name}
                </text>
              </g>
            )
          }}
          onClick={
            showBreakdown
              ? (entry) => {
                  navigate(routes.eventBreakdown, { state: { eventName: entry.name } })
                }
              : undefined
          }
        >
          {pieData.map((entry) => (
            <Cell
              key={entry.name}
              fill={getPersistentColour(entry.name)}
              stroke={getPersistentStroke(entry.name)}
              strokeWidth={2}
              className={showBreakdown ? undefined : 'cursor-default'}
            />
          ))}
        </Pie>
        {hasSelection && <Tooltip content={<EventsPieTooltip total={pieTotal} />} />}
      </PieChart>
    </EventChartContainer>
  )
}
