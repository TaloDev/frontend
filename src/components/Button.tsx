import type { ReactNode, MouseEvent } from 'react'
import clsx from 'clsx'
import { focusStyle } from '../styles/theme'
import Loading from './Loading'

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
  extra = {},
}: ButtonProps) {
  const colourVariants = ['grey', 'red', 'green', 'black']

  const finalClassName = clsx(`
    transition-colors
    disabled:cursor-not-allowed
    disabled:opacity-40
    ${focusStyle}
    ${className ?? ''}
  `, {
    'bg-indigo-500 text-white hover:bg-indigo-600 active:bg-indigo-800 disabled:bg-indigo-500':
      !variant, // default purple button
    'w-full rounded px-4 py-2 font-semibold': [undefined, ...colourVariants].includes(variant),
    'bg-gray-200 text-black hover:bg-gray-300 active:bg-gray-400 disabled:bg-gray-200':
      variant === 'grey',
    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:bg-red-600':
      variant === 'red',
    'bg-green-600 text-white hover:bg-green-700 active:bg-green-800 disabled:bg-green-600':
      variant === 'green',
    'bg-gray-800 text-white hover:bg-gray-900 active:bg-black disabled:bg-gray-600':
      variant === 'black',
    'text-left': variant === 'bare',
    'flex justify-center hover:bg-indigo-500': isLoading,
    'flex items-center justify-center space-x-1': Boolean(icon),
    'rounded bg-gray-200 p-2 text-sm hover:bg-gray-300 active:bg-gray-400': variant === 'small',
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
      {!isLoading && (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  )
}
