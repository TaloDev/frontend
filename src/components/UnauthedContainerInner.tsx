import clsx from 'clsx'
import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'
import { unauthedContainerStyle } from '../styles/theme'

type Props<T extends ElementType> = {
  as?: T
  children: ReactNode
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children'>

export function UnauthedContainerInner<T extends ElementType = 'div'>({
  as: As,
  children,
  className,
  ...props
}: Props<T>) {
  const Tag = As ?? 'div'

  return (
    <Tag className={clsx('space-y-8 text-white', unauthedContainerStyle, className)} {...props}>
      {children}
    </Tag>
  )
}
