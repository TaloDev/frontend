import { render, screen } from '@testing-library/react'
import userState from '../../state/userState'
import SecondaryNav from '../SecondaryNav'
import routes from '../../constants/routes'
import KitchenSink from '../../utils/KitchenSink'
import { UserType } from '../../entities/user'

describe('<SecondaryNav />', () => {
  it('should filter out pages that the user cannot see', () => {
    render(
      <KitchenSink states={[{ node: userState, initialValue: { type: UserType.DEV } }]}>
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
      <KitchenSink states={[{ node: userState, initialValue: { type: UserType.ADMIN } }]}>
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
