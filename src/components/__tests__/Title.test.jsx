import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import KitchenSink from '../../utils/KitchenSink'
import Title from '../Title'

describe('<Title />', () => {
  it('should go back', async  () => {
    const setLocationMock = jest.fn()

    render(
      <KitchenSink initialEntries={['/players', '/']} setLocation={setLocationMock}>
        <Title showBackButton>Player Props</Title>
      </KitchenSink>
    )

    expect(screen.getByText('Player Props')).toBeInTheDocument()

    userEvent.click(screen.getByLabelText('Go back'))

    await waitFor(() => {
      expect(setLocationMock).toHaveBeenCalledWith({
        pathname: '/players',
        state: null
      })
    })
  })
})
