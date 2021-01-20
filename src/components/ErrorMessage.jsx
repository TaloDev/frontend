import PropTypes from 'prop-types'

const ErrorMessage = (props) => {
  if (!props.error) return null

  const message = typeof props.error === 'string'
    ? props.error
    : props.error?.response?.data ?? props.error.message

  return (
    <p className='font-bold text-red-400 w-full'>{message}</p>
  )
}

ErrorMessage.propTypes = {
  error: PropTypes.any
}

export default ErrorMessage
