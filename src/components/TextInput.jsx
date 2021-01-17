import PropTypes from 'prop-types'

const TextInput = (props) => {
  return (
    <div className='w-full'>
      <label htmlFor={props.id} className='font-semibold'>{props.label}</label>
      <input
        id={props.id}
        className='bg-gray-600 block mt-1 p-2 rounded-sm w-full focus:outline-none focus:ring focus:ring-indigo-300'
        type={props.type ?? 'text'}
        placeholder={props.placeholder}
        onChange={(e) => props.onChange(e.target.value, e)}
        value={props.value}
      />
    </div>
  )
}

TextInput.propTypes = {
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  type: PropTypes.string
}

export default TextInput
