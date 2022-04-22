import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import userState from '../../state/userState'
import routes from '../../constants/routes'
import { ConfirmPasswordAction } from '../../pages/ConfirmPassword'
import api from '../../api/api'
import MockAdapter from 'axios-mock-adapter'
import Account2FA from '../Account2FA'
import KitchenSink from '../../utils/KitchenSink'

describe('<Account2FA />', () => {
  const axiosMock = new MockAdapter(api)

  it('should render the not enabled state', async () => {
    axiosMock.onGet('http://talo.test/users/2fa/enable').replyOnce(200, {
      qr: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAyKADAAQAAAABAAAAyAAAAACbWz2VAAAILklEQVR4Ae3a0Y4bRwxEUW+Q//9lR86TZ5EpeZjmgOo5frJENbt4yUIDxH79fP374R8CCPwngb/+81tfIoDAvwQYxCAgEAgwSIAjhACDmAEEAgEGCXCEEGAQM4BAIMAgAY4QAgxiBhAIBBgkwBFCgEHMAAKBAIMEOEII/H0VwdfX19Uj436f/vws1ZfOpSJTznQu3ZdypnPpvhRL96Vzk2IVLl6QSR2kZRwBBhnXEoImEWCQSd2gZRwBBhnXEoImEWCQSd2gZRwBBhnXEoImEbi85k3iK2u0lO//xDrWktWciUvKmWJVNiln0pnuq55LOauxVF8lpxekQs2ZxxBgkMe0WqEVAgxSoebMYwgwyGNardAKAQapUHPmMQQY5DGtVmiFwNI1bxKwev32666O9WI1Z6ovxRKzFKvqTDk7Yp9euxekYyrk3IYAg2zTSoV0EGCQDqpybkOAQbZppUI6CDBIB1U5tyHAINu0UiEdBG5b83aI/5Sc1ZVsWpGmWLovxT6F5506vSB30nbXxxFgkI9rGcF3EmCQO2m76+MIMMjHtYzgOwkwyJ203fVxBBjk41pG8J0ErHm/0U7r028//eOPKWdau6ZYyvnHwvzwLQEvyFtEfvBkAgzy5O6r/S0BBnmLyA+eTIBBntx9tb8lwCBvEfnBkwkwyJO7r/a3BG5b86aV5VuVQ35QreHJK9kqsyEt/+EFmdIJOkYSYJCRbSFqCgEGmdIJOkYSYJCRbSFqCgEGmdIJOkYSYJCRbSFqCoGla94nrzNT7WnVWT1XHaCO+1LOqs4p57wgUzpBx0gCDDKyLURNIcAgUzpBx0gCDDKyLURNIcAgUzpBx0gCDDKyLURNIXB5zZtWllOKmqbj7jVox31P7bsXZJqb6BlFgEFGtYOYaQQYZFpH6BlFgEFGtYOYaQQYZFpH6BlFgEFGtYOYaQQur3knrRCrWqoryx3uSzWkWMfgfkIfvCAdnZdzGwIMsk0rFdJBgEE6qMq5DQEG2aaVCukgwCAdVOXchgCDbNNKhXQQuLzmTSLS2q5jhZjuSzpTLOXsqCFpSbGqzuq5pCXFqvelc+m+1TEvyGqi8m1FgEG2aqdiVhNgkNVE5duKAINs1U7FrCbAIKuJyrcVAQbZqp2KWU1g6Zq3ugatnlsN41e+tF5MsaQl1Zdypli6b1Is1Z50pnOJSzqX7juLeUHOyPgegRcBBjEGCAQCDBLgCCHAIGYAgUCAQQIcIQQYxAwgEAgsXfOGe+L6NK3m0kov3VeNJS0pZ9KZYiln0nJ3zqQl1ZB0ppzpXPW+dO4s5gU5I+N7BF4EGMQYIBAIMEiAI4QAg5gBBAIBBglwhBBgEDOAQCCwdM2bVnPVlV7HucCjvI5OOVMN6Vw1Vu1Dx30pZ9KZzqVYYl25zwuSaIs9ngCDPH4EAEgEGCTREXs8AQZ5/AgAkAgwSKIj9ngCDPL4EQAgEfh6rb5+ph+siqX1W7qjQ17S0nFfqq9DS8qZtHTEOnhW66to8YJ0TIWc2xBgkG1aqZAOAgzSQVXObQgwyDatVEgHAQbpoCrnNgQYZJtWKqSDwOW/5q2u2JL4yvrtV74OLR05J9WX+pBi1RpSzirrpKWa80ynF+SMjO8ReBFgEGOAQCDAIAGOEAIMYgYQCAQYJMARQoBBzAACgcD4v+YN2mMorQLTwbQm7MiZtKT7qjrTuQ4tKWeKpdrTudUxL8hqovJtRYBBtmqnYlYTYJDVROXbigCDbNVOxawmwCCricq3FQEG2aqdillNYMRf86ai0rovrSxTLOVMWlKs476UM2npiHVoqfYhaanmPGPmBTkj43sEXgQYxBggEAgwSIAjhACDmAEEAgEGCXCEEGAQM4BAIHB5zbt6jRa0vQ3R8hbRpR908Ewr2Uvifvtx0pnuS+d+S3/4rxfkgMMHBI4EGOTIwycEDgQY5IDDBwSOBBjkyMMnBA4EGOSAwwcEjgQY5MjDJwQOBC6vedMa7ZB58Ie07kuxVHvHuZTzbrzV2u/Wufo+L8hqovJtRYBBtmqnYlYTYJDVROXbigCDbNVOxawmwCCricq3FQEG2aqdillN4PKaNwn4lLVkqiGtM9O5FKtySVpSznQu6UyxdF861xHrqO9MpxfkjIzvEXgRYBBjgEAgwCABjhACDGIGEAgEGCTAEUKAQcwAAoHA0jVvuOdHx2quY/WYclZrqJ5LPDtin6Kzo/aznF6QMzK+R+BFgEGMAQKBAIMEOEIIMIgZQCAQYJAARwgBBjEDCAQCt615g4btQ9XVcTpXhZZypjVvOpe0pJwd56o6z7R4Qc7I+B6BFwEGMQYIBAIMEuAIIcAgZgCBQIBBAhwhBBjEDCAQCFjzfoOT1pJphVg99+36w8eU8/DDCx9SzlRfuiLlrJ5LWtJ9KZZynun0gpyR8T0CLwIMYgwQCAQYJMARQoBBzAACgQCDBDhCCDCIGUAgELhtzVtZsQXd40KpvrR6TIVUc1bPJZ0pZ6ohxao5q+eSlrOYF+SMjO8ReBFgEGOAQCDAIAGOEAIMYgYQCAQYJMARQoBBzAACgcDSNW9aEwYNHxOq1lddS1bv6wCatHTUNyWnF6RjmuTchgCDbNNKhXQQYJAOqnJuQ4BBtmmlQjoIMEgHVTm3IcAg27RSIR0Evl7rtJ8dieVEYAcCXpAduqiGNgIM0oZW4h0IMMgOXVRDGwEGaUMr8Q4EGGSHLqqhjQCDtKGVeAcCDLJDF9XQRoBB2tBKvAMBBtmhi2poI8AgbWgl3oEAg+zQRTW0EWCQNrQS70DgH9ZzebqBcfvRAAAAAElFTkSuQmCC'
    })

    axiosMock.onPost('http://talo.test/users/2fa/enable').replyOnce(200, {
      user: {
        has2fa: true
      },
      recoveryCodes: ['abc123', 'efg456', 'hij789']
    })

    render(
      <KitchenSink states={[{ node: userState, initialValue: { has2fa: false } }]}>
        <Account2FA />
      </KitchenSink>
    )

    expect(screen.getByText('Enable 2FA')).toBeInTheDocument()

    userEvent.click(screen.getByText('Enable 2FA'))

    expect(await screen.findByAltText('Authenticator QR Code')).toBeInTheDocument()

    expect(screen.getByText('Confirm')).toBeDisabled()

    userEvent.type(screen.getByPlaceholderText('Enter your code'), '123456')

    expect(screen.getByText('Confirm')).toBeEnabled()

    userEvent.click(screen.getByText('Confirm'))

    expect(await screen.findByTestId('2fa-success')).toBeInTheDocument()

    expect(screen.getByText('Copy codes')).toBeInTheDocument()
  })

  it('should render enable 2fa errors', async () => {
    axiosMock.onGet('http://talo.test/users/2fa/enable').networkErrorOnce()

    render(
      <KitchenSink states={[{ node: userState, initialValue: { has2fa: false } }]}>
        <Account2FA />
      </KitchenSink>
    )

    expect(screen.getByText('Enable 2FA')).toBeInTheDocument()

    userEvent.click(screen.getByText('Enable 2FA'))

    expect(await screen.findByText('Network Error')).toBeInTheDocument()
  })

  it('should render confirm 2fa errors', async () => {
    axiosMock.onGet('http://talo.test/users/2fa/enable').replyOnce(200, {
      qr: 'data:image/png;base64,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'
    })

    axiosMock.onPost('http://talo.test/users/2fa/enable').networkErrorOnce()

    render(
      <KitchenSink states={[{ node: userState, initialValue: { has2fa: false } }]}>
        <Account2FA />
      </KitchenSink>
    )

    expect(screen.getByText('Enable 2FA')).toBeInTheDocument()

    userEvent.click(screen.getByText('Enable 2FA'))

    userEvent.type(await screen.findByPlaceholderText('Enter your code'), '123456')

    userEvent.click(screen.getByText('Confirm'))

    expect(await screen.findByText('Network Error')).toBeInTheDocument()
  })

  it('should render the enabled state', () => {
    render(
      <KitchenSink states={[{ node: userState, initialValue: { has2fa: true } }]}>
        <Account2FA />
      </KitchenSink>
    )

    expect(screen.getByText('Disable 2FA')).toBeInTheDocument()

    expect(screen.getByText('View recovery codes')).toBeInTheDocument()

    expect(screen.getByText('Create new recovery codes')).toBeInTheDocument()
  })

  it('should send the user to the confirm password screen when they click the disable 2fa button', () => {
    const setLocationMock = jest.fn()

    render(
      <KitchenSink
        states={[{ node: userState, initialValue: { has2fa: true } }]}
        setLocation={setLocationMock}
      >
        <Account2FA />
      </KitchenSink>
    )

    userEvent.click(screen.getByText('Disable 2FA'))

    expect(setLocationMock).toHaveBeenLastCalledWith({
      pathname: routes.confirmPassword,
      state: {
        onConfirmAction: ConfirmPasswordAction.DISABLE_2FA
      }
    })
  })

  it('should send the user to the confirm password screen when they click the view recovery codes button', () => {
    const setLocationMock = jest.fn()

    render(
      <KitchenSink
        states={[{ node: userState, initialValue: { has2fa: true } }]}
        setLocation={setLocationMock}
      >
        <Account2FA />
      </KitchenSink>
    )

    userEvent.click(screen.getByText('View recovery codes'))

    expect(setLocationMock).toHaveBeenLastCalledWith({
      pathname: routes.confirmPassword,
      state: {
        onConfirmAction: ConfirmPasswordAction.VIEW_RECOVERY_CODES
      }
    })
  })

  it('should send the user to the confirm password screen when they click the create recovery codes button', () => {
    const setLocationMock = jest.fn()

    render(
      <KitchenSink
        states={[{ node: userState, initialValue: { has2fa: true } }]}
        setLocation={setLocationMock}
      >
        <Account2FA />
      </KitchenSink>
    )

    userEvent.click(screen.getByText('Create new recovery codes'))

    expect(setLocationMock).toHaveBeenLastCalledWith({
      pathname: routes.confirmPassword,
      state: {
        onConfirmAction: ConfirmPasswordAction.CREATE_RECOVERY_CODES
      }
    })
  })

  it('should render recovery codes if found in the location state', () => {
    render(
      <KitchenSink
        initialEntries={[{
          state: {
            recoveryCodes: ['abc123', 'efg456', 'hij789']
          }
        }]}
        states={[
          { node: userState, initialValue: { has2fa: true } }
        ]}
      >
        <Account2FA />
      </KitchenSink>
    )

    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })
})
