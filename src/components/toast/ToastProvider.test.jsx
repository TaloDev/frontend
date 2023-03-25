import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import { useContext } from 'react'
import { useEffect } from 'react'
import ToastContext from './ToastContext'
import ToastProvider from './ToastProvider'

function ToastDummy() {
  const ctx = useContext(ToastContext)

  useEffect(() => {
    ctx.trigger('Hello!')
  }, [])

  return <div />
}

function MultiToastDummy() {
  const ctx = useContext(ToastContext)

  useEffect(() => {
    ctx.trigger('Hello!', 'success')
    setTimeout(() => {
      ctx.trigger('Hello again!', 'success')
    }, 100)
  }, [])

  return <div />
}

describe('<ToastProvider />', () => {
  it('should trigger then hide a toast', async () => {
    render(
      <ToastProvider lifetime={300}>
        <ToastDummy />
      </ToastProvider>
    )

    expect(await screen.findByText('Hello!')).toBeInTheDocument()
  })

  it('should trigger multiple toasts', async () => {
    render(
      <ToastProvider lifetime={300}>
        <MultiToastDummy />
      </ToastProvider>
    )

    await waitForElementToBeRemoved(() => screen.queryByText('Hello!'))
    expect(screen.getByText('Hello again!')).toBeInTheDocument()
  })
})
