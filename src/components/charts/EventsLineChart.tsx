import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
import { z } from 'zod'
import { eventsVisualisationPayloadSchema } from '../../api/useEvents'
import ChartTick from '../../components/charts/ChartTick'
import { formatUTC } from '../../utils/formatUTC'
import { getPersistentColour } from '../../utils/getPersistentColour'
import { EventChartContainer } from './EventChartContainer'
import { EventChartTooltip } from './EventChartTooltip'
import { useYAxis } from './useYAxis'

type Events = Record<string, z.infer<typeof eventsVisualisationPayloadSchema>[]>

type Props = {
  events: Events | undefined
  selectedEventNames: string[]
}

export function EventsLineChart({ events, selectedEventNames }: Props) {
  const { yAxisProps } = useYAxis({
    data: Object.values(events ?? {}),
    transformer: (d) => d.flat().map((item) => item.count),
  })

  const hasSelection = selectedEventNames.length > 0

  return (
    <EventChartContainer>
      <LineChart margin={{ top: 8, left: 16, bottom: 20, right: 8 }}>
        <CartesianGrid strokeDasharray='4' stroke='#444' vertical={false} />

        <XAxis
          dataKey='date'
          type='number'
          domain={['dataMin', 'dataMax']}
          scale='time'
          tick={
            <ChartTick
              transform={(x, y) => `translate(${x},${y}) rotate(-30)`}
              formatter={(tick) => {
                if (!isFinite(tick as number)) return tick
                return formatUTC(tick, 'd MMM')
              }}
            />
          }
        />

        <YAxis dataKey='count' {...yAxisProps} />

        {hasSelection && <Tooltip content={<EventChartTooltip />} />}

        {selectedEventNames.map((eventName) => (
          <Line
            dataKey='count'
            data={events?.[eventName] ?? []}
            key={eventName}
            stroke={getPersistentColour(eventName)}
            activeDot={{ r: 6 }}
            type='linear'
            strokeWidth={3}
            dot={false}
            animationDuration={300}
          />
        ))}
      </LineChart>
    </EventChartContainer>
  )
}
