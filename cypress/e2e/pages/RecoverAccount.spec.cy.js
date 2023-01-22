/// <reference types='cypress' />

describe('RecoverAccount', () => {
  it('should let users log in with a recovery code', () => {
    cy.intercept('POST', 'http://talo.api/public/users/login', {
      statusCode: 200,
      body: {
        twoFactorAuthRequired: true,
        userId: 1
      }
    })

    cy.intercept('POST', 'http://talo.api/public/users/2fa/recover', { fixture: 'responses/auth/dev' })

    cy.visitAsGuest()
    cy.findByLabelText('Email').type('admin@trytalo.com')
    cy.findByLabelText('Password').type('password')
    cy.findByText('Login').click()

    cy.findByText('Two factor authentication').should('exist')
    cy.findByText('use a recovery code').click()

    cy.findByText('Recover account').should('exist')
    cy.findByLabelText('Code').type('abc8d3e31f')
    cy.findByText('Confirm').click()

    cy.findByText('Superstatic dashboard').should('exist')
  })

  it('should show new recovery codes if there are any', () => {
    cy.intercept('POST', 'http://talo.api/public/users/login', {
      statusCode: 200,
      body: {
        twoFactorAuthRequired: true,
        userId: 1
      }
    })

    cy.fixture('responses/auth/dev').then((res) => {
      cy.intercept('POST', 'http://talo.api/public/users/2fa/recover', {
        statusCode: 200,
        body: {
          ...res,
          newRecoveryCodes: ['1', '2', '3', '4']
        }
      })
    })

    cy.visitAsGuest()
    cy.findByLabelText('Email').type('admin@trytalo.com')
    cy.findByLabelText('Password').type('password')
    cy.findByText('Login').click()

    cy.findByText('Two factor authentication').should('exist')
    cy.findByText('use a recovery code').click()

    cy.findByText('Recover account').should('exist')
    cy.findByLabelText('Code').type('abc8d3e31f')
    cy.findByText('Confirm').click()

    cy.findByText('New recovery codes').should('exist')
    cy.findByText('Continue').click()
    cy.findByText('Superstatic dashboard').should('exist')
  })

  it('should not let users log in with an invalid recovery code', () => {
    cy.intercept('POST', 'http://talo.api/public/users/login', {
      statusCode: 200,
      body: {
        twoFactorAuthRequired: true,
        userId: 1
      }
    })

    cy.intercept('POST', 'http://talo.api/public/users/2fa/recover', {
      statusCode: 403,
      body: {
        message: 'Invalid code'
      }
    })

    cy.visitAsGuest()
    cy.findByLabelText('Email').type('admin@trytalo.com')
    cy.findByLabelText('Password').type('password')
    cy.findByText('Login').click()

    cy.findByText('Two factor authentication').should('exist')
    cy.findByText('use a recovery code').click()

    cy.findByText('Recover account').should('exist')
    cy.findByLabelText('Code').type('abc8d3e31f')
    cy.findByText('Confirm').click()

    cy.findByText('Invalid code').should('exist')
  })
})
