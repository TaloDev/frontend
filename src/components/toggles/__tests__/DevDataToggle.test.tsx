import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import KitchenSink from '../../../utils/KitchenSink'
import devDataState from '../../../state/devDataState'
import DevDataToggle from '../DevDataToggle'

describe('<DevDataToggle />', () => {
  it('should correctly toggle between states', async () => {
    const toggleMock = vi.fn()

    render(
      <KitchenSink states={[{ node: devDataState, initialValue: false, onChange: toggleMock }]}>
        <DevDataToggle />
      </KitchenSink>
    )

    await userEvent.click(screen.getByRole('checkbox'))
    await waitFor(() => expect(toggleMock).toHaveBeenLastCalledWith(true))

    await userEvent.click(screen.getByRole('checkbox'))
    await waitFor(() => expect(toggleMock).toHaveBeenLastCalledWith(false))
  })
})
