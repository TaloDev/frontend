import React from 'react'
import MockAdapter from 'axios-mock-adapter'
import api from '../../api/api'
import { render, screen, waitFor } from '@testing-library/react'
import KitchenSink from '../../utils/KitchenSink'
import ForgotPassword from '../ForgotPassword'
import userEvent from '@testing-library/user-event'

describe('<ForgotPassword />', () => {
  const axiosMock = new MockAdapter(api)

  it('should render a success state', async () => {
    axiosMock.onPost('/public/users/forgot_password').replyOnce(204)

    render(
      <KitchenSink>
        <ForgotPassword />
      </KitchenSink>
    )

    expect(screen.getByText('Confirm')).toBeDisabled()

    userEvent.type(screen.getByLabelText('Email'), 'dev@trytalo.com')

    await waitFor(() => {
      expect(screen.getByText('Confirm')).toBeEnabled()
    })
    userEvent.click(screen.getByText('Confirm'))

    expect(await screen.findByText('If an account exists for this email, you\'ll receive an email with instructions on how to reset your password')).toBeInTheDocument()

    expect(screen.getByText('Confirm')).toBeDisabled()
    expect(screen.getByDisplayValue('dev@trytalo.com')).toBeDisabled()
  })

  it('should render errors', async () => {
    axiosMock.onPost('/public/users/forgot_password').networkErrorOnce()

    render(
      <KitchenSink>
        <ForgotPassword />
      </KitchenSink>
    )

    expect(screen.getByText('Confirm')).toBeDisabled()

    userEvent.type(screen.getByLabelText('Email'), 'dev@trytalo.com')

    await waitFor(() => {
      expect(screen.getByText('Confirm')).toBeEnabled()
    })
    userEvent.click(screen.getByText('Confirm'))

    expect(await screen.findByText('Network Error')).toBeInTheDocument()

    expect(screen.getByText('Confirm')).toBeEnabled()
    expect(screen.getByDisplayValue('dev@trytalo.com')).toBeEnabled()
  })
})
