import PropTypes from 'prop-types'
import clsx from 'clsx'

export default function SecondaryTitle({ className, children }) {
  return <h2 className={clsx('text-2xl', className)}>{children}</h2>
}

SecondaryTitle.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired
}
