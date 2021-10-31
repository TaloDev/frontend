import React from 'react'
import PropTypes from 'prop-types'
import { SpinnerCircularFixed } from 'spinners-react'

const Loading = (props) => {
  return (
    <span data-testid='loading'>
      <SpinnerCircularFixed
        color='white'
        secondaryColor='#6366F1' // TODO use tailwind colour
        size={props.size}
        thickness={props.thickness}
      />
    </span>
  )
}

Loading.propTypes = {
  colour: PropTypes.string,
  size: PropTypes.number,
  thickness: PropTypes.number
}

Loading.defaultProps = {
  size: 80,
  thickness: 160
}

export default Loading
