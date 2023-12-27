import PropTypes from 'prop-types'
import clsx from 'clsx'

function TableBody({ iterator, children, startIdx, configureClassnames }) {
  return (
    <tbody>
      {iterator.map((iteraee, idx) => (
        <tr
          key={idx}
          className={clsx({
            'bg-indigo-600': (startIdx + idx) % 2 !== 0,
            'bg-indigo-500': (startIdx + idx) % 2 === 0,
            ...configureClassnames?.(iteraee, startIdx + idx)
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
  configureClassnames: PropTypes.func
}

export default TableBody
