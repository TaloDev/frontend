import React from 'react'
import { render, screen } from '@testing-library/react'
import userState from '../../state/userState'
import userTypes from '../../constants/userTypes'
import SecondaryNav from '../SecondaryNav'
import routes from '../../constants/routes'
import KitchenSink from '../../utils/KitchenSink'

describe('<SecondaryNav />', () => {
  it('should filter out pages that the user cannot see', () => {
    render(
      <KitchenSink states={[{ node: userState, initialValue: { type: userTypes.DEV } }]}>
        <SecondaryNav
          routes={[
            { title: 'Dashboard', to: routes.dashboard },
            { title: 'Organisation', to: routes.organisation },
            { title: 'Stats', to: routes.stats },
            { title: 'Leaderboards', to: routes.leaderboards }
          ]}
        />
      </KitchenSink>
    )

    expect(screen.queryByText('Organisation')).not.toBeInTheDocument()
  })

  it('should not render if there are less than 2 routes', () => {
    render(
      <KitchenSink states={[{ node: userState, initialValue: { type: userTypes.ADMIN } }]}>
        <SecondaryNav
          routes={[
            { title: 'Dashboard', to: routes.dashboard }
          ]}
        />
      </KitchenSink>
    )

    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
  })
})
