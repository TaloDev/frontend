import { convertDateToUTC } from '../convertDateToUTC'

// these use a America/Los_Angeles timezone, see vite.config.ts
describe('convertDateToUTC', () => {
  it('should return an empty string for an empty input', () => {
    expect(convertDateToUTC('')).toBe('')
  })

  it('should return UTC start of day for a date string', () => {
    expect(convertDateToUTC('2026-02-23')).toBe('2026-02-23T00:00:00.000Z')
  })

  it('should return UTC end of day when endOfDay is true', () => {
    expect(convertDateToUTC('2026-02-23', true)).toBe('2026-02-23T23:59:59.999Z')
  })

  it('should handle a date string with a time component', () => {
    expect(convertDateToUTC('2026-02-23T15:30:00')).toBe('2026-02-23T00:00:00.000Z')
  })

  // Simulates a UTC-8 user picking the 7d filter: useTimePeriod produces local
  // calendar date strings ("2021-06-05", "2021-06-12") which convertDateToUTC
  // must treat as UTC day boundaries, not local time shifted by the offset.
  it('should produce UTC day boundaries from date strings regardless of local timezone', () => {
    expect(convertDateToUTC('2021-06-05')).toBe('2021-06-05T00:00:00.000Z')
    expect(convertDateToUTC('2021-06-12', true)).toBe('2021-06-12T23:59:59.999Z')
  })
})
