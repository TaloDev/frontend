import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Pagination from '../Pagination'

describe('<Pagination />', () => {
  it('should render the correct amount of pages', () => {
    render(<Pagination count={50} pageState={[0, vi.fn()]} itemsPerPage={25} />)
    // previous, 1, 2, next
    expect(screen.getAllByRole('listitem')).toHaveLength(4)
  })

  it('should render the correct amount of pages and ellipsis', () => {
    render(
      <Pagination count={350} pageState={[7, vi.fn()]} itemsPerPage={25} maxPageButtons={10} />,
    )
    // previous, 1, ..., 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, ..., 14, next
    expect(screen.getAllByRole('listitem')).toHaveLength(16)
  })

  it('should go to the correct page on click', async () => {
    const changeMock = vi.fn()

    render(<Pagination count={78} pageState={[0, changeMock]} itemsPerPage={25} />)

    await userEvent.click(screen.getByText('4'))

    expect(changeMock).toHaveBeenCalledWith(3)
  })

  it('should not render if there are not enough items to paginate', () => {
    render(<Pagination count={3} pageState={[0, vi.fn()]} itemsPerPage={25} />)

    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
  })
})
