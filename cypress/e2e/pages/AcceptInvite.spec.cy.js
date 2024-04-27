/// <reference types='cypress' />

describe('AcceptInvite', () => {
  it('should let users accept an invite', () => {
    cy.intercept('GET', /http:\/\/talo\.api\/public\/invites\/(.*)/, {
      statusCode: 200,
      body: {
        invite: {
          id: 1,
          email: 'dev@trytalo.com',
          organisation: {
            name: 'Sleepy Studios'
          },
          invitedBy: 'Owner',
          createdAt: '2023-01-01 00:00:00'
        }
      }
    })

    cy.intercept('POST', 'http://talo.api/public/users/register', {
      statusCode: 200,
      fixture: 'responses/auth/dev'
    })

    cy.visitAsGuest('/accept/TRPEPI0BXC')
    cy.findByText('Sleepy Studios').should('exist')

    cy.findByText('Let\'s get started').should('exist')
    cy.findByLabelText('Username').type('sleepy')
    cy.findByLabelText('Password').type('password')

    cy.findByText('Sign up').should('be.disabled')
    cy.findByRole('checkbox').click()
    cy.findByText('Sign up').should('be.enabled')
    cy.findByText('Sign up').click()

    cy.findByText('Superstatic dashboard').should('exist')
  })

  it('should handle missing invites', () => {
    cy.intercept('GET', /http:\/\/talo\.api\/public\/invites\/(.*)/, {
      statusCode: 404,
      body: {
        message: 'Invite not found'
      }
    })

    cy.visitAsGuest('/accept/TRPEPI0BXC')
    cy.findByText('Invite not found').should('exist')
  })
})
