import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MockAdapter from 'axios-mock-adapter'
import api from '../../api/api'
import userState from '../../state/userState'
import KitchenSink from '../../utils/KitchenSink'
import ConfirmEmailBanner from '../ConfirmEmailBanner'
import Link from '../Link'

describe('<ConfirmEmailBanner />', () => {
  const axiosMock = new MockAdapter(api)
  axiosMock
    .onPost('http://talo.api/users/confirm_email')
    .reply(200, { user: { emailConfirmed: true } })

  it("should render if the user hasn't confirmed their email", () => {
    render(
      <KitchenSink states={[{ node: userState, initialValue: {} }]}>
        <ConfirmEmailBanner />
      </KitchenSink>,
    )

    expect(screen.getByText('Please confirm your email address')).toBeInTheDocument()
  })

  it('should show the success state on confirmation and disappear on navigating away', async () => {
    render(
      <KitchenSink states={[{ node: userState, initialValue: {}, onChange: vi.fn() }]}>
        <Link to='/'>Navigate away</Link>
        <ConfirmEmailBanner />
      </KitchenSink>,
    )

    const { type, click } = userEvent.setup()
    await type(screen.getByRole('textbox'), '123456')
    await click(screen.getByText('Confirm'))

    expect(await screen.findByText('Success!')).toBeInTheDocument()

    await click(screen.getByText('Navigate away'))

    expect(screen.queryByText('Success!')).not.toBeInTheDocument()
  })

  it('should render errors', async () => {
    axiosMock.onPost('http://talo.api/users/confirm_email').networkError()

    render(
      <KitchenSink states={[{ node: userState, initialValue: {} }]}>
        <ConfirmEmailBanner />
      </KitchenSink>,
    )

    const { type, click } = userEvent.setup()
    await type(screen.getByRole('textbox'), '123456')
    await click(screen.getByText('Confirm'))

    expect(await screen.findByText('Network Error')).toBeInTheDocument()
  })
})
