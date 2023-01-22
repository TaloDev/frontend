/// <reference types='cypress' />

describe('ForgotPassword', () => {
  it('should let users request a reset link', () => {
    cy.intercept('POST', 'http://talo.api/public/users/forgot_password', {
      statusCode: 204
    })

    cy.visitAsGuest()
    cy.findByText('Forgot your password?').click()
    cy.findByLabelText('Email').type('admin@trytalo.com')
    cy.findByText('Confirm').click()

    cy.findByText('If an account exists for this email, you\'ll receive an email with instructions on how to reset your password').should('exist')
  })
})
