import { formatUTC } from '../formatUTC'

// these run with TZ=America/Los_Angeles, see vite.config.ts
describe('formatUTC', () => {
  it('renders a UTC midnight bucket as that UTC day, not the local day', () => {
    // 2026-07-12T00:00:00Z - in PDT this instant is 2026-07-11 17:00,
    // so local-time formatting would incorrectly show "11 Jul".
    expect(formatUTC(1783814400000, 'd MMM')).toBe('12 Jul')
  })

  it('renders a full weekday and date in UTC', () => {
    expect(formatUTC(1783814400000, 'EEEE dd MMM yyyy')).toBe('Sunday 12 Jul 2026')
  })

  it('accepts a Date instance', () => {
    expect(formatUTC(new Date(1783814400000), 'd MMM')).toBe('12 Jul')
  })

  it('accepts an ISO string', () => {
    expect(formatUTC('2026-07-12T00:00:00.000Z', 'd MMM')).toBe('12 Jul')
  })
})
