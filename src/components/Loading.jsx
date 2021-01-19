import React from 'react'
import PropTypes from 'prop-types'
import { SpinnerCircularFixed } from 'spinners-react'

const Loading = (props) => {
  return (
    <SpinnerCircularFixed
      color='white'
      secondaryColor='#6366F1' // TODO use tailwind colour
      size={props.size ?? 80}
      thickness={props.thickness ?? 160}
    />
  )
}

Loading.propTypes = {
  colour: PropTypes.string,
  size: PropTypes.number,
  thickness: PropTypes.number
}

export default Loading
