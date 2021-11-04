import React from 'react'
import { render, screen, within, waitFor } from '@testing-library/react'
import api from '../../api/api'
import MockAdapter from 'axios-mock-adapter'
import NavBar from '../NavBar'
import RecoilObserver from '../../state/RecoilObserver'
import activeGameState from '../../state/activeGameState'
import { RecoilRoot } from 'recoil'
import { BrowserRouter } from 'react-router-dom'
import userState from '../../state/userState'
import userEvent from '@testing-library/user-event'

describe('<NavBar />', () => {
  const axiosMock = new MockAdapter(api)

  it('should only show the home and logout links when there\'s no active game', () => {
    render(
      <RecoilRoot>
        <RecoilObserver node={activeGameState}>
          <NavBar />
        </RecoilObserver>
      </RecoilRoot>
      , { wrapper: BrowserRouter }
    )

    const list = screen.getAllByRole('list')[0]

    expect(within(list).getAllByRole('listitem')).toHaveLength(2)
    expect(within(list).getByText('Home')).toBeInTheDocument()
    expect(within(list).getByText('Logout')).toBeInTheDocument()
  })

  it('should log users out', async () => {
    const reloadMock = jest.fn()

    const { location } = window
    delete window.location
    window.location = { reload: reloadMock }

    axiosMock.onPost('http://talo.test/users/logout').replyOnce(200)

    render(
      <RecoilRoot>
        <RecoilObserver node={activeGameState}>
          <NavBar />
        </RecoilObserver>
      </RecoilRoot>
      , { wrapper: BrowserRouter }
    )

    const list = screen.getAllByRole('list')[0]

    userEvent.click(within(list).getByText('Logout'))

    await waitFor(() => expect(reloadMock).toHaveBeenCalled())

    window.location = location
  })

  it('should reload after logging out even if there is an error', async () => {
    const reloadMock = jest.fn()

    const { location } = window
    delete window.location
    window.location = { reload: reloadMock }

    axiosMock.onPost('http://talo.test/users/logout').networkErrorOnce()

    render(
      <RecoilRoot>
        <RecoilObserver node={activeGameState}>
          <NavBar />
        </RecoilObserver>
      </RecoilRoot>
      , { wrapper: BrowserRouter }
    )

    const list = screen.getAllByRole('list')[0]

    userEvent.click(within(list).getByText('Logout'))

    await waitFor(() => expect(reloadMock).toHaveBeenCalled())

    window.location = location
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
      , { wrapper: BrowserRouter }
    )

    const list = screen.getAllByRole('list')[0]

    expect(within(list).getByText('Services')).toBeInTheDocument()
  })

  it('should always render the access keys item if the user is an admin', () => {
    const game = {
      id: 1,
      name: 'Superstatic'
    }

    const user = {
      type: 1,
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
      , { wrapper: BrowserRouter }
    )

    const list = screen.getAllByRole('list')[0]

    expect(within(list).getByText('Access keys')).toBeInTheDocument()
  })

  it('should open and close the mobile menu', () => {
    render(
      <RecoilRoot>
        <RecoilObserver node={activeGameState}>
          <NavBar />
        </RecoilObserver>
      </RecoilRoot>
      , { wrapper: BrowserRouter }
    )

    userEvent.click(screen.getByLabelText('Navigation menu'))

    expect(screen.getByTestId('mobile-menu')).toHaveClass('translate-x-0')

    userEvent.click(screen.getByLabelText('Close navigation menu'))

    expect(screen.getByTestId('mobile-menu')).toHaveClass('-translate-x-full')
  })
})
