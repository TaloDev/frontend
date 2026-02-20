import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import Link from '../Link'
import MobileMenu from '../MobileMenu'

describe('<MobileMenu />', () => {
  it('should close when going to a different page', async () => {
    const closeMock = vi.fn()

    render(
      <MobileMenu visible={true} onClose={closeMock}>
        <li>
          <Link to='/events'>Events</Link>
        </li>
      </MobileMenu>,
      { wrapper: BrowserRouter },
    )

    await userEvent.click(screen.getByText('Events'))

    await waitFor(() => expect(closeMock).toHaveBeenCalled())
  })
})
