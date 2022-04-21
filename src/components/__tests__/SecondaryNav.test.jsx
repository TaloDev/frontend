import React from 'react'
import { render, screen } from '@testing-library/react'
import { RecoilRoot } from 'recoil'
import RecoilObserver from '../../state/RecoilObserver'
import userState from '../../state/userState'
import userTypes from '../../constants/userTypes'
import SecondaryNav from '../SecondaryNav'
import routes from '../../constants/routes'
import { Route, MemoryRouter } from 'react-router-dom'

describe('<SecondaryNav />', () => {
  it('should filter out pages that the user cannot see', () => {
    render(
      <RecoilObserver node={userState} initialValue={{ type: userTypes.DEV }}>
        <MemoryRouter>
          <Route
            path='/'
            component={(props) => (
              <SecondaryNav
                {...props}
                routes={[
                  { title: 'Dashboard', to: routes.dashboard },
                  { title: 'Organisation', to: routes.organisation },
                  { title: 'Stats', to: routes.stats },
                  { title: 'Leaderboards', to: routes.leaderboards }
                ]}
              />
            )}
          />
        </MemoryRouter>
      </RecoilObserver>
      , { wrapper: RecoilRoot }
    )

    expect(screen.queryByText('Organisation')).not.toBeInTheDocument()
  })

  it('should not render if there are less than 2 routes', () => {
    render(
      <RecoilObserver node={userState} initialValue={{ type: userTypes.ADMIN }}>
        <MemoryRouter>
          <Route
            path='/'
            component={(props) => (
              <SecondaryNav
                {...props}
                routes={[
                  { title: 'Dashboard', to: routes.dashboard }
                ]}
              />
            )}
          />
        </MemoryRouter>
      </RecoilObserver>
      , { wrapper: RecoilRoot }
    )

    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
  })
})
