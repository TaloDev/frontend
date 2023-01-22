/// <reference types='cypress' />

describe('Login', () => {
  it('should let users login with valid credentials', () => {
    cy.intercept('POST', 'http://talo.api/public/users/login', {
      statusCode: 200,
      fixture: 'responses/auth/dev'
    })

    cy.visitAsGuest()
    cy.findByLabelText('Email').type('admin@trytalo.com')
    cy.findByLabelText('Password').type('password')
    cy.findByText('Login').click()

    cy.findByText('Superstatic dashboard').should('exist')
  })

  it('should not let users login with invalid credentials', () => {
    cy.intercept('POST', 'http://talo.api/public/users/login', {
      statusCode: 401,
      body: {
        message: 'Incorrect email address or password'
      }
    })

    cy.visitAsGuest()
    cy.findByLabelText('Email').type('admin@trytalo.com')
    cy.findByLabelText('Password').type('passwor')
    cy.findByText('Login').click()

    cy.findByText('Incorrect email address or password').should('exist')
  })
})
