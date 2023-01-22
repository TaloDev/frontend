import PropTypes from 'prop-types'
import classNames from 'classnames'

function TableBody({ iterator, children, startIdx, configureClassNames }) {
  return (
    <tbody>
      {iterator.map((iteraee, idx) => (
        <tr
          key={idx}
          className={classNames({
            'bg-indigo-600': (startIdx + idx) % 2 !== 0,
            'bg-indigo-500': (startIdx + idx) % 2 === 0,
            ...configureClassNames?.(iteraee, startIdx + idx)
          })}
        >
          {children(iteraee, idx)}
        </tr>
      ))}
    </tbody>
  )
}

TableBody.defaultProps = {
  startIdx: 0
}

TableBody.propTypes = {
  iterator: PropTypes.array.isRequired,
  children: PropTypes.func.isRequired,
  startIdx: PropTypes.number,
  configureClassNames: PropTypes.func
}

export default TableBody
