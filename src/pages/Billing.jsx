import React, { useState } from 'react'
import Page from '../components/Page'
import ErrorMessage from '../components/ErrorMessage'
import SecondaryNav from '../components/SecondaryNav'
import { secondaryNavRoutes } from './Dashboard'
import usePricingPlans from '../api/usePricingPlans'
import useOrganisationPricingPlan from '../api/useOrganisationPricingPlan'
import Toggle from '../components/toggles/Toggle'
import PricingPlanTile from '../components/billing/PricingPlanTile'
import BillingUsage from '../components/billing/BillingUsage'
import Tile from '../components/Tile'
import { format } from 'date-fns'
import { IconAlertCircle } from '@tabler/icons'
import Loading from '../components/Loading'

export default function Billing() {
  const { plan: orgPlan, loading: orgPlanLoading, error: orgPlanError } = useOrganisationPricingPlan()
  const { plans, loading: allPlansLoading, error: plansError } = usePricingPlans()
  const [yearlyPricing, setYearlyPricing] = useState(false)

  const [planLoading, setPlanLoading] = useState(null)

  const currentPlan = plans.find((plan) => plan.id === orgPlan.pricingPlan?.id) ?? plans.find((plan) => plan.default)
  const currentPlanPrice = currentPlan?.prices.find((price) => price.current) ?? currentPlan?.prices[0]
  const otherPlans = plans.filter((plan) => plan.id !== orgPlan.pricingPlan?.id)

  if (orgPlanLoading || allPlansLoading) {
    return (
      <div className='flex items-center justify-center'>
        <Loading />
      </div>
    )
  }

  return (
    <Page
      title='Billing'
      secondaryNav={<SecondaryNav routes={secondaryNavRoutes} />}
    >
      <div className='lg:flex space-y-8 lg:space-y-0 lg:space-x-8'>
        <div className='w-full lg:w-1/2'>
          <h2 className='text-2xl mb-4'>Current plan</h2>

          {orgPlanError && <div className='mb-4'><ErrorMessage error={orgPlanError} /></div>}

          <ul className='space-y-2'>
            <PricingPlanTile
              current
              plan={currentPlan}
              displayInterval={currentPlanPrice.interval}
              currentPlanPrice={currentPlanPrice.amount}
              planLoadingState={[planLoading, setPlanLoading]}
            />

            {orgPlan.endDate &&
              <li>
                <Tile
                  header={(
                    <h2 className='text-xl font-semibold'>
                      <IconAlertCircle className='inline -mt-0.5 text-red-500 mr-2' size={24} />
                      Your plan expires on {format(new Date(orgPlan.endDate), 'do MMM yyyy')}
                    </h2>
                  )}
                  content={(
                    <div>
                      <p>If you change your mind, you can renew your plan inside the billing portal</p>
                    </div>
                  )}
                />
              </li>
            }

            <BillingUsage />
          </ul>
        </div>

        {!orgPlanError && !orgPlan.pricingPlan.hidden &&
          <div className='w-full lg:w-1/2'>
            <h2 className='text-2xl mb-4'>Other plans</h2>

            {plansError && <div className='mb-4'><ErrorMessage error={plansError} /></div>}

            <div className='md:flex justify-between items-center bg-gray-900 border border-gray-900 rounded p-4 space-y-4 md:space-y-0'>
              <p className='text-center md:text-left'>Get{' '}<span className='text-sm p-1 rounded bg-indigo-600'>10% off</span> with yearly pricing</p>

              <div className='flex items-center justify-center space-x-4 rounded'>
                <p className='text-sm font-medium'>Monthly pricing</p>

                <Toggle id='yearly-pricing' enabled={yearlyPricing} onToggle={setYearlyPricing} />

                <p className='text-sm font-medium text-right md:text-left'>Yearly pricing</p>
              </div>
            </div>

            <ul className='mt-2 space-y-2'>
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
                plan={{ id: 99, actions: [], name: 'Custom', prices: [] }}
                displayInterval={yearlyPricing ? 'year' : 'month'}
                planLoadingState={[planLoading, setPlanLoading]}
              />
            </ul>
          </div>
        }
      </div>
    </Page>
  )
}
