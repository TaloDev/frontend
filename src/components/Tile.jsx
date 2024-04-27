import PropTypes from 'prop-types'
import clsx from 'clsx'

export default function Tile({ header, content, footer, selected }) {
  return (
    <div
      className={clsx(
        'relative transition-colors block rounded py-4 border',
        { 'bg-indigo-500 border-indigo-400': selected },
        { 'bg-gray-700 border-gray-600': !selected }
      )}
    >
      <div className='space-y-4'>
        <div className='flex justify-between items-center px-4'>{header}</div>
        <div className={clsx('h-[1px] bg-gray-600 my-4', { 'bg-indigo-400': selected })} />
        <div className='flex justify-between items-center px-4'>{content}</div>

        {footer}
      </div>
    </div>
  )
}

Tile.propTypes = {
  header: PropTypes.node.isRequired,
  content: PropTypes.node.isRequired,
  footer: PropTypes.node,
  selected: PropTypes.bool
}
