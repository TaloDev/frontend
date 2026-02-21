import { IconAlertCircle } from '@tabler/icons-react'
import { format } from 'date-fns'
import { useState } from 'react'
import useOrganisationPricingPlan from '../api/useOrganisationPricingPlan'
import usePricingPlans from '../api/usePricingPlans'
import usePricingPlanUsage from '../api/usePricingPlanUsage'
import BillingPortalTile from '../components/billing/BillingPortalTile'
import BillingUsageTile from '../components/billing/BillingUsageTile'
import PricingPlanTile from '../components/billing/PricingPlanTile'
import ErrorMessage from '../components/ErrorMessage'
import Loading from '../components/Loading'
import Page from '../components/Page'
import SecondaryNav from '../components/SecondaryNav'
import SecondaryTitle from '../components/SecondaryTitle'
import Tile from '../components/Tile'
import Toggle from '../components/toggles/Toggle'
import { secondaryNavRoutes } from '../constants/secondaryNavRoutes'

export default function Billing() {
  const {
    plan: orgPlan,
    loading: orgPlanLoading,
    error: orgPlanError,
  } = useOrganisationPricingPlan()
  const { plans, loading: allPlansLoading, error: allPlansError } = usePricingPlans()
  const { usage, loading: usageLoading, error: usageError } = usePricingPlanUsage()

  const [yearlyPricing, setYearlyPricing] = useState(false)

  const [planLoading, setPlanLoading] = useState<number | null>(null)

  const currentPlan =
    plans.find((plan) => plan.id === orgPlan?.pricingPlan?.id) ?? plans.find((plan) => plan.default)
  const currentPlanPrice =
    currentPlan?.prices.find((price) => price.current) ?? currentPlan?.prices[0]
  const otherPlans = plans.filter((plan) => plan.id !== orgPlan?.pricingPlan?.id)

  if (orgPlanLoading || allPlansLoading || usageLoading) {
    return (
      <div className='flex items-center justify-center'>
        <Loading />
      </div>
    )
  }

  return (
    <Page title='Billing' secondaryNav={<SecondaryNav routes={secondaryNavRoutes} />}>
      <div className='space-y-8 lg:flex lg:space-y-0 lg:space-x-8'>
        <div className='w-full space-y-4 lg:w-1/2'>
          <SecondaryTitle>Current plan</SecondaryTitle>

          {orgPlanError && (
            <div>
              <ErrorMessage error={orgPlanError} />
            </div>
          )}

          <ul className='space-y-2'>
            {currentPlan && (
              <PricingPlanTile
                current
                plan={currentPlan}
                displayInterval={currentPlanPrice!.interval}
                currentPlanPrice={currentPlanPrice}
                planLoadingState={[planLoading, setPlanLoading]}
              />
            )}

            {orgPlan?.endDate && (
              <li>
                <Tile
                  header={
                    <h2 className='text-xl font-semibold'>
                      <IconAlertCircle className='-mt-0.5 mr-2 inline text-red-500' size={24} />
                      Your plan expires on {format(new Date(orgPlan.endDate), 'dd MMM yyyy')}
                    </h2>
                  }
                  content={
                    <div>
                      <p>
                        If you change your mind, you can renew your plan inside the billing portal
                      </p>
                    </div>
                  }
                />
              </li>
            )}

            <BillingUsageTile usage={usage} usageError={usageError} />

            {orgPlan?.canViewBillingPortal && <BillingPortalTile />}
          </ul>
        </div>

        {!orgPlanError && !orgPlan?.pricingPlan.hidden && (
          <div className='w-full space-y-4 lg:w-1/2'>
            <SecondaryTitle>Other plans</SecondaryTitle>

            {allPlansError && (
              <div>
                <ErrorMessage error={allPlansError} />
              </div>
            )}

            <div className='items-center justify-between space-y-4 rounded border border-gray-900 bg-gray-900 p-4 md:flex md:space-y-0'>
              <p className='text-center md:text-left'>
                Get <span className='mx-0.5 rounded bg-indigo-600 p-1 text-sm'>25% off</span> with
                yearly pricing
              </p>

              <div className='flex items-center justify-center space-x-4 rounded'>
                <p className='text-sm font-medium'>Monthly pricing</p>

                <Toggle id='yearly-pricing' enabled={yearlyPricing} onToggle={setYearlyPricing} />

                <p className='text-right text-sm font-medium md:text-left'>Yearly pricing</p>
              </div>
            </div>

            <ul className='mt-2! space-y-2'>
              {otherPlans.map((plan) => (
                <PricingPlanTile
                  key={plan.id}
                  plan={plan}
                  displayInterval={yearlyPricing ? 'year' : 'month'}
                  currentPlanPrice={currentPlanPrice}
                  planLoadingState={[planLoading, setPlanLoading]}
                />
              ))}

              <PricingPlanTile
                custom
                displayInterval={yearlyPricing ? 'year' : 'month'}
                planLoadingState={[planLoading, setPlanLoading]}
              />
            </ul>
          </div>
        )}
      </div>
    </Page>
  )
}
