import type { Icon, IconProps } from '@tabler/icons-react'
import type { ForwardRefExoticComponent, ReactNode, RefAttributes } from 'react'
import { IconAlertCircle } from '@tabler/icons-react'
import clsx from 'clsx'

type AlertBannerIcon = ForwardRefExoticComponent<Omit<IconProps, 'ref'> & RefAttributes<Icon>>

type AlertBannerProps = {
  text: ReactNode | string
  className?: string
  icon?: AlertBannerIcon
}

export default function AlertBanner({
  icon: Icon = IconAlertCircle,
  text,
  className,
}: AlertBannerProps) {
  return (
    <div
      className={clsx('flex items-center space-x-4 rounded bg-yellow-600 p-4', className)}
      data-testid='alert-banner'
    >
      <Icon size={24} className='shrink-0' />
      <span>{text}</span>
    </div>
  )
}
