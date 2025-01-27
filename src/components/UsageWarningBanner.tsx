import { Link } from 'react-router-dom'
import AlertBanner from './AlertBanner'
import { IconInfoCircle } from '@tabler/icons-react'
import { PricingPlanUsage } from '../entities/pricingPlan'

type UsageWarningBannerProps = {
  usage: PricingPlanUsage
}

export default function UsageWarningBanner({ usage }: UsageWarningBannerProps) {
  return (
    <AlertBanner
      className='w-full lg:2/3 xl:w-1/2'
      icon={IconInfoCircle}
      text={<p>You&apos;ve used {Math.round(usage.used / usage.limit ?? Infinity * 100)}% of your current plan&apos;s limit. <Link to='/billing' className='font-bold underline'>Upgrade your plan</Link> to avoid any disruption to your game.</p>}
    />
  )
}
