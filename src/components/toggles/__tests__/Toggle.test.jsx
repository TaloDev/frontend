import React, { useEffect, useState } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Toggle from '../Toggle'

describe('<Toggle />', () => {
  // eslint-disable-next-line react/prop-types
  function ToggleDummy({ toggleMock }) {
    const [enabled, setEnabled] = useState(false)

    useEffect(() => toggleMock(enabled), [enabled])

    return (
      <Toggle id='test' enabled={enabled} onToggle={setEnabled} />
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
})
