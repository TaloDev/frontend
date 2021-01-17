import PropTypes from 'prop-types'
import { Link as RouterLink } from 'react-router-dom'
import { focusStyle } from '../styles/theme'

const Link = (props) => {
  return (
    <RouterLink
      to={props.to}
      className={`text-indigo-400 hover:text-indigo-500 transition-colors ${focusStyle}`}
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
