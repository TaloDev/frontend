import PropTypes from 'prop-types'

export default function Identifier({ id, children }) {
  return (
    <div>
      <code className='bg-gray-900 rounded p-2 text-xs md:text-sm'>
        {children}
        {id}
      </code>
    </div>
  )
}

Identifier.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node
}
