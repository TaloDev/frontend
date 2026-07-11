import { render, screen } from '@testing-library/react'
import DateInput from '../DateInput'

// Runs under TZ=America/Los_Angeles (see vite.config.ts). The bug was that
// `new Date('2026-07-10')` parses as UTC midnight = 5pm the previous day
// local, so the input showed the wrong day in non-UTC zones.
describe('<DateInput /> (tz)', () => {
  it('should render date-only strings in the local timezone', () => {
    render(<DateInput id='test' value='2026-07-10' />)

    expect(screen.getByDisplayValue('10 Jul 2026')).toBeInTheDocument()
  })
})
