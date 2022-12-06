import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import React from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import ToastContext from './ToastContext'
import ToastProvider from './ToastProvider'

describe('<ToastProvider />', () => {
  it('should trigger then hide a toast', async () => {
    function ToastDummy() {
      const ctx = useContext(ToastContext)

      useEffect(() => {
        ctx.trigger('Hello!')
      }, [])

      return <div />
    }

    render(
      <ToastProvider>
        <ToastDummy />
      </ToastProvider>
    )

    expect(await screen.findByText('Hello!')).toBeInTheDocument()
    await waitForElementToBeRemoved(screen.queryByText('Hello!'))
  })

  it('should trigger multiple toasts', async () => {
    function ToastDummy() {
      const ctx = useContext(ToastContext)

      useEffect(() => {
        ctx.trigger('Hello!', 'success')
        setTimeout(() => {
          ctx.trigger('Hello again!', 'success')
        }, 100)
      }, [])

      return <div />
    }

    render(
      <ToastProvider>
        <ToastDummy />
      </ToastProvider>
    )

    await waitForElementToBeRemoved(() => screen.queryByText('Hello!'))
    expect(screen.getByText('Hello again!')).toBeInTheDocument()

    await waitForElementToBeRemoved(screen.queryByText('Hello again!'))
  })
})
