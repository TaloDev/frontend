import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useContext, useRef } from 'react'
import ToastContext from './ToastContext'
import ToastProvider from './ToastProvider'

function ToastDummy() {
  const { trigger } = useContext(ToastContext)
  return (
    <button type='button' onClick={() => trigger('Hello!')}>
      Trigger
    </button>
  )
}

function MultiToastDummy() {
  const { trigger } = useContext(ToastContext)
  const clicks = useRef(0)

  return (
    <button
      type='button'
      onClick={() => {
        trigger(clicks.current === 0 ? 'Hello!' : 'Hello again!')
        clicks.current++
      }}
    >
      Trigger
    </button>
  )
}

describe('<ToastProvider />', () => {
  it('should trigger then hide a toast', async () => {
    render(
      <ToastProvider lifetime={300}>
        <ToastDummy />
      </ToastProvider>,
    )

    await userEvent.click(screen.getByText('Trigger'))
    expect(await screen.findByText('Hello!')).toBeInTheDocument()
  })

  it('should trigger multiple toasts', async () => {
    render(
      <ToastProvider lifetime={300}>
        <MultiToastDummy />
      </ToastProvider>,
    )

    await userEvent.click(screen.getByText('Trigger'))
    expect(await screen.findByText('Hello!')).toBeInTheDocument()

    await userEvent.click(screen.getByText('Trigger'))
    await waitForElementToBeRemoved(() => screen.queryByText('Hello!'))
    expect(await screen.findByText('Hello again!')).toBeInTheDocument()
  })
})
