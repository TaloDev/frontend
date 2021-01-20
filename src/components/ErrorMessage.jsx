import PropTypes from 'prop-types'

const ErrorMessage = (props) => {
  if (!props.error) return null

  return (
    <p className='font-bold text-red-400 text-sm w-full'>
      {props.error.message}
      {props.children}
    </p>
  )
}

ErrorMessage.propTypes = {
  error: PropTypes.object,
  children: PropTypes.any
}

export default ErrorMessage
