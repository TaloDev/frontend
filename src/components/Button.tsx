import { focusStyle } from '../styles/theme'
import Loading from './Loading'
import clsx from 'clsx'
import type { ReactNode, MouseEvent } from 'react'

type ButtonProps = {
  type?: 'submit' | 'reset' | 'button'
  disabled?: boolean
  children?: ReactNode
  onClick?: (event: MouseEvent<HTMLElement>) => void
  isLoading?: boolean
  variant?: string
  className?: string
  icon?: ReactNode
  extra?: object
}

export default function Button({
  type,
  disabled,
  children,
  onClick,
  isLoading,
  variant,
  className,
  icon,
  extra = {}
}: ButtonProps) {
  const colourVariants = ['grey', 'red', 'green', 'black']

  const finalClassName = clsx(`
    disabled:opacity-40
    disabled:cursor-not-allowed
    transition-colors
    ${focusStyle}
    ${className ?? ''}
  `, {
    'bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-800 disabled:bg-indigo-500 text-white': !variant, // default purple button
    'px-4 py-2 w-full rounded font-semibold': [undefined, ...colourVariants].includes(variant),
    'bg-gray-200 hover:bg-gray-300 active:bg-gray-400 disabled:bg-gray-200 text-black': variant === 'grey',
    'bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:bg-red-600 text-white': variant === 'red',
    'bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-green-600 text-white': variant === 'green',
    'bg-gray-800 hover:bg-gray-900 active:bg-black disabled:bg-gray-600 text-white': variant === 'black',
    'text-left': variant === 'bare',
    'flex justify-center hover:bg-indigo-500': isLoading,
    'flex items-center justify-center space-x-1': Boolean(icon),
    'bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-sm p-2 rounded': variant === 'small'
  })

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={finalClassName}
      onClick={onClick}
      {...extra}
    >
      {isLoading && <Loading size={24} thickness={180} />}
      {!isLoading &&
        <>
          {icon}
          {children}
        </>
      }
    </button>
  )
}
