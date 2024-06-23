import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Modal from '../Modal'

describe('<Modal />', () => {
  it('should close when pressing escape', async () => {
    const closeMock = vi.fn()

    render(
      <Modal
        id='dummy'
        title='Dummy'
        modalState={[true, closeMock]}
      >
        <span>Content</span>
      </Modal>
    )

    await userEvent.keyboard('{Escape}')

    expect(closeMock).toHaveBeenCalled()
  })

  it('should close when clicking the close button', async () => {
    const closeMock = vi.fn()

    render(
      <Modal
        id='dummy'
        title='Dummy'
        modalState={[true, closeMock]}
      >
        <span>Content</span>
      </Modal>
    )

    await userEvent.click(screen.getByLabelText('Close modal'))

    expect(closeMock).toHaveBeenCalled()
  })
})
