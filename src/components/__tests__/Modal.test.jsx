import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Modal from '../Modal'

describe('<Modal />', () => {
  it('should close when pressing escape', () => {
    const closeMock = jest.fn()
    const resetMock = jest.fn(closeMock)

    render(
      <Modal
        id='dummy'
        title='Dummy'
        modalState={[true, closeMock]}
        resetModal={resetMock}
      >
        <span>Content</span>
      </Modal>
    )

    userEvent.keyboard('{esc}')

    expect(resetMock).toHaveBeenCalled()
    expect(closeMock).toHaveBeenCalled()
  })

  it('should close when clicking the close button', async () => {
    const closeMock = jest.fn()
    const resetMock = jest.fn(closeMock)

    render(
      <Modal
        id='dummy'
        title='Dummy'
        modalState={[true, closeMock]}
        resetModal={resetMock}
      >
        <span>Content</span>
      </Modal>
    )

    userEvent.click(screen.getByLabelText('Close modal'))

    expect(closeMock).toHaveBeenCalled()
  })
})
