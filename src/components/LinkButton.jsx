import React from 'react'
import PropTypes from 'prop-types'
import { linkStyle } from '../styles/theme'

const LinkButton = (props) => {
  return (
    <button
      type='button'
      className={linkStyle}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  )
}

LinkButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.any.isRequired
}

export default LinkButton
