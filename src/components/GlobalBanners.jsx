import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import routes from '../constants/routes'
import userState from '../state/userState'
import ConfirmEmailBanner from './ConfirmEmailBanner'

const blocklist = [routes.confirmPassword]

export default function GlobalBanners() {
  const location = useLocation()

  const [showBanners, setShowBanners] = useState(false)

  const user = useRecoilValue(userState)

  useEffect(() => {
    setShowBanners(!blocklist.includes(location.pathname))
  }, [location.pathname])

  if (!showBanners) return null

  return (
    <>
      {(!user.emailConfirmed || user.justConfirmedEmail) &&
        <ConfirmEmailBanner />
      }
    </>
  )
}
