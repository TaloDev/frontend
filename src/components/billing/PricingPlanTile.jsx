import { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { IconArrowUp } from '@tabler/icons-react'
import { dinero, toDecimal } from 'dinero.js'
import { USD } from '@dinero.js/currencies'
import Button from '../Button'
import { focusStyle, linkStyle } from '../../styles/theme'
import createCheckoutSession from '../../api/createCheckoutSession'
import ErrorMessage from '../ErrorMessage'
import buildError from '../../utils/buildError'
import ConfirmPlanChange from '../../modals/ConfirmPlanChange'
import Tile from '../Tile'
import pricingPlanActionTypes from '../../constants/pricingPlanActionTypes'

export default function PricingPlanTile({ plan, displayInterval, custom, currentPlanPrice, planLoadingState, current }) {
  const [error, setError] = useState(null)
  const [planLoading, setPlanLoading] = planLoadingState

  const [invoice, setInvoice] = useState(null)

  const isUpgrade = useCallback(() => {
    if (!currentPlanPrice) return true

    return plan.prices.find((price) => price.interval === currentPlanPrice.interval).amount > currentPlanPrice.amount
  }, [plan, currentPlanPrice])

  const getPrice = useCallback(({ prices }) => {
    if (custom) return ''

    const price = prices.find((p) => p.interval === displayInterval)

    const amount = price?.amount
    if (!amount) return 'Free forever'

    const d = dinero({ amount, currency: USD })
    const transformer = ({ value }) => `$${value} / ${price.interval}`
    return toDecimal(d, transformer)
  }, [displayInterval])

  const onChangePlanClick = async () => {
    setError(null)
    setPlanLoading(plan.id)

    try {
      const res = await createCheckoutSession(plan.id, displayInterval)
      if (res.data.redirect) {
        window.location.assign(res.data.redirect)
      } else {
        setInvoice(res.data.invoice)
      }
    } catch (err) {
      setError(buildError(err))
      setPlanLoading(null)
    }
  }

  return (
    <li>
      <Tile
        selected={current}
        header={(
          <>
            <h2 className='text-xl font-semibold'>{plan.name}</h2>
            <h2 className='text-xl font-semibold font-mono'>{getPrice(plan)}</h2>
          </>
        )}
        content={(
          <>
            <ul>
              {plan.actions.map((action) => {
                return (
                  <li key={action.id}>
                    <span className='font-semibold'>{action.limit} {pricingPlanActionTypes[action.type]}</span> {action.trackedMonthly ? 'per month' : ''}
                  </li>
                )
              })}

              {custom &&
                <li>
                  For reduced limits or custom integrations, <a className={`${linkStyle} ${focusStyle}`} href='mailto:hello@trytalo.com?subject=Custom pricing plan'>contact us</a>
                </li>
              }
            </ul>

            {!custom && !current &&
              <Button
                variant={isUpgrade() ? undefined : 'grey'}
                onClick={onChangePlanClick}
                className='!w-40'
                icon={isUpgrade() && <IconArrowUp />}
                isLoading={planLoading === plan.id}
                disabled={Boolean(planLoading)}
              >
                <span>{isUpgrade() ? 'Upgrade' : 'Change plan'}</span>
              </Button>
            }
          </>
        )}
        footer={(
          <>
            {error &&
              <div className='px-4'><ErrorMessage error={error} /></div>
            }

            {invoice &&
              <ConfirmPlanChange
                modalState={[
                  Boolean(invoice),
                  /* c8 ignore next */
                  () => {
                    setInvoice(null)
                    setPlanLoading(null)
                  }
                ]}
                plan={plan}
                invoice={invoice}
                pricingInterval={displayInterval}
              />
            }
          </>
        )}
      />
    </li>
  )
}

PricingPlanTile.propTypes = {
  plan: PropTypes.shape({
    id: PropTypes.number.isRequired,
    actions: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.number.isRequired,
      limit: PropTypes.number.isRequired,
      trackedMonthly: PropTypes.bool.isRequired
    })),
    name: PropTypes.string.isRequired,
    prices: PropTypes.arrayOf(PropTypes.shape({
      amount: PropTypes.number.isRequired,
      currency: PropTypes.string.isRequired,
      interval: PropTypes.string.isRequired
    }))
  }).isRequired,
  displayInterval: PropTypes.string.isRequired,
  custom: PropTypes.bool,
  currentPlanPrice: PropTypes.shape({
    amount: PropTypes.number.isRequired,
    currency: PropTypes.string.isRequired,
    interval: PropTypes.string.isRequired
  }),
  planLoadingState: PropTypes.array.isRequired,
  current: PropTypes.bool
}
