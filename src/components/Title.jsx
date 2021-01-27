import React from 'react'
import PropTypes from 'prop-types'

const Title = (props) => {
  return (
    <h1 className='text-2xl md:text-4xl font-bold'>{props.children}</h1>
  )
}

Title.propTypes = {
  children: PropTypes.node.isRequired
}

export default Title
