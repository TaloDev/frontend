import { USD } from '@dinero.js/currencies'
import { IconArrowUp } from '@tabler/icons-react'
import clsx from 'clsx'
import { dinero, toDecimal } from 'dinero.js'
import { useCallback, useState } from 'react'
import createCheckoutSession from '../../api/createCheckoutSession'
import { Invoice } from '../../entities/invoice'
import { PricingPlanProduct, PricingPlanProductPrice } from '../../entities/pricingPlan'
import ConfirmPlanChange from '../../modals/ConfirmPlanChange'
import { focusStyle, linkStyle } from '../../styles/theme'
import buildError from '../../utils/buildError'
import Button from '../Button'
import ErrorMessage, { TaloError } from '../ErrorMessage'
import Tile from '../Tile'

type PricingPlanTileProps = {
  plan?: PricingPlanProduct
  displayInterval: string
  custom?: boolean
  currentPlanPrice?: PricingPlanProductPrice
  planLoadingState: [number | null, (value: number | null) => void]
  current?: boolean
}

export default function PricingPlanTile({
  plan,
  displayInterval,
  custom,
  currentPlanPrice,
  planLoadingState,
  current,
}: PricingPlanTileProps) {
  const [error, setError] = useState<TaloError | null>(null)
  const [planLoading, setPlanLoading] = planLoadingState

  const [invoice, setInvoice] = useState<Invoice | null>(null)

  const isUpgrade = useCallback(() => {
    if (!currentPlanPrice || !plan) return true

    return (
      plan.prices.find((price) => price.interval === currentPlanPrice.interval)!.amount >
      currentPlanPrice.amount
    )
  }, [plan, currentPlanPrice])

  const getPrice = useCallback(
    (plan?: PricingPlanProduct) => {
      if (!plan) return ''

      const price = plan.prices.find((p) => p.interval === displayInterval)

      const amount = price?.amount
      if (!amount) return 'Free forever'

      const d = dinero({ amount, currency: USD })
      const transformer = ({ value }: { value: string }) => `$${value} / ${price.interval}`
      return toDecimal(d, transformer)
    },
    [displayInterval],
  )

  const onChangePlanClick = async () => {
    setError(null)
    setPlanLoading(plan!.id)

    try {
      const { redirect, invoice } = await createCheckoutSession(plan!.id, displayInterval)
      if (redirect) {
        window.location.assign(redirect)
      } else if (invoice) {
        setInvoice(invoice)
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
        header={
          <>
            <h2 className='text-xl font-semibold'>{custom ? 'Custom Plan' : plan!.name}</h2>
            <h2 className='font-mono text-xl font-semibold'>{getPrice(plan)}</h2>
          </>
        }
        content={
          <>
            <ul>
              {!custom && (
                <li>
                  Up to{' '}
                  <span className='font-semibold'>
                    {(plan?.playerLimit ?? Infinity).toLocaleString()}
                  </span>{' '}
                  players
                </li>
              )}

              {custom && (
                <li>
                  For higher limits or custom integrations,{' '}
                  <a
                    className={clsx(linkStyle, focusStyle)}
                    href='mailto:hello@trytalo.com?subject=Custom pricing plan'
                  >
                    contact us
                  </a>
                </li>
              )}
            </ul>

            {!custom && !current && (
              <Button
                variant={isUpgrade() ? undefined : 'grey'}
                onClick={onChangePlanClick}
                className='w-40!'
                icon={isUpgrade() && <IconArrowUp />}
                isLoading={planLoading === plan?.id}
                disabled={Boolean(planLoading)}
              >
                <span>{isUpgrade() ? 'Upgrade' : 'Change plan'}</span>
              </Button>
            )}
          </>
        }
        footer={
          <>
            {error && (
              <div className='px-4'>
                <ErrorMessage error={error} />
              </div>
            )}

            {invoice && (
              <ConfirmPlanChange
                modalState={[
                  Boolean(invoice),
                  /* v8ignore next */
                  () => {
                    setInvoice(null)
                    setPlanLoading(null)
                  },
                ]}
                plan={plan!}
                invoice={invoice}
                pricingInterval={displayInterval}
              />
            )}
          </>
        }
      />
    </li>
  )
}
