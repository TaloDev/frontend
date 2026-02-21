import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import usePricingPlanUsage from '../api/usePricingPlanUsage'
import routes from '../constants/routes'
import { UserType } from '../entities/user'
import justConfirmedEmailState from '../state/justConfirmedEmailState'
import organisationState from '../state/organisationState'
import userState, { AuthedUser } from '../state/userState'
import PaymentRequiredBanner from './billing/PaymentRequiredBanner'
import ConfirmEmailBanner from './ConfirmEmailBanner'
import UsageWarningBanner from './UsageWarningBanner'

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
  const showPaymentRequiredBanner =
    user.type === UserType.OWNER && organisation.pricingPlan.status !== 'active'

  const {
    usage,
    loading: usageLoading,
    error: usageError,
  } = usePricingPlanUsage(showBanners && user.type === UserType.OWNER)
  const showUsageWarningBanner = !usageLoading && !usageError && usage.used >= usage.limit * 0.75

  if (
    !showBanners ||
    !(showConfirmEmailBanner || showPaymentRequiredBanner || showUsageWarningBanner)
  )
    return null

  return (
    <div className='space-y-4'>
      {showConfirmEmailBanner && <ConfirmEmailBanner />}
      {showPaymentRequiredBanner && <PaymentRequiredBanner />}
      {showUsageWarningBanner && <UsageWarningBanner usage={usage} />}
    </div>
  )
}
