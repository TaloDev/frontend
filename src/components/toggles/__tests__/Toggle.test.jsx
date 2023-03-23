import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Toggle from '../Toggle'

describe('<Toggle />', () => {
  it('should correctly toggle between states', async () => {
    const toggleMock = vi.fn()
    render(<Toggle id='test' enabled={false} onToggle={toggleMock} />)

    const { click } = userEvent.setup()
    await click(screen.getByRole('checkbox'))
    await waitFor(() => expect(toggleMock).toHaveBeenLastCalledWith(true))

    await click(screen.getByRole('checkbox'))
    await waitFor(() => expect(toggleMock).toHaveBeenLastCalledWith(false))
  })

  it('should correctly render the disabled state', () => {
    render(<Toggle id='test' enabled={false} disabled={true} onToggle={vi.fn()} />)

    expect(screen.getByRole('checkbox')).toBeDisabled()
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('should correctly render a toggled disabled state', async () => {
    render(<Toggle id='test' enabled={true} disabled={true} onToggle={vi.fn()} />)

    expect(screen.getByRole('checkbox')).toBeDisabled()
    await waitFor(() => expect(screen.getByRole('checkbox')).toBeChecked())
  })
})
