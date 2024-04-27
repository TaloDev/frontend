import PropTypes from 'prop-types'
import { SpinnerCircularFixed } from 'spinners-react'
import colors from 'tailwindcss/colors'

export default function Loading({ size = 80, thickness = 160 }) {
  return (
    <span data-testid='loading'>
      <SpinnerCircularFixed
        color='white'
        secondaryColor={colors.indigo[500]}
        size={size}
        thickness={thickness}
      />
    </span>
  )
}

Loading.propTypes = {
  colour: PropTypes.string,
  size: PropTypes.number,
  thickness: PropTypes.number
}
