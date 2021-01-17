import PropTypes from 'prop-types'

const Button = (props) => {
  const {
    onClick,
    children,
    ...otherProps
  } = props

  return (
    <button
      type='button'
      className='bg-indigo-500 hover:bg-indigo-600 text-gray-100 hover:text-gray-100 font-semibold rounded-md py-2 transition-colors focus:outline-none focus:ring focus:ring-indigo-300'
      onClick={onClick}
      {...otherProps}
    >
      {children}
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.any.isRequired,
  onClick: PropTypes.func.isRequired
}

export default Button
