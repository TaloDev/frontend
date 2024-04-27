import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { IconArrowLeft } from '@tabler/icons-react'
import Button from './Button'
import { useLocation } from 'react-router-dom'

const MobileMenu = (props) => {
  const location = useLocation()
  const [pathname, setPathname] = useState(location.pathname)

  useEffect(() => {
    setPathname(location.pathname)
  }, [props.visible])

  useEffect(() => {
    if (props.visible && location.pathname !== pathname) {
      props.onClose()
    }
  }, [location.pathname, pathname, props.visible])

  return (
    <div data-testid='mobile-menu' className={clsx(
      'fixed transition-transform transform top-0 left-0 bg-gray-900 p-4 w-full h-full z-[999] md:hidden overflow-y-scroll',
      {
        'translate-x-0': props.visible,
        '-translate-x-full': !props.visible
      }
    )}>
      <Button
        variant='icon'
        onClick={props.onClose}
        extra={{ 'aria-label': 'Close navigation menu' }}
      >
        <span className='text-white bg-indigo-600 rounded-full p-1 flex'>
          <IconArrowLeft size={32} />
        </span>
      </Button>

      <ul className='md:hidden mt-8 space-y-8 text-xl'>
        {props.children}
      </ul>
    </div>
  )
}

MobileMenu.propTypes = {
  children: PropTypes.node.isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

export default MobileMenu
