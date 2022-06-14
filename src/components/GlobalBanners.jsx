import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import routes from '../constants/routes'
import organisationState from '../state/organisationState'
import userState from '../state/userState'
import ConfirmEmailBanner from './ConfirmEmailBanner'
import PaymentRequiredBanner from './billing/PaymentRequiredBanner'
import userTypes from '../constants/userTypes'

const blocklist = [routes.confirmPassword]

export default function GlobalBanners() {
  const location = useLocation()

  const [showBanners, setShowBanners] = useState(false)

  const user = useRecoilValue(userState)
  const organisation = useRecoilValue(organisationState)

  useEffect(() => {
    setShowBanners(!blocklist.includes(location.pathname))
  }, [location.pathname])

  const showConfirmEmailBanner = !user.emailConfirmed || user.justConfirmedEmail
  const showPaymentRequiredBanner = user.type === userTypes.OWNER && organisation.pricingPlan.status !== 'active'

  if (!showBanners || !(showConfirmEmailBanner || showPaymentRequiredBanner)) return null

  return (
    <div className='space-y-4'>
      {showConfirmEmailBanner && <ConfirmEmailBanner />}
      {showPaymentRequiredBanner && <PaymentRequiredBanner />}
    </div>
  )
}
