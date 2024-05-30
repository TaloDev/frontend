/// <reference types='cypress' />

describe('Demo', () => {
  it('should let users enter the demo dashboard', () => {
    cy.intercept('POST', 'http://talo.api/public/demo', {
      statusCode: 200,
      fixture: 'responses/auth/dev'
    })

    cy.visitAsGuest('/demo')
    cy.findByText('Launch demo').click()

    cy.findByText('Superstatic dashboard').should('exist')
  })

  it('should handle errors', () => {
    cy.intercept('POST', 'http://talo.api/public/demo', {
      statusCode: 500,
      body: {
        message: 'Something went wrong'
      }
    })

    cy.visitAsGuest('/demo')
    cy.findByText('Launch demo').click()

    cy.findByText('Something went wrong').should('exist')
  })
})
