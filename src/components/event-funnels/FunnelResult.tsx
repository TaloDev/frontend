import { FunnelResultStep } from '../../entities/eventFunnel'

function formatAvgTime(seconds: number) {
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`
  }
  return `${(seconds / 60).toFixed(1)}m`
}

export function FunnelResult({ steps }: { steps: FunnelResultStep[] }) {
  const firstPlayers = steps[0]?.players ?? 0

  return (
    <div className='flex w-full space-x-4'>
      {steps.map((step, idx) => {
        const percentage = step.percentage ?? 0
        const barHeight = firstPlayers > 0 ? (step.players / firstPlayers) * 100 : 0

        return (
          <div key={idx} className='flex min-w-0 flex-1 flex-col items-center'>
            <div className='mb-2 text-center font-mono text-sm'>
              <p>{percentage}%</p>
              <p className='text-xs text-gray-400'>
                {step.players.toLocaleString()} player{step.players === 1 ? '' : 's'}
              </p>
            </div>

            <div className='h-40 w-full overflow-hidden rounded-t bg-indigo-500/10 md:h-64'>
              <div className='flex h-full w-full items-end'>
                <div className='w-full bg-indigo-500' style={{ height: `${barHeight}%` }} />
              </div>
            </div>

            <div className='mt-2 text-center text-sm'>
              <p className='font-semibold break-words'>{step.eventName}</p>
              <p className='font-mono text-xs text-gray-400'>
                {step.avgSecondsToNext !== null
                  ? `avg ${formatAvgTime(step.avgSecondsToNext)} to next`
                  : '\u00A0'}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
