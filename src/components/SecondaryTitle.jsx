import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export default function SecondaryTitle({ className, children }) {
  return <h2 className={classNames('text-2xl', className)}>{children}</h2>
}

SecondaryTitle.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired
}
