import React, { useEffect, useState } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Toggle from '../Toggle'

describe('<Toggle />', () => {
  // eslint-disable-next-line react/prop-types
  function ToggleDummy({ toggleMock, enabled, ...otherProps }) {
    const [isEnabled, setEnabled] = useState(enabled ?? false)

    useEffect(() => toggleMock(isEnabled), [isEnabled])

    return (
      <Toggle id='test' enabled={isEnabled} onToggle={setEnabled} {...otherProps} />
    )
  }

  it('should correctly toggle between states', async () => {
    const toggleMock = jest.fn()

    render(<ToggleDummy toggleMock={toggleMock} />)

    userEvent.click(screen.getByRole('checkbox'))
    await waitFor(() => expect(toggleMock).toHaveBeenLastCalledWith(true))

    userEvent.click(screen.getByRole('checkbox'))
    await waitFor(() => expect(toggleMock).toHaveBeenLastCalledWith(false))
  })

  it('should correctly render the disabled state', () => {
    render(<ToggleDummy toggleMock={jest.fn()} disabled={true} />)
    expect(screen.getByRole('checkbox')).toBeDisabled()
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('should correctly render a toggled disabled state', async () => {
    render(<ToggleDummy toggleMock={jest.fn()} enabled={true} disabled={true} />)
    expect(screen.getByRole('checkbox')).toBeDisabled()
    await waitFor(() => expect(screen.getByRole('checkbox')).toBeChecked())
  })
})
