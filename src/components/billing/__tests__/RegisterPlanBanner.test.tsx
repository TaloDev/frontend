import { render, screen } from '@testing-library/react'
import RegisterPlanBanner from '../RegisterPlanBanner'

describe('<RegisterPlanBanner />', () => {
  it('should not render anything if there is no plan query param', () => {
    Object.defineProperty(window, 'location', {
      value: { search: '' },
    })

    render(<RegisterPlanBanner />)

    expect(screen.queryByTestId('alert-banner')).not.toBeInTheDocument()
  })

  it('should not render anything if the plan is the free (indie) plan', () => {
    Object.defineProperty(window, 'location', {
      value: { search: '?plan=indie' },
    })

    render(<RegisterPlanBanner />)

    expect(screen.queryByTestId('alert-banner')).not.toBeInTheDocument()
  })

  it('should render enterprise plan copy if the plan is enterprise', () => {
    Object.defineProperty(window, 'location', {
      value: { search: '?plan=enterprise' },
    })

    render(<RegisterPlanBanner />)

    expect(screen.getByText(/To learn more about/)).toBeInTheDocument()
    expect(screen.getByText(/Enterprise Plan/)).toBeInTheDocument()
  })

  it('should render enterprise any other plan copy if the plan is not enterprise', () => {
    Object.defineProperty(window, 'location', {
      value: { search: '?plan=team' },
    })

    render(<RegisterPlanBanner />)

    expect(screen.getByText(/To upgrade to the/)).toBeInTheDocument()
    expect(screen.getByText(/Team Plan/)).toBeInTheDocument()
  })
})
