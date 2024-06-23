import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ConfirmPlanChange from '../ConfirmPlanChange'
import api from '../../api/api'
import MockAdapter from 'axios-mock-adapter'
import pricingPlanMock from '../../__mocks__/pricingPlanMock'

describe('<ConfirmPlanChange />', () => {
  const axiosMock = new MockAdapter(api)

  const lines = [
    {
      id: '1',
      period: {
        start: 1655024400,
        end: 1657616400
      },
      description: 'Team plan usage',
      amount: 5000
    },
    {
      id: '2',
      period: {
        start: 1655024400,
        end: 1657666799
      },
      description: 'Team plan proration',
      amount: -300
    },
    {
      id: '3',
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
        modalState={[true, vi.fn()]}
        plan={pricingPlanMock()}
        pricingInterval='month'
        invoice={{
          lines,
          total: 13300,
          prorationDate: Math.floor(new Date().getTime() / 1000),
          collectionDate: Math.floor(new Date(2022, 10, 12).getTime() / 1000)
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
    const replyMock = vi.fn(() => [200])
    axiosMock.onPost('http://talo.api/billing/confirm-plan').replyOnce(replyMock)

    const reloadMock = vi.fn()
    vi.stubGlobal('location', { reload: reloadMock })

    render(
      <ConfirmPlanChange
        modalState={[true, vi.fn()]}
        plan={pricingPlanMock()}
        pricingInterval='month'
        invoice={{
          lines,
          total: 13300,
          prorationDate: Math.floor(new Date().getTime() / 1000),
          collectionDate: Math.floor(new Date(2022, 10, 12).getTime() / 1000)
        }}
      />
    )

    await userEvent.click(screen.getByText('Confirm'))

    await waitFor(() => {
      expect(replyMock).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(reloadMock).toHaveBeenCalled()
    })
  })

  it('should reload the page on receiving a 400', async () => {
    axiosMock.onPost('http://talo.api/billing/confirm-plan').replyOnce(400)

    const reloadMock = vi.fn()
    vi.stubGlobal('location', { reload: reloadMock })

    render(
      <ConfirmPlanChange
        modalState={[true, vi.fn()]}
        plan={pricingPlanMock()}
        pricingInterval='month'
        invoice={{
          lines,
          total: 13300,
          prorationDate: Math.floor(new Date().getTime() / 1000),
          collectionDate: Math.floor(new Date(2022, 10, 12).getTime() / 1000)
        }}
      />
    )

    await userEvent.click(screen.getByText('Confirm'))

    await waitFor(() => {
      expect(reloadMock).toHaveBeenCalled()
    })
  })

  it('should render an error if the status code was not a 200 or 400', async () => {
    axiosMock.onPost('http://talo.api/billing/confirm-plan').replyOnce(403)

    render(
      <ConfirmPlanChange
        modalState={[true, vi.fn()]}
        plan={pricingPlanMock()}
        pricingInterval='month'
        invoice={{
          lines,
          total: 13300,
          prorationDate: Math.floor(new Date().getTime() / 1000),
          collectionDate: Math.floor(new Date(2022, 10, 12).getTime() / 1000)
        }}
      />
    )

    await userEvent.click(screen.getByText('Confirm'))

    expect(await screen.findByText('Request failed with status code 403')).toHaveAttribute('role', 'alert')
  })

  it('should close the modal', async () => {
    const closeMock = vi.fn()

    render(
      <ConfirmPlanChange
        modalState={[true, closeMock]}
        plan={pricingPlanMock()}
        pricingInterval='month'
        invoice={{
          lines,
          total: 13300,
          prorationDate: Math.floor(new Date().getTime() / 1000),
          collectionDate: Math.floor(new Date(2022, 10, 12).getTime() / 1000)
        }}
      />
    )

    await userEvent.click(screen.getByText('Cancel'))

    expect(closeMock).toHaveBeenCalled()
  })
})
