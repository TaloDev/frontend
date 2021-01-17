import PropTypes from 'prop-types'

const Button = (props) => {
  return (
    <button
      {...props}
      disable={props.disabled}
      type='button'
      className='bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-800 disabled:opacity-20 disabled:bg-indigo-500 text-gray-100 hover:text-gray-100 font-semibold rounded-md py-2 transition-colors focus:outline-none focus:ring focus:ring-indigo-300'
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
