import React from 'react'
import PropTypes from 'prop-types'
import { Link as RouterLink } from 'react-router-dom'
import { focusStyle, linkStyle } from '../styles/theme'

const Link = (props) => {
  return (
    <RouterLink
      to={props.to}
      className={`${linkStyle} ${focusStyle}`}
    >
      {props.children}
    </RouterLink>
  )
}

Link.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired
}

export default Link
