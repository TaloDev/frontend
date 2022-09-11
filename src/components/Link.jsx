import React from 'react'
import PropTypes from 'prop-types'
import { Link as RouterLink } from 'react-router-dom'
import { focusStyle, linkStyle } from '../styles/theme'
import classNames from 'classnames'

function Link({ to, className, children }) {
  const linkClass = classNames(linkStyle, focusStyle, className ?? '')

  if (typeof to === 'string' && to.startsWith('http')) {
    return (
      <a href={to} className={linkClass} target='_blank' rel='noreferrer'>{children}</a>
    )
  }

  return (
    <RouterLink
      to={to}
      className={linkClass}
    >
      {children}
    </RouterLink>
  )
}

Link.propTypes = {
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  className: PropTypes.string,
  children: PropTypes.any.isRequired
}

export default Link
