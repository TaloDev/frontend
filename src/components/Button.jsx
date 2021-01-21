import PropTypes from 'prop-types'
import { focusStyle } from '../styles/theme'
import Loading from './Loading'
import classNames from 'classnames'

const Button = (props) => {
  const className = classNames(`
    w-full
    disabled:opacity-40
    disabled:cursor-not-allowed
    font-semibold
    rounded-md
    px-4
    py-2
    transition-colors
    ${focusStyle}
  `, {
    'bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-800 disabled:bg-indigo-500 text-white': !props.variant,
    'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 disabled:bg-gray-100 text-black': props.variant === 'light',
    'flex justify-center hover:bg-indigo-500': props.isLoading
  })

  return (
    <button
      disabled={props.disabled}
      className={className}
      onClick={props.onClick}
    >
      {props.isLoading && <Loading size={24} thickness={180} />}
      {!props.isLoading && props.children}
    </button>
  )
}

Button.propTypes = {
  disabled: PropTypes.bool,
  children: PropTypes.any.isRequired,
  onClick: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  variant: PropTypes.string
}

export default Button
