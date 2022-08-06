import React from 'react'
import { render, screen } from '@testing-library/react'
import routes from '../../constants/routes'
import KitchenSink from '../../utils/KitchenSink'
import Link from '../Link'

describe('<Link />', () => {
  it('should render an internal router link', () => {
    render(
      <KitchenSink>
        <Link to={routes.account}>Go to Account</Link>
      </KitchenSink>
    )

    expect(screen.getByRole('link')).toBeInTheDocument()
  })

  it('should render an external link', () => {
    render(
      <KitchenSink>
        <Link to='https://talo.test/docs'>See the docs</Link>
      </KitchenSink>
    )

    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('rel', 'noreferrer')
  })
})
