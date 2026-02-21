import clsx from 'clsx'
import { MouseEvent, ReactNode } from 'react'
import { linkStyle, focusStyle } from '../styles/theme'

type LinkButtonProps = {
  onClick: (e: MouseEvent<HTMLElement>) => void
  className?: string
  children: ReactNode
}

export default function LinkButton({ onClick, className, children }: LinkButtonProps) {
  return (
    <button type='button' className={clsx(linkStyle, focusStyle, className)} onClick={onClick}>
      {children}
    </button>
  )
}
