import classNames from 'classnames'
import React from 'react'
import { useRecoilValue } from 'recoil'
import devDataState from '../state/devDataState'
import DevDataToggle from './toggles/DevDataToggle'

function DevDataStatus() {
  const includeDevData = useRecoilValue(devDataState)

  return (
    <div className='space-y-4'>
      <h2 className='text-2xl mt-4 md:mt-0'>Dev data is currently
        <span className={classNames('font-semibold', { 'text-orange-400': includeDevData })}>
          {' '}{includeDevData ? 'enabled' : 'not enabled'}
        </span>
      </h2>

      <p>When enabled, you&apos;ll see data submitted by players from dev builds of your game.</p>

      <DevDataToggle />
    </div>
  )
}

export default DevDataStatus
