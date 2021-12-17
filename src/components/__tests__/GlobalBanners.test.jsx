import { render, screen } from '@testing-library/react'
import React from 'react'
import { Router, MemoryRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import RecoilObserver from '../../state/RecoilObserver'
import userState from '../../state/userState'
import GlobalBanners from '../GlobalBanners'
import { createMemoryHistory } from 'history'
import routes from '../../constants/routes'
import { ConfirmPasswordAction } from '../../pages/ConfirmPassword'

describe('<GlobalBanners />', () => {
  it('should render on allowed pages', () => {
    render(
      <RecoilRoot>
        <RecoilObserver node={userState} initialValue={{ emailConfirmed: false }}>
          <GlobalBanners />
        </RecoilObserver>
      </RecoilRoot>
      , { wrapper: MemoryRouter })

    expect(screen.getByText('Please confirm your email address')).toBeInTheDocument()
  })

  it('should not render on blocked pages', () => {
    const history = createMemoryHistory()
    history.push(routes.confirmPassword, { onConfirmAction: ConfirmPasswordAction.CHANGE_PASSWORD })

    render(
      <Router history={history}>
        <RecoilRoot>
          <RecoilObserver node={userState} initialValue={{ emailConfirmed: false }}>
            <GlobalBanners />
          </RecoilObserver>
        </RecoilRoot>
      </Router>
    )

    expect(screen.queryByText('Please confirm your email address')).not.toBeInTheDocument()
  })
})
