import React from 'react'
import { render, screen } from '@testing-library/react'
import KitchenSink from '../../utils/KitchenSink'
import userState from '../../state/userState'
import GlobalBanners from '../GlobalBanners'
import routes from '../../constants/routes'
import { ConfirmPasswordAction } from '../../pages/ConfirmPassword'

describe('<GlobalBanners />', () => {
  it('should render on allowed pages', () => {
    render(
      <KitchenSink states={[{ node: userState, initialValue: { emailConfirmed: false } }]}>
        <GlobalBanners />
      </KitchenSink>
    )

    expect(screen.getByText('Please confirm your email address')).toBeInTheDocument()
  })

  it('should not render on blocked pages', () => {
    render(
      <KitchenSink
        states={[{ node: userState, initialValue: { emailConfirmed: false } }]}
        initialEntries={[{ pathname: routes.confirmPassword, state: { onConfirmAction: ConfirmPasswordAction.CHANGE_PASSWORD } }]}
      >
        <GlobalBanners />
      </KitchenSink>
    )

    expect(screen.queryByText('Please confirm your email address')).not.toBeInTheDocument()
  })
})
