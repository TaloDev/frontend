import React from 'react'
import { render, screen } from '@testing-library/react'
import RegisterPlanBanner from '../RegisterPlanBanner'

describe('<RegisterPlanBanner />', () => {
  it('should not render anything if there is no plan query param', () => {
    delete window.location
    window.location = { search: '' }

    render(<RegisterPlanBanner />)

    expect(screen.queryByTestId('alert-banner')).not.toBeInTheDocument()
  })

  it('should not render anything if the plan is the free (indie) plan', () => {
    delete window.location
    window.location = { search: '?plan=indie' }

    render(<RegisterPlanBanner />)

    expect(screen.queryByTestId('alert-banner')).not.toBeInTheDocument()
  })

  it('should render enterprise plan copy if the plan is enterprise', () => {
    delete window.location
    window.location = { search: '?plan=enterprise' }

    render(<RegisterPlanBanner />)

    expect(screen.getByText(/To learn more about/)).toBeInTheDocument()
    expect(screen.getByText(/Enterprise Plan/)).toBeInTheDocument()
  })

  it('should render enterprise any other plan copy if the plan is not enterprise', () => {
    delete window.location
    window.location = { search: '?plan=team' }

    render(<RegisterPlanBanner />)

    expect(screen.getByText(/To upgrade to the/)).toBeInTheDocument()
    expect(screen.getByText(/Team Plan/)).toBeInTheDocument()
  })
})
