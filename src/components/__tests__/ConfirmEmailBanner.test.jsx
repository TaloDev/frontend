import React from 'react'
import api from '../../api/api'
import MockAdapter from 'axios-mock-adapter'
import { render, screen } from '@testing-library/react'
import ConfirmEmailBanner from '../ConfirmEmailBanner'
import RecoilObserver from '../../state/RecoilObserver'
import userState from '../../state/userState'
import userEvent from '@testing-library/user-event'
import { RecoilRoot } from 'recoil'

describe('<ConfirmEmailBanner />', () => {
  const axiosMock = new MockAdapter(api)
  axiosMock.onPost('http://talo.test/users/confirm_email').reply(200, { user: { emailConfirmed: true } })

  it('should render if the user hasn\'t confirmed their email', () => {
    render(
      <RecoilObserver node={userState} initialValue={{}}>
        <ConfirmEmailBanner />
      </RecoilObserver>
      , { wrapper: RecoilRoot }
    )

    expect(screen.getByText('Please confirm your email address')).toBeInTheDocument()
  })

  it('should show the success state on confirmation', async () => {
    render(
      <RecoilObserver
        node={userState}
        onChange={jest.fn()}
        initialValue={{}}
      >
        <ConfirmEmailBanner />
      </RecoilObserver>
      , { wrapper: RecoilRoot }
    )

    userEvent.type(screen.getByRole('textbox'), '123456')

    userEvent.click(screen.getByText('Confirm'))

    expect(await screen.findByText('Success!')).toBeInTheDocument()
  })

  it('should render errors', async () => {
    axiosMock.onPost('http://talo.test/users/confirm_email').networkError()

    render(
      <RecoilObserver node={userState} initialValue={{}}>
        <ConfirmEmailBanner />
      </RecoilObserver>
      , { wrapper: RecoilRoot }
    )

    userEvent.type(screen.getByRole('textbox'), '123456')

    userEvent.click(screen.getByText('Confirm'))

    expect(await screen.findByRole('alert')).toBeInTheDocument()
  })
})
