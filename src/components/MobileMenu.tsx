import type { ReactNode } from 'react'
import { IconArrowLeft } from '@tabler/icons-react'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Button from './Button'

type MobileMenuProps = {
  children: ReactNode
  visible: boolean
  onClose: () => void
}

export default function MobileMenu({ children, visible, onClose }: MobileMenuProps) {
  const location = useLocation()
  const [pathname, setPathname] = useState(location.pathname)

  useEffect(() => {
    setPathname(location.pathname)
  }, [visible, location])

  useEffect(() => {
    if (visible && location.pathname !== pathname) {
      onClose()
    }
  }, [location.pathname, pathname, visible, onClose])

  return (
    <div
      data-testid='mobile-menu'
      className={clsx(
        'fixed top-0 left-0 z-[999] h-full w-full transform overflow-y-scroll bg-gray-900 p-4 transition-transform md:hidden',
        {
          'translate-x-0': visible,
          '-translate-x-full': !visible,
        },
      )}
    >
      <Button variant='icon' onClick={onClose} extra={{ 'aria-label': 'Close navigation menu' }}>
        <span className='flex rounded-full bg-indigo-600 p-1 text-white'>
          <IconArrowLeft size={32} />
        </span>
      </Button>

      <ul className='mt-8 space-y-8 text-xl md:hidden'>{children}</ul>
    </div>
  )
}
