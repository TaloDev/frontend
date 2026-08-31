import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MockAdapter from 'axios-mock-adapter'
import api from '../../api/api'
import routes from '../../constants/routes'
import { UserType } from '../../entities/user'
import { userState } from '../../state/userState'
import KitchenSink from '../../utils/KitchenSink'
import Account from '../Account'
import ConfirmPassword, { ConfirmPasswordAction } from '../ConfirmPassword'

const user = {
  id: 1,
  email: 'dev@trytalo.com',
  username: 'dev',
  lastSeenAt: '2026-01-01T00:00:00Z',
  emailConfirmed: true,
  organisation: {
    pricingPlan: { status: 'active' },
  },
  type: UserType.OWNER,
  has2fa: true,
  createdAt: '2026-01-01T00:00:00Z',
}

describe('<Account />', () => {
  const axiosMock = new MockAdapter(api)

  beforeEach(() => {
    axiosMock.onGet('/billing/usage').reply(200, {
      usage: { limit: 100, used: 10 },
      breakdown: { live: 1, dev: 2, deleted: 0 },
    })
  })

  it('should open the delete account modal when the delete account button is clicked', async () => {
    render(
      <KitchenSink states={[{ node: userState, initialValue: user }]}>
        <Account />
      </KitchenSink>,
    )

    await userEvent.click(screen.getByRole('button', { name: 'Delete account' }))

    expect(
      screen.getByText(
        'Your account and organisation will be permanently deleted, along with all of your games and their data. ',
        { exact: false },
      ),
    ).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('should send the user to the confirm password screen when they confirm deletion', async () => {
    const setLocationMock = vi.fn()

    render(
      <KitchenSink states={[{ node: userState, initialValue: user }]} setLocation={setLocationMock}>
        <Account />
      </KitchenSink>,
    )

    await userEvent.click(screen.getByRole('button', { name: 'Delete account' }))
    await userEvent.click(screen.getByText('Delete'))

    await waitFor(() => {
      expect(setLocationMock).toHaveBeenLastCalledWith({
        pathname: routes.confirmPassword,
        state: {
          onConfirmAction: ConfirmPasswordAction.DELETE_ACCOUNT,
        },
      })
    })
  })

  it('should not mention the organisation for non-owners', async () => {
    render(
      <KitchenSink states={[{ node: userState, initialValue: { ...user, type: UserType.DEV } }]}>
        <Account />
      </KitchenSink>,
    )

    await userEvent.click(screen.getByRole('button', { name: 'Delete account' }))

    expect(
      screen.getByText('Your account and all associated data will be permanently deleted. ', {
        exact: false,
      }),
    ).toBeInTheDocument()
  })
})

describe('<ConfirmPassword /> delete account', () => {
  const axiosMock = new MockAdapter(api)

  it('should delete the account and redirect to login', async () => {
    axiosMock.onPost('/users/delete').replyOnce(204)

    render(
      <KitchenSink
        initialEntries={[
          {
            pathname: routes.confirmPassword,
            state: { onConfirmAction: ConfirmPasswordAction.DELETE_ACCOUNT },
          },
        ]}
        routePath={routes.confirmPassword}
      >
        <ConfirmPassword />
      </KitchenSink>,
    )

    await userEvent.type(screen.getByLabelText('Password'), 'password')

    await userEvent.click(screen.getByText('Confirm'))

    await waitFor(() => {
      expect(axiosMock.history.post[0].url).toBe('/users/delete')
      expect(JSON.parse(axiosMock.history.post[0].data)).toEqual({ password: 'password' })
    })

    await waitFor(() => {
      expect(window.location.pathname).toBe(routes.login)
    })
  })

  it('should render errors', async () => {
    axiosMock.onPost('/users/delete').replyOnce(403, { message: 'Incorrect password' })

    render(
      <KitchenSink
        initialEntries={[
          {
            pathname: routes.confirmPassword,
            state: { onConfirmAction: ConfirmPasswordAction.DELETE_ACCOUNT },
          },
        ]}
        routePath={routes.confirmPassword}
      >
        <ConfirmPassword />
      </KitchenSink>,
    )

    await userEvent.type(screen.getByLabelText('Password'), 'wrong')

    await userEvent.click(screen.getByText('Confirm'))

    expect(await screen.findByText('Incorrect password')).toBeInTheDocument()
  })
})
