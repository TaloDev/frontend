/// <reference types='cypress' />

describe('Billing', () => {
  function stubBillingCalls() {
    cy.intercept('GET', 'http://talo.api/billing/organisation-plan', {
      statusCode: 200,
      fixture: 'responses/billing/free-plan'
    })

    cy.intercept('GET', 'http://talo.api/billing/plans', {
      statusCode: 200,
      fixture: 'responses/billing/plans'
    })

    cy.intercept('GET', 'http://talo.api/billing/usage', {
      statusCode: 200,
      fixture: 'responses/billing/usage'
    })
  }

  it('should show the correct usages', () => {
    stubBillingCalls()

    cy.login('owner', '/billing')
    cy.findByTestId('User seats-usage').should('contain.text', '0/2')
    cy.findByTestId('Data exports-usage').should('contain.text', '1/3')
  })

  it('should open the billing portal', () => {
    stubBillingCalls()

    cy.intercept('POST', 'http://talo.api/billing/portal-session', {
      statusCode: 200,
      body: {
        redirect: '/portal-session-page'
      }
    }).as('portalSession')

    cy.login('owner', '/billing')
    cy.findByText('Billing Portal').click()

    cy.wait('@portalSession').then(() => {
      cy.url().should('include', 'portal-session-page')
    })
  })

  it('should open the checkout portal', () => {
    stubBillingCalls()

    cy.intercept('POST', 'http://talo.api/billing/checkout-session', {
      statusCode: 200,
      body: {
        redirect: '/checkout-session-page'
      }
    }).as('checkoutSession')

    cy.login('owner', '/billing')
    cy.findAllByText('Upgrade').spread((button) => button.click())

    cy.wait('@checkoutSession').then(() => {
      cy.url().should('include', 'checkout-session-page')
    })
  })

  it('should show the confirm plan change modal', () => {
    stubBillingCalls()

    cy.intercept('POST', 'http://talo.api/billing/checkout-session', {
      statusCode: 200,
      fixture: 'responses/billing/invoice'
    })

    cy.intercept('POST', 'http://talo.api/billing/confirm-plan', {
      statusCode: 204
    })

    cy.login('owner', '/billing')
    cy.findAllByText('Upgrade').spread((button) => button.click())

    cy.findByText('This is a preview of the invoice that will be billed on 12 Aug 2022:').should('exist')
    cy.findByText('12 Jun 2022 - 12 Jul 2022').should('exist')
    cy.findByText('Team plan usage').should('exist')
    cy.findByText('Team plan proration').should('exist')
    cy.findByText('13 Jul 2022 - 12 Aug 2022').should('exist')
    cy.findByText('Studio plan usage').should('exist')

    cy.findByTestId('confirm-plan-change').click()
    cy.findByText('Confirm plan change').should('not.exist')
    cy.findByText('Current plan').should('exist')
  })
})
