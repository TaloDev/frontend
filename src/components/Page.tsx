import clsx from 'clsx'
import Title from './Title'
import Loading from './Loading'
import GlobalBanners from './GlobalBanners'
import type { ReactNode } from 'react'

type PageProps = {
  title: string
  showBackButton?: boolean
  isLoading?: boolean
  containerClassName?: string
  children: ReactNode
  extraTitleComponent?: ReactNode
  secondaryNav?: ReactNode
  disableBanners?: boolean
}

export default function Page({
  title,
  showBackButton = false,
  isLoading = false,
  containerClassName = '',
  extraTitleComponent,
  children,
  secondaryNav,
  disableBanners
}: PageProps) {
  return (
    <div className='space-y-8'>
      {secondaryNav}

      {!disableBanners && <GlobalBanners />}

      <div className={clsx('space-y-8', containerClassName)}>
        <div className='flex items-center'>
          <Title showBackButton={showBackButton}>{title}</Title>

          {isLoading &&
            <div className='mt-1 ml-4'>
              <Loading size={24} thickness={180} />
            </div>
          }

          {!isLoading && extraTitleComponent}
        </div>

        {children}
      </div>
    </div>
  )
}
