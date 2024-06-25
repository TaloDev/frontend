import { render, screen } from '@testing-library/react'
import KitchenSink from '../../utils/KitchenSink'
import userState from '../../state/userState'
import GlobalBanners from '../GlobalBanners'
import routes from '../../constants/routes'
import { ConfirmPasswordAction } from '../../pages/ConfirmPassword'
import { UserType } from '../../entities/user'

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

  it('should render the payment required banner when the plan status is not active', () => {
    const userValue = {
      type: UserType.OWNER,
      organisation: {
        pricingPlan: {
          status: 'incomplete'
        }
      }
    }

    render(
      <KitchenSink states={[ { node: userState, initialValue: userValue }]}>
        <GlobalBanners />
      </KitchenSink>
    )

    expect(screen.getByText('Please update your payment details to continue your current price plan')).toBeInTheDocument()
  })

  it('should not render the payment required banner when the plan status is active', () => {
    const userValue = {
      type: UserType.OWNER,
      organisation: {
        pricingPlan: {
          status: 'active'
        }
      }
    }

    render(
      <KitchenSink states={[ { node: userState, initialValue: userValue }]}>
        <GlobalBanners />
      </KitchenSink>
    )

    expect(screen.queryByText('Please update your payment details to continue your current price plan')).not.toBeInTheDocument()
  })
})
