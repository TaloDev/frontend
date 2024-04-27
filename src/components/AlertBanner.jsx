import PropTypes from 'prop-types'
import { IconAlertCircle } from '@tabler/icons-react'
import clsx from 'clsx'

export default function AlertBanner({ icon: Icon = IconAlertCircle, text, className }) {
  return (
    <div className={clsx('bg-yellow-600 p-4 rounded flex items-center space-x-4', className)} data-testid='alert-banner'>
      <Icon size={24} className='shrink-0' />
      <span>{text}</span>
    </div>
  )
}

AlertBanner.propTypes = {
  text: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
  className: PropTypes.string,
  icon: PropTypes.object
}
