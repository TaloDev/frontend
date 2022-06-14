import { IconInfoCircle } from '@tabler/icons'
import React from 'react'
import AlertBanner from '../AlertBanner'
import { capitalize } from 'lodash-es'

export default function RegisterPlanBanner() {
  const planName = new URLSearchParams(window.location.search).get('plan')

  if (!planName || planName.toLowerCase() === 'indie') return null

  const text = planName.toLowerCase() === 'enterprise'
    ? <span>To learn more about <span className='font-semibold'>Enterprise Plans</span>, visit the Billing page after registering and creating your first game</span>
    : <span>To upgrade to the <span className='font-semibold'>{capitalize(planName)} Plan</span>, visit the Billing page after registering and creating your first game</span>

  return (
    <AlertBanner
      className='w-full bg-gray-900'
      icon={IconInfoCircle}
      text={text}
    />
  )
}
