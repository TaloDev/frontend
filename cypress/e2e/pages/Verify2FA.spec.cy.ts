describe('Verify2FA', () => {
  it('should let 2fa users log in', () => {
    cy.intercept('POST', 'http://talo.api/public/users/login', {
      statusCode: 200,
      body: {
        twoFactorAuthRequired: true,
        userId: 1,
      },
    })

    cy.intercept('POST', 'http://talo.api/public/users/2fa', { fixture: 'responses/auth/dev' })

    cy.visitAsGuest()
    cy.findByLabelText('Email').type('admin@trytalo.com')
    cy.findByLabelText('Password').type('password')
    cy.findByText('Login').click()

    cy.findByText('Two factor authentication').should('exist')
    cy.findByLabelText('Code').type('123456')
    cy.findByText('Confirm').click()

    cy.findByText('Superstatic dashboard').should('exist')
  })

  it('should let 2fa users log in', () => {
    cy.intercept('POST', 'http://talo.api/public/users/login', {
      statusCode: 200,
      body: {
        twoFactorAuthRequired: true,
        userId: 1,
      },
    })

    cy.intercept('POST', 'http://talo.api/public/users/2fa', {
      statusCode: 403,
      body: {
        message: 'Invalid code',
      },
    })

    cy.visitAsGuest()
    cy.findByLabelText('Email').type('admin@trytalo.com')
    cy.findByLabelText('Password').type('password')
    cy.findByText('Login').click()

    cy.findByText('Two factor authentication').should('exist')
    cy.findByLabelText('Code').type('123456')
    cy.findByText('Confirm').click()

    cy.findByText('Invalid code').should('exist')
  })
})
