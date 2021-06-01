import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Button from './Button'

const Pagination = (props) => {
  const itemsPerPage = 25
  const totalPages = Math.ceil(props.count / itemsPerPage)

  if (totalPages === 1) return null

  const [page, setPage] = props.pageState
  const pages = [...new Array(totalPages)].map((_, idx) => String(idx + 1))

  return (
    <div className='w-full flex justify-center'>
      <ul className='flex -ml-1'>
        {pages.map((val, idx) => (
          <li key={val}>
            <Button
              variant='bare'
              className={classNames(
                'py-2 w-8 ml-1 text-black text-center rounded-sm',
                { 'bg-white': page !== idx },
                { 'bg-indigo-500 !text-white': page === idx
              })}
              onClick={() => setPage(idx)}
            >
              {val}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

Pagination.propTypes = {
  count: PropTypes.number.isRequired,
  pageState: PropTypes.array.isRequired
}

export default Pagination
