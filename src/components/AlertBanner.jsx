import React from 'react'
import PropTypes from 'prop-types'
import { IconAlertCircle } from '@tabler/icons'
import classNames from 'classnames'

const AlertBanner = (props) => {
  return (
    <div className={classNames('bg-yellow-600 p-4 rounded flex items-center space-x-4', props.className)} data-testid='alert-banner'>
      <props.icon size={32} />
      <span>{props.text}</span>
    </div>
  )
}

AlertBanner.propTypes = {
  text: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
  className: PropTypes.string,
  icon: PropTypes.func
}

AlertBanner.defaultProps = {
  icon: IconAlertCircle
}

export default AlertBanner
