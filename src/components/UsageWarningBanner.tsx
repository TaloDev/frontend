import { IconInfoCircle } from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import { PricingPlanUsage } from '../entities/pricingPlan'
import AlertBanner from './AlertBanner'

type UsageWarningBannerProps = {
  usage: PricingPlanUsage
}

export default function UsageWarningBanner({ usage }: UsageWarningBannerProps) {
  return (
    <AlertBanner
      className='lg:2/3 w-full xl:w-1/2'
      icon={IconInfoCircle}
      text={
        <p>
          You&apos;ve used {Math.round((usage.used / usage.limit) * 100)}% of your current
          plan&apos;s limit.{' '}
          <Link to='/billing' className='font-bold underline'>
            Upgrade your plan
          </Link>{' '}
          to avoid any disruption to your game.
        </p>
      }
    />
  )
}
