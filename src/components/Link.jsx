import React from 'react'
import PropTypes from 'prop-types'
import { Link as RouterLink } from 'react-router-dom'
import { linkStyle } from '../styles/theme'

const Link = (props) => {
  return (
    <RouterLink
      to={props.to}
      className={'text-indigo-400 hover:underline font-semibold transition-colors rounded-none focus:outline-none focus:ring focus:ring-pink-500'}
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
