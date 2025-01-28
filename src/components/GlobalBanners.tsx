import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import routes from '../constants/routes'
import organisationState from '../state/organisationState'
import userState, { AuthedUser } from '../state/userState'
import ConfirmEmailBanner from './ConfirmEmailBanner'
import PaymentRequiredBanner from './billing/PaymentRequiredBanner'
import { UserType } from '../entities/user'
import justConfirmedEmailState from '../state/justConfirmedEmailState'
import UsageWarningBanner from './UsageWarningBanner'
import usePricingPlanUsage from '../api/usePricingPlanUsage'

const blocklist = [routes.confirmPassword]

export default function GlobalBanners() {
  const location = useLocation()

  const [showBanners, setShowBanners] = useState(false)

  const user = useRecoilValue(userState) as AuthedUser
  const organisation = useRecoilValue(organisationState)
  const justConfirmedEmail = useRecoilValue(justConfirmedEmailState)

  useEffect(() => {
    setShowBanners(!blocklist.includes(location.pathname))
  }, [location.pathname])

  const showConfirmEmailBanner = !user.emailConfirmed || justConfirmedEmail
  const showPaymentRequiredBanner = user.type === UserType.OWNER && organisation.pricingPlan.status !== 'active'

  const { usage, loading: usageLoading, error: usageError } = usePricingPlanUsage()
  const showUsageWarningBanner = !usageLoading && !usageError && usage.used >= usage.limit * 0.75

  if (!showBanners || !(showConfirmEmailBanner || showPaymentRequiredBanner || showUsageWarningBanner)) return null

  return (
    <div className='space-y-4'>
      {showConfirmEmailBanner && <ConfirmEmailBanner />}
      {showPaymentRequiredBanner && <PaymentRequiredBanner />}
      {showUsageWarningBanner && <UsageWarningBanner usage={usage} />}
    </div>
  )
}
