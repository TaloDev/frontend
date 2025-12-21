import clsx from 'clsx'
import Button from './Button'
import { Dispatch, SetStateAction } from 'react'

type PaginationProps = {
  count: number
  pageState: [number, Dispatch<SetStateAction<number>>]
  itemsPerPage: number
  maxPageButtons?: number
}

export default function Pagination({
  count,
  pageState,
  itemsPerPage,
  maxPageButtons = 10
}: PaginationProps) {
  const [page, setPage] = pageState
  const totalPages = Math.ceil(count / itemsPerPage)

  if (totalPages <= 1) {
    return null
  }

  let startPage = Math.max(0, page - Math.floor(maxPageButtons / 2))
  const endPage = Math.min(totalPages - 1, startPage + maxPageButtons - 1)

  if (endPage - startPage + 1 < maxPageButtons) {
    startPage = Math.max(0, endPage - maxPageButtons + 1)
  }

  const pagesToShow: (number | 'ellipsis')[] = []

  if (startPage > 0) {
    pagesToShow.push(0)
    if (startPage > 1) {
      pagesToShow.push('ellipsis')
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pagesToShow.push(i)
  }

  if (endPage < totalPages - 1) {
    if (endPage < totalPages - 2) {
      pagesToShow.push('ellipsis')
    }
    pagesToShow.push(totalPages - 1)
  }

  const goToPage = (pageNumber: number) => {
    setPage(Math.max(0, Math.min(pageNumber, totalPages - 1)))
  }

  return (
    <div className='w-full flex justify-center py-4'>
      <nav aria-label='Pagination'>
        <ul className='flex items-center space-x-2'>
          <li>
            <Button
              variant='bare'
              className='px-3 py-2 text-sm font-medium text-black bg-white rounded-md hover:enabled:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed'
              onClick={() => goToPage(page - 1)}
              disabled={page === 0}
            >
              Previous
            </Button>
          </li>

          {pagesToShow.map((pageNumber, idx) => (
            <li
              key={idx}
              className={clsx(
                'lg:inline',
                { 'hidden': typeof pageNumber !== 'number' || Math.abs(pageNumber - page) > 2 },
                { 'md:inline': typeof pageNumber === 'number' && Math.abs(pageNumber - page) <= 4 }
              )}
            >
              {pageNumber === 'ellipsis' ? (
                <span className='p-2 text-sm font-medium text-gray-400'>...</span>
              ) : (
                <Button
                  variant='bare'
                  className={clsx(
                    'min-w-10 px-3 py-2 text-black text-center! text-sm font-medium rounded-md',
                    { 'bg-white hover:bg-gray-200': page !== pageNumber },
                    { 'bg-indigo-500 text-white': page === pageNumber }
                  )}
                  onClick={() => goToPage(pageNumber)}
                >
                  {pageNumber + 1}
                </Button>
              )}
            </li>
          ))}

          <li>
            <Button
              variant='bare'
              className='px-3 py-2 text-sm font-medium text-black bg-white rounded-md hover:enabled:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed'
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages - 1}
            >
              Next
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  )
}
