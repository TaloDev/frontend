import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import routes from '../../constants/routes'
import { UserType } from '../../entities/user'
import userState from '../../state/userState'
import KitchenSink from '../../utils/KitchenSink'
import ServicesLink from '../ServicesLink'

describe('<ServicesLink />', () => {
  it('should close when going to a different page', async () => {
    const setLocationMock = vi.fn()

    render(
      <KitchenSink
        states={[{ node: userState, initialValue: { type: UserType.ADMIN } }]}
        setLocation={setLocationMock}
      >
        <ServicesLink />
      </KitchenSink>,
    )

    await userEvent.click(screen.getByText('Services'))
    await userEvent.click(screen.getByText('Players'))

    await waitFor(() => {
      expect(setLocationMock).toHaveBeenLastCalledWith({
        pathname: routes.players,
        state: null,
      })
    })

    await waitFor(() => expect(screen.queryByText('Players')).not.toBeInTheDocument())
  })
})
