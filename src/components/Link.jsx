import PropTypes from 'prop-types'
import { Link as RouterLink } from 'react-router-dom'
import { linkStyle } from '../styles/theme'

const Link = (props) => {
  return (
    <RouterLink
      to={props.to}
      className={linkStyle}
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
