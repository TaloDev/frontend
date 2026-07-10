import { convertDateToUTC } from '../convertDateToUTC'

// these use a America/Los_Angeles timezone, see vite.config.ts
describe('convertDateToUTC', () => {
  it('should return an empty string for an empty input', () => {
    expect(convertDateToUTC('')).toBe('')
  })

  // Local date strings come from date-fns `format()` and the date inputs, both
  // in the user's local timezone, so the UTC range must span that local day.
  // LA is PST (UTC-8) in February.
  it('should return the UTC instant of local start of day for a date string', () => {
    expect(convertDateToUTC('2026-02-23')).toBe('2026-02-23T08:00:00.000Z')
  })

  it('should return the UTC instant of local end of day when endOfDay is true', () => {
    expect(convertDateToUTC('2026-02-23', true)).toBe('2026-02-24T07:59:59.999Z')
  })

  it('should handle a date string with a time component', () => {
    expect(convertDateToUTC('2026-02-23T15:30:00')).toBe('2026-02-23T08:00:00.000Z')
  })

  // LA is PDT (UTC-7) in June. The point of this test: the UTC range must
  // match the user's local day, not a shifted UTC day.
  it('should produce local-day UTC boundaries across DST offsets', () => {
    expect(convertDateToUTC('2021-06-05')).toBe('2021-06-05T07:00:00.000Z')
    expect(convertDateToUTC('2021-06-12', true)).toBe('2021-06-13T06:59:59.999Z')
  })
})
