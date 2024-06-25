import { Link as RouterLink } from 'react-router-dom'
import { focusStyle, linkStyle } from '../styles/theme'
import clsx from 'clsx'
import type { ReactNode } from 'react'

type LinkProps = {
  to: string
  state?: object
  className?: string
  children: ReactNode
}

function Link({
  to,
  state,
  className,
  children
}: LinkProps) {
  const linkClass = clsx(linkStyle, focusStyle, className ?? '')

  if (to.startsWith('http')) {
    return (
      <a href={to} className={linkClass} target='_blank' rel='noreferrer'>{children}</a>
    )
  }

  return (
    <RouterLink
      to={to}
      state={state}
      className={linkClass}
    >
      {children}
    </RouterLink>
  )
}

export default Link
