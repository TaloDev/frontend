import { MouseEvent, ReactNode } from 'react'
import { linkStyle, focusStyle } from '../styles/theme'

type LinkButtonProps = {
  onClick: (e: MouseEvent<HTMLElement>) => void
  children: ReactNode
}

export default function LinkButton({ onClick, children }: LinkButtonProps) {
  return (
    <button
      type='button'
      className={`${linkStyle} ${focusStyle}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
