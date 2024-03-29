import PropTypes from 'prop-types'
import { IconAlertCircle } from '@tabler/icons-react'
import clsx from 'clsx'

const AlertBanner = (props) => {
  return (
    <div className={clsx('bg-yellow-600 p-4 rounded flex items-center space-x-4', props.className)} data-testid='alert-banner'>
      <props.icon size={24} className='shrink-0' />
      <span>{props.text}</span>
    </div>
  )
}

AlertBanner.propTypes = {
  text: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
  className: PropTypes.string,
  icon: PropTypes.object
}

AlertBanner.defaultProps = {
  icon: IconAlertCircle
}

export default AlertBanner
