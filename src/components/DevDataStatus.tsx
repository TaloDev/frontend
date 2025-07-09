import clsx from 'clsx'
import { useRecoilValue } from 'recoil'
import devDataState from '../state/devDataState'
import SecondaryTitle from './SecondaryTitle'
import DevDataToggle from './toggles/DevDataToggle'

function DevDataStatus() {
  const includeDevData = useRecoilValue(devDataState)

  return (
    <div className='space-y-4'>
      <SecondaryTitle className='mt-4 md:mt-0'>Dev data is currently
        <span className={clsx('font-semibold', { 'text-orange-500': includeDevData })}>
          {' '}{includeDevData ? 'enabled' : 'not enabled'}
        </span>
      </SecondaryTitle>

      <p>When enabled, the dashboard will display data submitted by players from dev builds. This has no effect on your game.</p>

      <DevDataToggle />
    </div>
  )
}

export default DevDataStatus
