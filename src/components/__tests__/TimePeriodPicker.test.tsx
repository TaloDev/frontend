import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TimePeriodPicker, { LabelledTimePeriod } from '../TimePeriodPicker'

describe('<TimePeriodPicker />', () => {
  it('should render time periods', () => {
    const periods: LabelledTimePeriod[] = [{ id: '30d', label: '30 days' }, { id: '7d', label: '7 days' }]
    render(<TimePeriodPicker periods={periods} onPick={vi.fn()} selectedPeriod='30d' />)

    expect(screen.getAllByRole('button')).toHaveLength(2)

    for (const period of periods) {
      expect(screen.getByText(period.label)).toBeInTheDocument()
    }
  })

  it('should pick the correct time periods', async () => {
    const pickMock = vi.fn()
    const periods: LabelledTimePeriod[] = [{ id: '30d', label: '30 days' }, { id: '7d', label: '7 days' }]
    render(<TimePeriodPicker periods={periods} onPick={pickMock} selectedPeriod='30d' />)

    await userEvent.click(screen.getByText(periods[1].label))

    expect(pickMock).toHaveBeenCalledWith(periods[1])
  })
})
