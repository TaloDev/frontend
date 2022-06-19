import React from 'react'
import api from '../../api/api'
import MockAdapter from 'axios-mock-adapter'
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import ConfirmEmailBanner from '../ConfirmEmailBanner'
import userState from '../../state/userState'
import userEvent from '@testing-library/user-event'
import KitchenSink from '../../utils/KitchenSink'
import Link from '../Link'

describe('<ConfirmEmailBanner />', () => {
  const axiosMock = new MockAdapter(api)
  axiosMock.onPost('http://talo.test/users/confirm_email').reply(200, { user: { emailConfirmed: true } })

  it('should render if the user hasn\'t confirmed their email', () => {
    render(
      <KitchenSink states={[{ node: userState, initialValue: {} }]}>
        <ConfirmEmailBanner />
      </KitchenSink>
    )

    expect(screen.getByText('Please confirm your email address')).toBeInTheDocument()
  })

  it('should show the success state on confirmation and disappear on navigating away', async () => {
    render(
      <KitchenSink states={[{ node: userState, initialValue: {}, onChange: jest.fn() }]}>
        <>
          <Link to='/'>Navigate away</Link>
          <ConfirmEmailBanner />
        </>
      </KitchenSink>
    )

    userEvent.type(screen.getByRole('textbox'), '123456')

    userEvent.click(screen.getByText('Confirm'))

    expect(await screen.findByText('Success!')).toBeInTheDocument()

    userEvent.click(screen.getByText('Navigate away'))

    await waitForElementToBeRemoved(screen.getByText('Success!'))
  })

  it('should render errors', async () => {
    axiosMock.onPost('http://talo.test/users/confirm_email').networkError()

    render(
      <KitchenSink states={[{ node: userState, initialValue: {} }]}>
        <ConfirmEmailBanner />
      </KitchenSink>
    )

    userEvent.type(screen.getByRole('textbox'), '123456')

    userEvent.click(screen.getByText('Confirm'))

    expect(await screen.findByRole('alert')).toBeInTheDocument()
  })
})
