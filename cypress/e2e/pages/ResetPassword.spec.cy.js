/// <reference types='cypress' />

describe('ResetPassword', () => {
  it('should let users reset their password', () => {
    cy.intercept('POST', 'http://talo.api/public/users/reset_password', {
      statusCode: 204
    })

    cy.visitAsGuest('/reset-password?token=abc123')
    cy.findByLabelText('New password').type('p@ssw0rd')
    cy.findByLabelText('Confirm password').type('p@ssw0rd1')

    cy.findByText('Confirm').should('be.disabled')
    cy.findByLabelText('New password').type('1')
    cy.findByText('Confirm').should('be.enabled')
    cy.findByText('Confirm').click()

    cy.findByText('Success! Your password has been reset').should('exist')
    cy.findByText('Go to Login').click()
    cy.findByText('Talo Game Services').should('exist')
  })

  it('should let users login with valid credentials', () => {
    cy.intercept('POST', 'http://talo.api/public/users/reset_password', {
      statusCode: 401,
      body: {
        message: 'Request expired',
        expired: true
      }
    })

    cy.visitAsGuest('/reset-password?token=abc123')
    cy.findByLabelText('New password').type('p@ssw0rd1')
    cy.findByLabelText('Confirm password').type('p@ssw0rd1')
    cy.findByText('Confirm').click()

    cy.findByText('please request a new reset link').should('exist')
  })
})
