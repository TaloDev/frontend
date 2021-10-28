import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import MobileMenu from '../MobileMenu'
import Link from '../Link'

describe('<MobileMenu />', () => {
  it('should close when going to a different page', async () => {
    const closeMock = jest.fn()

    render(
      <MobileMenu visible={true} onClose={closeMock}>
        <li>
          <Link to='/events'>Events</Link>
        </li>
      </MobileMenu>
      , { wrapper: BrowserRouter }
    )

    userEvent.click(screen.getByText('Events'))

    await waitFor(() => expect(closeMock).toHaveBeenCalled())
  })
})
