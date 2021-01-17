import PropTypes from 'prop-types'
import { focusStyle } from '../styles/theme'

const Button = (props) => {
  return (
    <button
      {...props}
      disable={props.disabled}
      type='button'
      className={`bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-800 disabled:opacity-40 disabled:bg-indigo-500 text-white font-semibold rounded-md py-2 transition-colors ${focusStyle}`}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  )
}

Button.propTypes = {
  disabled: PropTypes.bool,
  children: PropTypes.any.isRequired,
  onClick: PropTypes.func.isRequired
}

export default Button
