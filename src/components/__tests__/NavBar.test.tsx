import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MockAdapter from 'axios-mock-adapter'
import api from '../../api/api'
import routes from '../../constants/routes'
import activeGameState from '../../state/activeGameState'
import userState from '../../state/userState'
import KitchenSink from '../../utils/KitchenSink'
import NavBar from '../NavBar'

describe('<NavBar />', () => {
  const axiosMock = new MockAdapter(api)

  it("should not render the services link when there's no active game", () => {
    render(
      <KitchenSink states={[{ node: activeGameState }]}>
        <NavBar />
      </KitchenSink>,
    )

    const list = screen.getAllByRole('list')[0]

    expect(within(list).getAllByRole('listitem')).toHaveLength(3)
    expect(within(list).getByText('Home')).toBeInTheDocument()
    expect(within(list).getByText('Account')).toBeInTheDocument()
    expect(within(list).getByText('Logout')).toBeInTheDocument()
  })

  it('should log users out', async () => {
    axiosMock.onPost('http://talo.api/users/logout').replyOnce(200)

    render(
      <KitchenSink states={[{ node: activeGameState }]}>
        <NavBar />
      </KitchenSink>,
    )

    const list = screen.getAllByRole('list')[0]

    await userEvent.click(within(list).getByText('Logout'))

    expect(window.location.pathname).toBe(routes.login)
  })

  it('should reload after logging out even if there is an error', async () => {
    axiosMock.onPost('http://talo.api/users/logout').networkErrorOnce()

    render(
      <KitchenSink states={[{ node: activeGameState }]}>
        <NavBar />
      </KitchenSink>,
    )

    const list = screen.getAllByRole('list')[0]

    await userEvent.click(within(list).getByText('Logout'))

    expect(window.location.pathname).toBe(routes.login)
  })

  it("should always render the services link if there's an active game", () => {
    const game = {
      id: 1,
      name: 'Superstatic',
    }

    const user = {
      organisation: {
        games: [game],
      },
    }

    render(
      <KitchenSink
        states={[
          { node: userState, initialValue: user },
          { node: activeGameState, initialValue: game },
        ]}
      >
        <NavBar />
      </KitchenSink>,
    )

    const list = screen.getAllByRole('list')[0]

    expect(within(list).getByText('Services')).toBeInTheDocument()
  })

  it('should open and close the mobile menu', async () => {
    render(
      <KitchenSink states={[{ node: activeGameState }]}>
        <NavBar />
      </KitchenSink>,
    )

    await userEvent.click(screen.getByLabelText('Navigation menu'))

    expect(screen.getByTestId('mobile-menu')).toHaveClass('translate-x-0')

    await userEvent.click(screen.getByLabelText('Close navigation menu'))

    expect(screen.getByTestId('mobile-menu')).toHaveClass('-translate-x-full')
  })
})
