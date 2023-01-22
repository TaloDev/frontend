import { useState } from 'react'
import PropTypes from 'prop-types'
import Modal from '../components/Modal'
import Button from '../components/Button'
import buildError from '../utils/buildError'
import ErrorMessage from '../components/ErrorMessage'
import confirmPlan from '../api/confirmPlan'
import { dinero, toDecimal } from 'dinero.js'
import { USD } from '@dinero.js/currencies'
import { groupBy } from 'lodash-es'
import { format } from 'date-fns'

export default function ConfirmPlanChange({ modalState, plan, pricingInterval, invoice }) {
  const [, setOpen] = modalState
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { lines, total, prorationDate, collectionDate } = invoice

  const onConfirmClick = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await confirmPlan(prorationDate, plan.id, pricingInterval)
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (err) {
      if (err.response?.status === 400) {
        window.location.reload()
      } else {
        setError(buildError(err))
        setLoading(false)
      }
    }
  }

  const formatPrice = (amount) => {
    const d = dinero({ amount, currency: USD })
    const transformer = ({ value }) => `${value < 0 ? '-' : ''}$${Math.abs(value).toFixed(2)}`
    return toDecimal(d, transformer)
  }

  const groupedLines = groupBy(lines, (line) => {
    const startDate = format(new Date(Number(line.period.start) * 1000), 'dd MMM Y')
    const endDate = format(new Date(Number(line.period.end) * 1000), 'dd MMM Y')
    return [startDate, endDate]
  })

  return (
    <Modal
      id='confirm-plan-change'
      title='Confirm plan change'
      modalState={modalState}
    >
      <form>
        <div className='p-4 space-y-4'>
          <div>
            <h3 className='font-semibold'>Upcoming invoice</h3>
            <p className='mt-1'>This is a preview of the invoice that will be billed on {format(new Date(collectionDate * 1000), 'dd MMM Y')}:</p>
          </div>

          <table className='w-full'>
            <thead>
              <tr className='font-semibold'>
                <td className='pb-2'>Description</td>
                <td className='pb-2 text-right'>Price</td>
              </tr>
            </thead>

            {Object.entries(groupedLines).map(([dates, lines]) => {
              const startDate = dates.split(',')[0]
              const endDate = dates.split(',')[1]

              return (
                <tbody key={dates} data-testid={`${startDate} - ${endDate}`}>
                  <tr className='border-y border-y-gray-200 text-xs uppercase text-gray-600'>
                    <td className='py-2'>{startDate} - {endDate}</td>
                    <td />
                  </tr>

                  {lines.sort((a, b) => b.amount - a.amount).map((line) => (
                    <tr key={line.id} className='border-y border-y-gray-200 text-sm font-medium'>
                      <td className='py-2'>{line.description}</td>
                      <td className='py-2 text-right font-mono'>{formatPrice(line.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              )
            })}
            <tbody>
              <tr>
                <td className='pb-2 pt-4 font-semibold'>Total</td>
                <td className='pb-2 pt-4 font-semibold text-right font-mono'>{formatPrice(total)}</td>
              </tr>
            </tbody>
          </table>

          {error && <ErrorMessage error={error} />}
        </div>

        <div className='flex flex-col md:flex-row-reverse md:justify-between space-y-4 md:space-y-0 p-4 border-t border-gray-200'>
          <div className='w-full md:w-32'>
            <Button
              variant='green'
              isLoading={isLoading}
              onClick={onConfirmClick}
            >
              Confirm
            </Button>
          </div>
          <div className='w-full md:w-32'>
            <Button type='button' variant='grey' onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}

ConfirmPlanChange.propTypes = {
  modalState: PropTypes.array.isRequired,
  plan: PropTypes.object.isRequired,
  pricingInterval: PropTypes.string.isRequired,
  invoice: PropTypes.shape({
    lines: PropTypes.array.isRequired,
    total: PropTypes.number.isRequired,
    prorationDate: PropTypes.number.isRequired,
    collectionDate: PropTypes.number.isRequired
  }).isRequired
}
