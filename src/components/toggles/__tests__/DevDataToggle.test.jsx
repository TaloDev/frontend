import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import KitchenSink from '../../../utils/KitchenSink'
import devDataState from '../../../state/devDataState'
import DevDataToggle from '../DevDataToggle'

describe('<DevDataToggle />', () => {
  it('should correctly toggle between states', async () => {
    const toggleMock = jest.fn()

    render(
      <KitchenSink states={[{ node: devDataState, initialValue: false, onChange: toggleMock }]}>
        <DevDataToggle />
      </KitchenSink>
    )

    userEvent.click(screen.getByRole('checkbox'))
    await waitFor(() => expect(toggleMock).toHaveBeenLastCalledWith(true))

    userEvent.click(screen.getByRole('checkbox'))
    await waitFor(() => expect(toggleMock).toHaveBeenLastCalledWith(false))
  })
})
