import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { IconArrowLeft } from '@tabler/icons-react'
import Button from './Button'
import { useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'

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
    <div data-testid='mobile-menu' className={clsx(
      'fixed transition-transform transform top-0 left-0 bg-gray-900 p-4 w-full h-full z-[999] md:hidden overflow-y-scroll',
      {
        'translate-x-0': visible,
        '-translate-x-full': !visible
      }
    )}>
      <Button
        variant='icon'
        onClick={onClose}
        extra={{ 'aria-label': 'Close navigation menu' }}
      >
        <span className='text-white bg-indigo-600 rounded-full p-1 flex'>
          <IconArrowLeft size={32} />
        </span>
      </Button>

      <ul className='md:hidden mt-8 space-y-8 text-xl'>
        {children}
      </ul>
    </div>
  )
}
