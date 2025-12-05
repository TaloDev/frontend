import { renderHook } from '@testing-library/react'
import useTimePeriod from '../useTimePeriod'

describe('useTimePeriod', () => {
  beforeEach(() => {
    vi.setSystemTime(new Date(2021, 5, 12))
  })

  it('should return empty dates with no time period', () => {
    const { result } = renderHook(() => useTimePeriod(null))
    expect(result.current.startDate).toBe('')
    expect(result.current.endDate).toBe('')
  })

  it('should return the correct dates for today', () => {
    const { result } = renderHook(() => useTimePeriod('1d'))
    expect(result.current.startDate).toBe('2021-06-12')
    expect(result.current.endDate).toBe('2021-06-12')
  })

  it('should return the correct dates for the last 7 days', () => {
    const { result } = renderHook(() => useTimePeriod('7d'))
    expect(result.current.startDate).toBe('2021-06-05')
    expect(result.current.endDate).toBe('2021-06-12')
  })

  it('should return the correct dates for the last 30 days', () => {
    const { result } = renderHook(() => useTimePeriod('30d'))
    expect(result.current.startDate).toBe('2021-05-13')
    expect(result.current.endDate).toBe('2021-06-12')
  })

  it('should use the previous week as the start date if today is the start of the week', () => {
    vi.setSystemTime(new Date(2021, 5, 20))

    const { result } = renderHook(() => useTimePeriod('w'))
    expect(result.current.startDate).toBe('2021-06-13')
    expect(result.current.endDate).toBe('2021-06-20')
  })

  it('should use the current week as the start date if today is not the start of the week', () => {
    const { result } = renderHook(() => useTimePeriod('w'))
    expect(result.current.startDate).toBe('2021-06-06')
    expect(result.current.endDate).toBe('2021-06-12')
  })

  it('should return the correct dates for the last month', () => {
    const { result } = renderHook(() => useTimePeriod('m'))
    expect(result.current.startDate).toBe('2021-06-01')
    expect(result.current.endDate).toBe('2021-06-12')
  })

  it('should return the correct dates for the last year', () => {
    const { result } = renderHook(() => useTimePeriod('y'))
    expect(result.current.startDate).toBe('2021-01-01')
    expect(result.current.endDate).toBe('2021-06-12')
  })
})
