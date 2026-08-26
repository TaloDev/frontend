import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MockAdapter from 'axios-mock-adapter'
import api from '../../api/api'
import ToastProvider from '../../components/toast/ToastProvider'
import { User, UserType } from '../../entities/user'
import { userState } from '../../state/userState'
import KitchenSink from '../../utils/KitchenSink'
import Organisation from '../Organisation'

describe('<Organisation />', () => {
  const axiosMock = new MockAdapter(api)

  const baseUser: Partial<User> = {
    id: 1,
    email: 'me@talo.dev',
    username: 'me',
    emailConfirmed: true,
    has2fa: false,
    createdAt: '2021-01-01T00:00:00Z',
    organisation: {
      id: 1,
      name: 'Test Org',
      games: [],
      pricingPlan: { status: 'active' },
    },
  }

  const invite = {
    id: 5,
    email: 'them@talo.dev',
    organisation: {
      id: 1,
      name: 'Test Org',
      games: [],
      pricingPlan: { status: 'active' as const },
    },
    type: UserType.DEV,
    invitedBy: 'me',
    createdAt: '2021-01-01T00:00:00Z',
  }

  beforeEach(() => {
    axiosMock.reset()
  })

  const renderPage = (userOverrides: Partial<User>) => {
    axiosMock.onGet('http://talo.api/organisations/current').replyOnce(200, {
      games: [],
      members: [],
      pendingInvites: [invite],
    })

    return render(
      <KitchenSink states={[{ node: userState, initialValue: { ...baseUser, ...userOverrides } }]}>
        <ToastProvider>
          <Organisation />
        </ToastProvider>
      </KitchenSink>,
    )
  }

  it('renders a resend button for pending invites as an admin', async () => {
    renderPage({ type: UserType.ADMIN })

    expect(await screen.findByText('them@talo.dev')).toBeInTheDocument()
    expect(screen.getByText('Resend')).toBeInTheDocument()
  })

  it('hides the resend button for devs', async () => {
    renderPage({ type: UserType.DEV })

    expect(await screen.findByText('them@talo.dev')).toBeInTheDocument()
    expect(screen.queryByText('Resend')).not.toBeInTheDocument()
  })

  it('resends an invite', async () => {
    renderPage({ type: UserType.ADMIN })

    await screen.findByText('them@talo.dev')
    axiosMock.onPost('http://talo.api/invites/5/resend').replyOnce(200, { invite })

    await userEvent.click(screen.getByText('Resend'))

    await waitFor(() => {
      expect(axiosMock.history.post.length).toBe(1)
    })
    expect(axiosMock.history.post[0].url).toBe('/invites/5/resend')
    expect(await screen.findByText('Invite resent')).toBeInTheDocument()
  })

  it('shows the rate limit error from the backend', async () => {
    renderPage({ type: UserType.ADMIN })

    await screen.findByText('them@talo.dev')
    axiosMock
      .onPost('http://talo.api/invites/5/resend')
      .replyOnce(429, { message: 'Invites can only be resent once every 60 seconds' })

    await userEvent.click(screen.getByText('Resend'))

    expect(
      await screen.findByText('Invites can only be resent once every 60 seconds'),
    ).toBeInTheDocument()
  })
})
