import { useState } from 'react'
import LinkButton from './LinkButton'
import clsx from 'clsx'
import { IconChevronDown } from '@tabler/icons-react'
import Link from './Link'

export default function TaloInfoCard() {
  const [showInfo, setShowInfo] = useState(false)

  return (
    <>
      <LinkButton className='flex space-x-2 items-center' onClick={() => setShowInfo(!showInfo)}>
        <span>What is Talo?</span>
        <IconChevronDown className={clsx('transition-transform', { 'rotate-180': showInfo })} />
      </LinkButton>

      {showInfo &&
        <div className='flex space-x-4'>
          <div className='w-1 bg-gray-700' />
          <p className='text-sm md:text-base'>
            Talo is an open-source game backend: it&apos;s the easiest way to integrate leaderboards, stats, player management and more.
            {' '}<Link to='https://trytalo.com'>Learn more here</Link>.
          </p>
        </div>
      }
    </>
  )
}
