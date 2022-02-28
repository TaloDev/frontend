import React from 'react'
import PropTypes from 'prop-types'
import { Link as RouterLink } from 'react-router-dom'
import { focusStyle, linkStyle } from '../styles/theme'

function Link({ to, className, children }) {
  return (
    <RouterLink
      to={to}
      className={`${linkStyle} ${focusStyle} ${className ?? ''}`}
    >
      {children}
    </RouterLink>
  )
}

Link.propTypes = {
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  className: PropTypes.string,
  children: PropTypes.any.isRequired
}

export default Link
