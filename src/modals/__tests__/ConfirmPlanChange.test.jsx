import React from 'react'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ConfirmPlanChange from '../ConfirmPlanChange'
import api from '../../api/api'
import MockAdapter from 'axios-mock-adapter'

describe('<ConfirmPlanChange />', () => {
  const axiosMock = new MockAdapter(api)

  beforeAll(() => {
    jest.useFakeTimers('modern')
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  const lines = [
    {
      id: 1,
      period: {
        start: 1655024400,
        end: 1657616400
      },
      description: 'Team plan usage',
      amount: 5000
    },
    {
      id: 2,
      period: {
        start: 1655024400,
        end: 1657666799
      },
      description: 'Team plan proration',
      amount: -300
    },
    {
      id: 3,
      period: {
        start: 1657670400,
        end: 1660345199
      },
      description: 'Business plan usage',
      amount: 8000
    }
  ]

  it('should group invoice lines by the formatted dates', () => {
    render(
      <ConfirmPlanChange
        modalState={[true, jest.fn()]}
        plan={{ id: 1 }}
        pricingInterval='month'
        invoice={{
          lines,
          total: 13300,
          prorationDate: Math.floor(new Date() / 1000),
          collectionDate: Math.floor(new Date(2022, 10, 12) / 1000)
        }}
      />
    )

    expect(screen.getByText('This is a preview of the invoice that will be billed on 12 Nov 2022:')).toBeInTheDocument()

    expect(screen.getByText('12 Jun 2022 - 12 Jul 2022')).toBeInTheDocument()

    let table = screen.getByTestId('12 Jun 2022 - 12 Jul 2022')
    expect(within(table).getByText('Team plan usage')).toBeInTheDocument()
    expect(within(table).getByText('$50.00')).toBeInTheDocument()

    expect(within(table).getByText('Team plan proration')).toBeInTheDocument()
    expect(within(table).getByText('-$3.00')).toBeInTheDocument()

    expect(screen.getByText('13 Jul 2022 - 12 Aug 2022')).toBeInTheDocument()

    table = screen.getByTestId('13 Jul 2022 - 12 Aug 2022')
    expect(within(table).getByText('Business plan usage')).toBeInTheDocument()
    expect(within(table).getByText('$80.00')).toBeInTheDocument()

    expect(screen.getByText('$133.00')).toBeInTheDocument()
  })

  it('should reload the page on success', async () => {
    const replyMock = jest.fn(() => [200])
    axiosMock.onPost('http://talo.test/billing/confirm-plan').replyOnce(replyMock)

    const reloadMock = jest.fn()
    delete window.location
    window.location = { reload: reloadMock }

    render(
      <ConfirmPlanChange
        modalState={[true, jest.fn()]}
        plan={{ id: 1 }}
        pricingInterval='month'
        invoice={{
          lines,
          total: 13300,
          prorationDate: Math.floor(new Date() / 1000),
          collectionDate: Math.floor(new Date(2022, 10, 12) / 1000)
        }}
      />
    )

    userEvent.click(screen.getByText('Confirm'))

    await waitFor(() => {
      expect(replyMock).toHaveBeenCalled()
    })

    jest.runAllTimers()

    await waitFor(() => {
      expect(reloadMock).toHaveBeenCalled()
    })
  })

  it('should reload the page on receiving a 400', async () => {
    axiosMock.onPost('http://talo.test/billing/confirm-plan').replyOnce(400)

    const reloadMock = jest.fn()
    delete window.location
    window.location = { reload: reloadMock }

    render(
      <ConfirmPlanChange
        modalState={[true, jest.fn()]}
        plan={{ id: 1 }}
        pricingInterval='month'
        invoice={{
          lines,
          total: 13300,
          prorationDate: Math.floor(new Date() / 1000),
          collectionDate: Math.floor(new Date(2022, 10, 12) / 1000)
        }}
      />
    )

    userEvent.click(screen.getByText('Confirm'))

    await waitFor(() => {
      expect(reloadMock).toHaveBeenCalled()
    })
  })

  it('should render an error if the status code was not a 200 or 400', async () => {
    axiosMock.onPost('http://talo.test/billing/confirm-plan').replyOnce(403)

    render(
      <ConfirmPlanChange
        modalState={[true, jest.fn()]}
        plan={{ id: 1 }}
        pricingInterval='month'
        invoice={{
          lines,
          total: 13300,
          prorationDate: Math.floor(new Date() / 1000),
          collectionDate: Math.floor(new Date(2022, 10, 12) / 1000)
        }}
      />
    )

    userEvent.click(screen.getByText('Confirm'))

    expect(await screen.findByText('Request failed with status code 403')).toHaveAttribute('role', 'alert')
  })

  it('should close the modal', () => {
    const closeMock = jest.fn()

    render(
      <ConfirmPlanChange
        modalState={[true, closeMock]}
        plan={{ id: 1 }}
        pricingInterval='month'
        invoice={{
          lines,
          total: 13300,
          prorationDate: Math.floor(new Date() / 1000),
          collectionDate: Math.floor(new Date(2022, 10, 12) / 1000)
        }}
      />
    )

    userEvent.click(screen.getByText('Cancel'))

    expect(closeMock).toHaveBeenCalled()
  })
})
