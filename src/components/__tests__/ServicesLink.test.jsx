import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import ServicesLink from '../ServicesLink'
import { RecoilRoot } from 'recoil'
import userState from '../../state/userState'
import RecoilObserver from '../../state/RecoilObserver'

describe('<ServicesLink />', () => {
  it('should close when going to a different page', async () => {
    render(
      <BrowserRouter>
        <RecoilObserver node={userState} initialValue={{ type: 1 }}>
          <ServicesLink />
        </RecoilObserver>
      </BrowserRouter>
      , { wrapper: RecoilRoot }
    )

    userEvent.click(screen.getByText('Services'))
    userEvent.click(screen.getByText('Players'))

    await waitFor(() => expect(screen.queryByText('Players')).not.toBeInTheDocument())
  })
})
