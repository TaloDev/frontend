import React from 'react'
import { render, screen, within } from '@testing-library/react'
import api from '../../api/api'
import MockAdapter from 'axios-mock-adapter'
import NavBar from '../NavBar'
import RecoilObserver from '../../state/RecoilObserver'
import activeGameState from '../../state/activeGameState'
import { RecoilRoot } from 'recoil'
import { MemoryRouter } from 'react-router-dom'
import userState from '../../state/userState'
import userEvent from '@testing-library/user-event'
import routes from '../../constants/routes'

describe('<NavBar />', () => {
  const axiosMock = new MockAdapter(api)

  it('should not render the services link when there\'s no active game', () => {
    render(
      <RecoilRoot>
        <RecoilObserver node={activeGameState}>
          <NavBar />
        </RecoilObserver>
      </RecoilRoot>
      , { wrapper: MemoryRouter }
    )

    const list = screen.getAllByRole('list')[0]

    expect(within(list).getAllByRole('listitem')).toHaveLength(3)
    expect(within(list).getByText('Home')).toBeInTheDocument()
    expect(within(list).getByText('Account')).toBeInTheDocument()
    expect(within(list).getByText('Logout')).toBeInTheDocument()
  })

  it('should log users out', () => {
    axiosMock.onPost('http://talo.test/users/logout').replyOnce(200)

    render(
      <RecoilRoot>
        <RecoilObserver node={activeGameState}>
          <NavBar />
        </RecoilObserver>
      </RecoilRoot>
      , { wrapper: MemoryRouter }
    )

    const list = screen.getAllByRole('list')[0]

    userEvent.click(within(list).getByText('Logout'))

    expect(window.location.pathname).toBe(routes.login)
  })

  it('should reload after logging out even if there is an error', () => {
    axiosMock.onPost('http://talo.test/users/logout').networkErrorOnce()

    render(
      <RecoilRoot>
        <RecoilObserver node={activeGameState}>
          <NavBar />
        </RecoilObserver>
      </RecoilRoot>
      , { wrapper: MemoryRouter }
    )

    const list = screen.getAllByRole('list')[0]

    userEvent.click(within(list).getByText('Logout'))

    expect(window.location.pathname).toBe(routes.login)
  })

  it('should always render the services link if there\'s an active game', () => {
    const game = {
      id: 1,
      name: 'Superstatic'
    }

    const user = {
      organisation: {
        games: [
          game
        ]
      }
    }

    render(
      <RecoilRoot>
        <RecoilObserver node={userState} initialValue={user}>
          <RecoilObserver node={activeGameState} initialValue={game}>
            <NavBar />
          </RecoilObserver>
        </RecoilObserver>
      </RecoilRoot>
      , { wrapper: MemoryRouter }
    )

    const list = screen.getAllByRole('list')[0]

    expect(within(list).getByText('Services')).toBeInTheDocument()
  })

  it('should open and close the mobile menu', () => {
    render(
      <RecoilRoot>
        <RecoilObserver node={activeGameState}>
          <NavBar />
        </RecoilObserver>
      </RecoilRoot>
      , { wrapper: MemoryRouter }
    )

    userEvent.click(screen.getByLabelText('Navigation menu'))

    expect(screen.getByTestId('mobile-menu')).toHaveClass('translate-x-0')

    userEvent.click(screen.getByLabelText('Close navigation menu'))

    expect(screen.getByTestId('mobile-menu')).toHaveClass('-translate-x-full')
  })
})
