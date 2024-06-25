import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Pagination from '../Pagination'

describe('<Pagination />', () => {
  it('should render the correct amount of pages', () => {
    render(<Pagination count={50} pageState={[0, vi.fn()]} itemsPerPage={25} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
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
