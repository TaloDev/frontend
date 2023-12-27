import PropTypes from 'prop-types'
import { Link as RouterLink } from 'react-router-dom'
import { focusStyle, linkStyle } from '../styles/theme'
import clsx from 'clsx'

function Link({ to, state, className, children }) {
  const linkClass = clsx(linkStyle, focusStyle, className ?? '')

  if (to.startsWith('http')) {
    return (
      <a href={to} className={linkClass} target='_blank' rel='noreferrer'>{children}</a>
    )
  }

  return (
    <RouterLink
      to={to}
      state={state}
      className={linkClass}
    >
      {children}
    </RouterLink>
  )
}

Link.propTypes = {
  to: PropTypes.string.isRequired,
  state: PropTypes.object,
  className: PropTypes.string,
  children: PropTypes.node.isRequired
}

export default Link
