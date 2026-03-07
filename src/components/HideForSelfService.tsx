import { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

export function HideForSelfService({ children }: { children: ReactNode }) {
  const location = useLocation()

  if (location.pathname.startsWith('/manage/')) {
    return null
  }

  return children
}
