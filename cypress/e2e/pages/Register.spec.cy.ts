describe('Register', () => {
  it('should let users register and create a new game', () => {
    cy.intercept('POST', 'http://talo.api/public/users/register', {
      statusCode: 200,
      fixture: 'responses/auth/register',
    })

    cy.visitAsGuest()
    cy.findByText('Register here').click()

    cy.findByText("Let's get started").should('exist')
    cy.findByLabelText('Team or studio name').type('Sleepy Studios')
    cy.findByLabelText('Username').type('sleepy')
    cy.findByLabelText('Email').type('admin@trytalo.com')
    cy.findByLabelText('Password').type('password')

    cy.findByText('Sign up').should('be.disabled')
    cy.findByRole('checkbox').click()
    cy.findByText('Sign up').should('be.enabled')
    cy.findByText('Sign up').click()

    cy.findByText('New game').should('exist')
    cy.findByText('New game').click()

    cy.findByText('Create new game').should('exist')
  })
})
