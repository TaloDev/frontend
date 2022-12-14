import React from 'react'
import MockAdapter from 'axios-mock-adapter'
import api from '../../api/api'
import { render, screen, waitFor } from '@testing-library/react'
import KitchenSink from '../../utils/KitchenSink'
import ResetPassword from '../ResetPassword'
import userEvent from '@testing-library/user-event'
import routes from '../../constants/routes'

describe('<ResetPassword />', () => {
  const axiosMock = new MockAdapter(api)

  it('should render a success state', async () => {
    jest.spyOn(URLSearchParams.prototype, 'get').mockImplementation((key) => {
      if (key === 'token') return 'ey...'
      return null
    })

    axiosMock.onPost('/public/users/reset_password').replyOnce(204)

    const setLocationMock = jest.fn()

    render(
      <KitchenSink
        setLocation={setLocationMock}
        routePath={routes.forgotPassword}
        initialEntries={[routes.forgotPassword]}
      >
        <ResetPassword />
      </KitchenSink>
    )

    expect(screen.getByText('Confirm')).toBeDisabled()

    userEvent.type(screen.getByLabelText('Password'), 'password1')
    expect(screen.getByText('Confirm')).toBeDisabled()

    userEvent.type(screen.getByLabelText('Confirm password'), 'password')
    expect(screen.getByText('Confirm')).toBeDisabled()

    userEvent.type(screen.getByLabelText('Confirm password'), '1')

    await waitFor(() => {
      expect(screen.getByText('Confirm')).toBeEnabled()
    })
    userEvent.click(screen.getByText('Confirm'))

    expect(await screen.findByText('Success! Your password has been reset')).toBeInTheDocument()

    userEvent.click(screen.getByText('Go to Login'))

    await waitFor(() => {
      expect(setLocationMock).toHaveBeenLastCalledWith({ pathname: routes.login, state: null })
    })
  })

  it('should render errors', async () => {
    jest.spyOn(URLSearchParams.prototype, 'get').mockImplementation((key) => {
      if (key === 'token') return 'ey...'
      return null
    })

    axiosMock.onPost('/public/users/reset_password').networkErrorOnce()

    render(
      <KitchenSink>
        <ResetPassword />
      </KitchenSink>
    )

    expect(screen.getByText('Confirm')).toBeDisabled()

    userEvent.type(screen.getByLabelText('Password'), 'password1')
    userEvent.type(screen.getByLabelText('Confirm password'), 'password1')

    await waitFor(() => {
      expect(screen.getByText('Confirm')).toBeEnabled()
    })
    userEvent.click(screen.getByText('Confirm'))

    expect(await screen.findByText('Network Error')).toBeInTheDocument()
  })

  it('should render the expired hint', async () => {
    jest.spyOn(URLSearchParams.prototype, 'get').mockImplementation((key) => {
      if (key === 'token') return 'ey...'
      return null
    })

    axiosMock.onPost('/public/users/reset_password').replyOnce(400, { message: 'Expired', expired: true })

    render(
      <KitchenSink>
        <ResetPassword />
      </KitchenSink>
    )

    expect(screen.getByText('Confirm')).toBeDisabled()

    userEvent.type(screen.getByLabelText('Password'), 'password1')
    userEvent.type(screen.getByLabelText('Confirm password'), 'password1')

    await waitFor(() => {
      expect(screen.getByText('Confirm')).toBeEnabled()
    })
    userEvent.click(screen.getByText('Confirm'))

    expect(await screen.findByText('please request a new reset link')).toBeInTheDocument()
  })

  it('should redirect back to login if there is no token', async () => {
    jest.spyOn(URLSearchParams.prototype, 'get').mockImplementation(() => '')

    const setLocationMock = jest.fn()

    render(
      <KitchenSink
        setLocation={setLocationMock}
        routePath={routes.forgotPassword}
        initialEntries={[routes.forgotPassword]}
      >
        <ResetPassword />
      </KitchenSink>
    )

    await waitFor(() => {
      expect(setLocationMock).toHaveBeenLastCalledWith({ pathname: routes.login, state: null })
    })
  })
})
